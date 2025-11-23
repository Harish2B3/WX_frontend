// API implementation to connect the frontend to the live backend with authentication.
import { RecentFile, User, SearchFilters } from '../types';

const API_BASE_URL = 'https://wx-backend.onrender.com/api';

const getToken = () => localStorage.getItem('authToken');

// Helper for standard JSON fetch requests with authentication
const apiFetch = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, { ...options, headers });
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Force logout on auth errors
                window.dispatchEvent(new Event('auth-error'));
            }
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || response.statusText || `Request failed with status ${response.status}`);
        }
        if (response.headers.get('Content-Length') === '0' || response.status === 204) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.error(`API request to ${url} failed:`, error);
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error('Connection to the backend failed. Is the server running? Please run `npm install && npm start` in the `backend` directory.');
        }
        throw error;
    }
};

// --- Auth Endpoints ---
export const register = async (userData: any) => {
    return apiFetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const login = async (credentials: any): Promise<{ token: string; user: User }> => {
    return apiFetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

// --- File & Folder Endpoints ---
export const getFiles = async (parentId: string = 'root') => {
  return await apiFetch(`${API_BASE_URL}/files/${parentId}`);
};

export const createFolder = async (folderName: string, parentId: string) => {
    return await apiFetch(`${API_BASE_URL}/folders`, {
        method: 'POST',
        body: JSON.stringify({ folderName, parentId })
    });
};

// --- Upload/Download with Progress ---
export const uploadFile = (file: File, parentId: string, onProgress: (progress: number) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE_URL}/files/upload/${parentId}`, true);
        
        const token = getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                onProgress(percentComplete);
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                onProgress(100);
                resolve(JSON.parse(xhr.responseText));
            } else {
                const errorData = JSON.parse(xhr.responseText || '{}');
                reject(new Error(errorData.message || `Upload failed with status: ${xhr.status}`));
            }
        };

        xhr.onerror = () => {
            reject(new Error('Network error during upload.'));
        };

        xhr.send(formData);
    });
};

export const downloadFileWithProgress = async (file: RecentFile, onProgress: (progress: number) => void) => {
    const response = await fetch(`${API_BASE_URL}/files/download/${file.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}`}));
        throw new Error(errorData.message || 'Download failed');
    }

    const contentLength = response.headers.get('content-length');
    if (!contentLength || !response.body) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onProgress(100);
        return;
    }

    const total = parseInt(contentLength, 10);
    let loaded = 0;
    const reader = response.body.getReader();
    const stream = new ReadableStream({
        start(controller) {
            function push() {
                reader.read().then(({ done, value }) => {
                    if (done) { onProgress(100); controller.close(); return; }
                    loaded += value.length;
                    onProgress((loaded / total) * 100);
                    controller.enqueue(value);
                    push();
                }).catch(error => { console.error('Error in stream', error); controller.error(error); });
            }
            push();
        }
    });

    const blob = await new Response(stream).blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const downloadFolderAsZip = async (folder: RecentFile, onProgress: (progress: number) => void) => {
    const response = await fetch(`${API_BASE_URL}/folders/zip/${folder.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}`}));
        throw new Error(errorData.message || 'Folder download failed');
    }

    const contentLength = response.headers.get('content-length');
    if (!contentLength || !response.body) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${folder.name}.zip`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        onProgress(100);
        return;
    }

    const total = parseInt(contentLength, 10);
    let loaded = 0;
    const reader = response.body.getReader();
    const stream = new ReadableStream({
        start(controller) {
            function push() {
                reader.read().then(({ done, value }) => {
                    if (done) { onProgress(100); controller.close(); return; }
                    loaded += value.length;
                    onProgress((loaded / total) * 100);
                    controller.enqueue(value);
                    push();
                }).catch(error => { console.error('Error in stream', error); controller.error(error); });
            }
            push();
        }
    });

    const blob = await new Response(stream).blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${folder.name}.zip`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
};

export const getFilePreviewUrl = async (file: RecentFile): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/files/download/${file.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}`}));
        throw new Error(errorData.message || 'Download failed for preview');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
};

export const getFileAsText = async (file: RecentFile): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/files/download/${file.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}`}));
        throw new Error(errorData.message || 'Download failed for text content');
    }

    return response.text();
};


// --- Bulk Operations ---
export const trashFiles = async (fileIds: string[]) => {
    return await apiFetch(`${API_BASE_URL}/files/trash`, { method: 'PUT', body: JSON.stringify({ fileIds }) });
};

export const restoreFiles = async (fileIds: string[]) => {
    return await apiFetch(`${API_BASE_URL}/files/restore`, { method: 'PUT', body: JSON.stringify({ fileIds }) });
};

export const deleteFilesPermanently = async (fileIds: string[]) => {
    return await apiFetch(`${API_BASE_URL}/files/permanent`, { method: 'DELETE', body: JSON.stringify({ fileIds }) });
};

export const moveFiles = async (fileIds: string[], destinationParentId: string) => {
    return await apiFetch(`${API_BASE_URL}/files/move`, { method: 'PUT', body: JSON.stringify({ fileIds, destinationParentId }) });
};

// --- Trash View ---
export const getTrashedFiles = async () => {
    return await apiFetch(`${API_BASE_URL}/trash`);
}

export const emptyTrash = async () => {
    return await apiFetch(`${API_BASE_URL}/trash`, { method: 'DELETE' });
};

// --- Favorites and Quick Access ---
export const toggleFavoriteStatus = async (fileId: string): Promise<{ success: boolean, isFavorite: boolean }> => {
    return await apiFetch(`${API_BASE_URL}/files/favorite/${fileId}`, { method: 'PUT' });
};

export const getFavoriteFiles = async () => {
    return await apiFetch(`${API_BASE_URL}/files/favorites`);
};

export const toggleQuickAccessStatus = async (fileId: string): Promise<{ success: boolean, isQuickAccess: boolean }> => {
    return await apiFetch(`${API_BASE_URL}/files/quickaccess/${fileId}`, { method: 'PUT' });
};

export const getQuickAccessFiles = async () => {
    return await apiFetch(`${API_BASE_URL}/files/quickaccess`);
};

// --- Search ---
export const searchFiles = async (query: string, filters: SearchFilters): Promise<any[]> => {
    const params = new URLSearchParams({
        query,
    });
    if (filters.type !== 'all') params.append('type', filters.type);
    if (filters.dateRange !== 'any') params.append('dateRange', filters.dateRange);
    if (filters.sizeRange !== 'any') params.append('sizeRange', filters.sizeRange);
    
    return await apiFetch(`${API_BASE_URL}/search?${params.toString()}`);
};

// --- Stats ---
export const getTotalStorageUsed = async (): Promise<number> => {
    const { totalSize } = await apiFetch(`${API_BASE_URL}/stats/storage`);
    return totalSize;
};

export const getStorageStats = async (): Promise<Record<string, { totalSize: number, count: number }>> => {
    return await apiFetch(`${API_BASE_URL}/stats/categories`);
};

export const getTrashStats = async (): Promise<{ totalSize: number, count: number }> => {
    return await apiFetch(`${API_BASE_URL}/stats/trash`);
};