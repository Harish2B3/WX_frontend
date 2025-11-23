
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StorageOverview from './components/StorageOverview';
import RecentFiles from './components/RecentFiles';
import FileManager from './components/FileManager';
import TrashManager from './components/TrashManager';
import FavoritesManager from './components/FavoritesManager';
import QuickAccessManager from './components/QuickAccessManager';
import CreateFolderModal from './components/CreateFolderModal';
import MoveFileModal from './components/MoveFileModal';
import FileEditor from './components/FileEditor';
import { 
    getFiles, 
    uploadFile, 
    trashFiles as apiTrashFiles, 
    createFolder as apiCreateFolder, 
    moveFiles as apiMoveFiles, 
    getTotalStorageUsed, 
    getStorageStats, 
    downloadFileWithProgress,
    downloadFolderAsZip,
    getTrashedFiles,
    restoreFiles as apiRestoreFiles,
    deleteFilesPermanently as apiDeletePermanently,
    emptyTrash as apiEmptyTrash,
    getTrashStats,
    searchFiles,
    getFavoriteFiles,
    toggleFavoriteStatus as apiToggleFavoriteStatus,
    getQuickAccessFiles,
    toggleQuickAccessStatus as apiToggleQuickAccessStatus
} from './services/api';
import { RecentFile, StorageCategory, SearchResultFile, User, SearchFilters } from './types';
import { getFileIcon } from './utils/fileIcons';
import { storageCategories as staticCategories } from './constants/data';
import ProgressLoader from './components/ProgressLoader';
import { FileTypeIcon, TrashIcon } from './constants/icons';

interface ProgressInfo {
  id: string;
  type: 'upload' | 'download';
  fileName: string;
  progress: number;
  status?: 'uploading' | 'processing' | 'downloading';
}

interface AppProps {
    user: User;
    onLogout: () => void;
}

const App: React.FC<AppProps> = ({ user, onLogout }) => {
  const [files, setFiles] = useState<RecentFile[]>([]);
  const [trashedFiles, setTrashedFiles] = useState<RecentFile[]>([]);
  const [favoriteFiles, setFavoriteFiles] = useState<RecentFile[]>([]);
  const [quickAccessFiles, setQuickAccessFiles] = useState<RecentFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  
  const [currentView, setCurrentView] = useState<'overview' | 'storage' | 'trash' | 'favorites' | 'quickaccess'>('overview');
  const [currentPath, setCurrentPath] = useState<{ id: string; name: string }[]>([{ id: 'root', name: 'Drive' }]);
  const [totalStorageUsed, setTotalStorageUsed] = useState(0);
  const [storageCategories, setStorageCategories] = useState<StorageCategory[]>(staticCategories);
  const [filesToMove, setFilesToMove] = useState<RecentFile[] | null>(null);
  const [editingFile, setEditingFile] = useState<RecentFile | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [progressInfo, setProgressInfo] = useState<ProgressInfo[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deletingFileIds, setDeletingFileIds] = useState<string[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultFile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    type: 'all',
    dateRange: 'any',
    sizeRange: 'any',
  });

  const currentFolderId = currentPath[currentPath.length - 1].id;

  const formatFiles = (fetchedFiles: any[]): RecentFile[] => {
    return fetchedFiles.map((file: any) => ({
      id: file._id,
      name: file.fileName,
      size: file.fileSize ? (file.fileSize / (1024 * 1024)).toFixed(2) + ' MB' : '--',
      shared: 'Me',
      lastModified: new Date(file.updatedAt).toLocaleDateString(),
      lastModifiedTimestamp: file.updatedAt,
      icon: getFileIcon(file.mimeType),
      mimeType: file.mimeType,
      parentId: file.parentId,
      previewUrl: file.previewUrl,
      trashedAt: file.trashedAt ? new Date(file.trashedAt).toLocaleDateString() : undefined,
      isFavorite: file.isFavorite || false,
      isQuickAccess: file.isQuickAccess || false,
      path: file.path,
    }));
  };

  const sortFiles = (filesToSort: RecentFile[]): RecentFile[] => {
    return filesToSort.sort((a, b) => {
        const isAFolder = a.mimeType === 'application/vnd.wormx-cloud.folder';
        const isBFolder = b.mimeType === 'application/vnd.wormx-cloud.folder';

        if (isAFolder && !isBFolder) return -1;
        if (!isAFolder && isBFolder) return 1;
        
        return new Date(b.lastModifiedTimestamp).getTime() - new Date(a.lastModifiedTimestamp).getTime();
    });
  };

  const handleFetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedFiles = await getFiles(currentFolderId);
      const formatted = formatFiles(fetchedFiles);
      const sorted = sortFiles(formatted);
      setFiles(sorted);
    } catch (err: any) {
      setError(`Failed to fetch files: ${err.message || 'Please try again.'}`);
      setFiles([]);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId]);

  const handleFetchTrashedFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const fetchedFiles = await getTrashedFiles();
        const formatted = formatFiles(fetchedFiles);
        // Sort by trashed date, newest first
        formatted.sort((a, b) => new Date(b.trashedAt!).getTime() - new Date(a.trashedAt!).getTime());
        setTrashedFiles(formatted);
    } catch (err: any) {
        setError(`Failed to fetch trashed files: ${err.message || 'Please try again.'}`);
        setTrashedFiles([]);
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const handleFetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const fetchedFiles = await getFavoriteFiles();
        const formatted = formatFiles(fetchedFiles);
        setFavoriteFiles(formatted);
    } catch (err: any) {
        setError(`Failed to fetch favorite files: ${err.message || 'Please try again.'}`);
        setFavoriteFiles([]);
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, []);
  
  const handleFetchQuickAccessFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const fetchedFiles = await getQuickAccessFiles();
        const formatted = formatFiles(fetchedFiles);
        setQuickAccessFiles(formatted);
    } catch (err: any) {
        setError(`Failed to fetch quick access files: ${err.message || 'Please try again.'}`);
        setQuickAccessFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setSelectedFileIds([]);
  }, [currentFolderId, currentView]);

  const fetchStorageMetrics = useCallback(async () => {
    try {
        const [used, stats, trashStats] = await Promise.all([
            getTotalStorageUsed(),
            getStorageStats(),
            getTrashStats()
        ]);
        
        setTotalStorageUsed(used);

        const updatedCategories = staticCategories.map(category => {
            const categoryStats = stats[category.id];
            return {
                ...category,
                itemCount: categoryStats?.count || 0,
                storageUsed: categoryStats?.totalSize || 0,
            };
        });

        const trashCategory: StorageCategory = {
            id: 'trash',
            name: 'Trash Bin',
            icon: React.createElement(FileTypeIcon, { color: "bg-mono-gray-light", children: React.createElement(TrashIcon) }),
            itemCount: trashStats.count,
            storageUsed: trashStats.totalSize,
            storageTotal: 0,
            color: 'bg-gradient-to-r from-gray-500 to-gray-600'
        };

        setStorageCategories([...updatedCategories, trashCategory]);

    } catch (err) {
        console.error("Could not fetch storage data:", err);
    }
  }, []);

  useEffect(() => {
      if(currentView === 'trash') {
          handleFetchTrashedFiles();
      } else if (currentView === 'favorites') {
          handleFetchFavorites();
      } else if (currentView === 'quickaccess') {
          handleFetchQuickAccessFiles();
      } else {
          handleFetchFiles();
      }
    fetchStorageMetrics();
  }, [handleFetchFiles, fetchStorageMetrics, currentView, handleFetchTrashedFiles, handleFetchFavorites, handleFetchQuickAccessFiles]);

  const handleUpload = async (file: File) => {
    const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`Upload failed for ${file.name}: File is too large. The maximum upload size is 50 MB.`);
        return;
    }

    const uploadId = `${file.name}-${file.size}-${Date.now()}`;
    setProgressInfo(prev => [...prev, { id: uploadId, type: 'upload', fileName: file.name, progress: 0, status: 'uploading' }]);
    setError(null);
    try {
      const newFileDoc = await uploadFile(file, currentFolderId, (progress) => {
        setProgressInfo(prev => prev.map(p => {
            if (p.id !== uploadId) return p;
            const newStatus = progress < 100 ? 'uploading' : 'processing';
            return { ...p, progress, status: newStatus };
        }));
      });

      // Optimistic update to avoid race conditions with fetching
      const [formattedFile] = formatFiles([newFileDoc]);
      setFiles(prevFiles => sortFiles([formattedFile, ...prevFiles]));

      // Brief pause to show "Processing..." and 100% before it disappears for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await fetchStorageMetrics();
      
    } catch (err: any) {
      setError(`Upload failed for ${file.name}: ${err.message || 'Please try again.'}`);
      console.error(err);
    } finally {
      setProgressInfo(prev => prev.filter(p => p.id !== uploadId));
    }
  };

  const handleTrashFiles = async (fileIds: string[]) => {
    setError(null);
    setDeletingFileIds(fileIds);
  
    setTimeout(async () => {
      try {
        await apiTrashFiles(fileIds);
        
        setFiles(prevFiles => prevFiles.filter(file => !fileIds.includes(file.id)));
        setTrashedFiles(prevFiles => prevFiles.filter(file => !fileIds.includes(file.id)));
        setFavoriteFiles(prevFiles => prevFiles.filter(file => !fileIds.includes(file.id)));
        setQuickAccessFiles(prevFiles => prevFiles.filter(file => !fileIds.includes(file.id)));
        
        setSelectedFileIds(prev => prev.filter(id => !fileIds.includes(id)));
        await fetchStorageMetrics();
      } catch (err: any) {
        setError(`Failed to move files to trash: ${err.message || 'Please try again.'}`);
        console.error(err);
      } finally {
        setDeletingFileIds([]);
      }
    }, 800);
  };
  
  const handleOpenCreateFolderModal = () => {
      setCreateFolderModalOpen(true);
  };

  const handleCreateFile = () => {
    fileInputRef.current?.click();
  };

  const handleCreateFolder = async (folderName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiCreateFolder(folderName, currentFolderId);
      setCreateFolderModalOpen(false);
      await handleFetchFiles();
    } catch (err: any) {
      setError(`Folder creation failed: ${err.message || 'Please try again.'}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesToUpload = Array.from(e.target.files).slice(0, 10);
      filesToUpload.forEach(file => handleUpload(file));
      if (e.target) e.target.value = '';
    }
  };

  const handleFolderClick = (file: RecentFile) => {
    if(file.mimeType === 'application/vnd.wormx-cloud.folder') {
        setCurrentPath(prev => [...prev, { id: file.id, name: file.name }]);
    }
  }

  const handleBreadcrumbClick = (index: number) => {
    setCurrentPath(prev => prev.slice(0, index + 1));
  };
  
  const handleDownload = async (file: RecentFile) => {
    const downloadId = `${file.id}-${Date.now()}`;
    setProgressInfo(prev => [...prev, { id: downloadId, type: 'download', fileName: file.name, progress: 0 }]);
    try {
      if (file.mimeType === 'application/vnd.wormx-cloud.folder') {
        await downloadFolderAsZip(file, (progress) => {
          setProgressInfo(prev => prev.map(p => p.id === downloadId ? { ...p, progress, fileName: `${file.name}.zip` } : p));
        });
      } else {
        await downloadFileWithProgress(file, (progress) => {
          setProgressInfo(prev => prev.map(p => p.id === downloadId ? { ...p, progress } : p));
        });
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err: any) {
      setError(`Failed to download ${file.name}: ${err.message || 'Please try again.'}`);
      console.error(err);
    } finally {
      setProgressInfo(prev => prev.filter(p => p.id !== downloadId));
    }
  };

  const handleDownloadFiles = async (filesToDownload: RecentFile[]) => {
    filesToDownload.forEach(file => handleDownload(file));
  };


  const handleOpenMoveModal = (files: RecentFile[]) => {
    setFilesToMove(files);
  };

  const handleCloseMoveModal = () => {
    setFilesToMove(null);
  };

  const handleMoveFiles = async (destinationId: string) => {
    if (!filesToMove) return;

    setIsLoading(true);
    setError(null);
    try {
        const fileIdsToMove = filesToMove.map(f => f.id);
        await apiMoveFiles(fileIdsToMove, destinationId);
        handleCloseMoveModal();
        setSelectedFileIds([]);
        await handleFetchFiles();
        if(currentView === 'favorites') await handleFetchFavorites();
    } catch (err: any) {
        setError(`Failed to move files: ${err.message || 'Please try again.'}`);
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleOpenFile = (file: RecentFile) => {
    setEditingFile(file);
  };

  const handleCloseEditor = () => {
    setEditingFile(null);
  };
  
  const handleSelectFile = (fileId: string) => {
    setSelectedFileIds(prev =>
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    let currentFiles: RecentFile[] = [];
    switch(currentView) {
        case 'trash':
            currentFiles = trashedFiles;
            break;
        case 'favorites':
            currentFiles = favoriteFiles;
            break;
        case 'quickaccess':
            currentFiles = quickAccessFiles;
            break;
        default:
            currentFiles = files;
            break;
    }
    if (selectedFileIds.length === currentFiles.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(currentFiles.map(f => f.id));
    }
  };
  
  const clearSelection = () => {
    setSelectedFileIds([]);
  };

  const handleRestoreFiles = async (fileIds: string[]) => {
    setError(null);
    setDeletingFileIds(fileIds);

    setTimeout(async () => {
        try {
            await apiRestoreFiles(fileIds);
            setSelectedFileIds(prev => prev.filter(id => !fileIds.includes(id)));
            await handleFetchTrashedFiles();
        } catch(err: any) {
            setError(`Failed to restore files: ${err.message || 'Please try again.'}`);
            console.error(err);
        } finally {
            setDeletingFileIds([]);
        }
    }, 800);
  };

  const handleDeletePermanently = async (fileIds: string[]) => {
    setError(null);
    setDeletingFileIds(fileIds);

    setTimeout(async () => {
        try {
            await apiDeletePermanently(fileIds);
            setSelectedFileIds(prev => prev.filter(id => !fileIds.includes(id)));
            await handleFetchTrashedFiles();
            await fetchStorageMetrics();
        } catch(err: any) {
            setError(`Failed to permanently delete files: ${err.message || 'Please try again.'}`);
            console.error(err);
        } finally {
            setDeletingFileIds([]);
        }
    }, 800);
  };

  const handleEmptyTrash = async () => {
    const allTrashIds = trashedFiles.map(f => f.id);
    setDeletingFileIds(allTrashIds);

    setTimeout(async () => {
        try {
            await apiEmptyTrash();
            setSelectedFileIds([]);
            await handleFetchTrashedFiles();
        } catch(err: any) {
            setError(`Failed to empty trash: ${err.message || 'Please try again.'}`);
            console.error(err);
        } finally {
            setDeletingFileIds([]);
        }
    }, 800);
  };
  
  const handleSearch = useCallback(async (query: string, filters: SearchFilters) => {
    if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
    }
    setIsSearching(true);
    try {
        const results = await searchFiles(query, filters);
        const formattedResults = results.map(file => ({
            ...formatFiles([file])[0],
            path: file.path
        }));
        setSearchResults(formattedResults);
    } catch (error: any) {
        setError(`Search failed: ${error.message || 'Please try again.'}`);
        setSearchResults([]);
    } finally {
        setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
    }
    if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
    }
    
    searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery, searchFilters);
    }, 300);

    return () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    };
  }, [searchQuery, searchFilters, handleSearch]);
  
  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({...prev, ...newFilters}));
  };

  const handleClearFilters = () => {
    setSearchFilters({ type: 'all', dateRange: 'any', sizeRange: 'any' });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  const handleSearchResultClick = (result: SearchResultFile) => {
    if (result.mimeType === 'application/vnd.wormx-cloud.folder') {
        setCurrentPath(result.path);
        setCurrentView('storage');
    } else {
        setEditingFile(result);
    }
    handleClearSearch();
    setIsSearchFocused(false);
  };

  const handleToggleFavorite = async (fileId: string) => {
    try {
        const allKnownFiles = [...files, ...trashedFiles, ...searchResults, ...favoriteFiles, ...quickAccessFiles];
        const fileToUpdate = allKnownFiles.find(f => f.id === fileId);

        if (!fileToUpdate) {
            console.error("Could not find file to update favorite status.");
            return; 
        }

        const { isFavorite } = await apiToggleFavoriteStatus(fileId);
        const updatedFile = { ...fileToUpdate, isFavorite };

        const updateOrKeep = (arr: any[]) => arr.map(f => f.id === fileId ? updatedFile : f);

        setFiles(updateOrKeep);
        setTrashedFiles(updateOrKeep);
        setSearchResults(updateOrKeep);
        setQuickAccessFiles(updateOrKeep);

        if (isFavorite) {
            setFavoriteFiles(prev => {
                if (prev.some(f => f.id === fileId)) {
                    return prev.map(f => f.id === fileId ? updatedFile : f);
                }
                return [...prev, updatedFile];
            });
        } else {
            setFavoriteFiles(prev => prev.filter(f => f.id !== fileId));
        }

    } catch (err: any) {
        setError(`Failed to update favorite status: ${err.message || 'Please try again.'}`);
        console.error(err);
    }
  };

  const handleToggleQuickAccess = async (fileId: string) => {
    try {
        const allKnownFiles = [...files, ...trashedFiles, ...searchResults, ...favoriteFiles, ...quickAccessFiles];
        const fileToUpdate = allKnownFiles.find(f => f.id === fileId);
        if (!fileToUpdate) { 
            console.error("Could not find file to update quick access status.");
            return;
        }
        
        const { isQuickAccess } = await apiToggleQuickAccessStatus(fileId);
        const updatedFile = { ...fileToUpdate, isQuickAccess };

        const updateOrKeep = (arr: any[]) => arr.map(f => f.id === fileId ? updatedFile : f);

        setFiles(updateOrKeep);
        setTrashedFiles(updateOrKeep);
        setSearchResults(updateOrKeep);
        setFavoriteFiles(updateOrKeep);

        if (isQuickAccess) {
            setQuickAccessFiles(prev => {
                if (prev.some(f => f.id === fileId)) {
                    return prev.map(f => f.id === fileId ? updatedFile : f);
                }
                return [...prev, updatedFile];
            });
        } else {
            setQuickAccessFiles(prev => prev.filter(f => f.id !== fileId));
        }

    } catch (err: any) {
        setError(`Failed to update quick access status: ${err.message || 'Please try again.'}`);
        console.error(err);
    }
  };

  const navigateToPath = (path: { id: string; name: string }[]) => {
    setCurrentPath(path);
    setCurrentView('storage');
  };

  const totalStorageUsedMB = (totalStorageUsed / (1024*1024)).toFixed(2);
  
  if (editingFile) {
    return (
        <FileEditor file={editingFile} onClose={handleCloseEditor} />
    );
  }

  const renderContent = () => {
    switch(currentView) {
        case 'overview': {
            const recentFilesOnly = files.filter(f => f.mimeType !== 'application/vnd.wormx-cloud.folder').slice(0, 5);
            
            const handleSelectAllForRecents = () => {
                const recentFileIds = recentFilesOnly.map(f => f.id);
                const allRecentsSelected = recentFileIds.length > 0 && recentFileIds.every(id => selectedFileIds.includes(id));

                if (allRecentsSelected) {
                    setSelectedFileIds(prev => prev.filter(id => !recentFileIds.includes(id)));
                } else {
                    setSelectedFileIds(prev => [...new Set([...prev, ...recentFileIds])]);
                }
            };

            return <>
                <StorageOverview 
                    categories={storageCategories}
                    totalStorageUsedInBytes={totalStorageUsed}
                    onCreateFile={handleCreateFile} 
                    onCreateFolder={handleOpenCreateFolderModal}
                />
                <RecentFiles 
                  files={recentFilesOnly} 
                  isLoading={isLoading} 
                  onDelete={(fileId) => handleTrashFiles([fileId])}
                  onDownload={handleDownload}
                  onMove={(file) => handleOpenMoveModal([file])}
                  onOpenFile={handleOpenFile}
                  selectedFileIds={selectedFileIds}
                  onSelectFile={handleSelectFile}
                  onSelectAll={handleSelectAllForRecents}
                  onDeleteFiles={handleTrashFiles}
                  onMoveFiles={handleOpenMoveModal}
                  onDownloadFiles={handleDownloadFiles}
                  clearSelection={clearSelection}
                  deletingFileIds={deletingFileIds}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleQuickAccess={handleToggleQuickAccess}
                />
            </>;
        }
        case 'storage':
            return <FileManager
                files={files}
                isLoading={isLoading}
                onDelete={(fileId) => handleTrashFiles([fileId])}
                onDownload={handleDownload}
                onMove={(file) => handleOpenMoveModal([file])}
                onCreateFile={handleCreateFile}
                onCreateFolder={handleOpenCreateFolderModal}
                currentPath={currentPath}
                onFolderClick={handleFolderClick}
                onBreadcrumbClick={handleBreadcrumbClick}
                onOpenFile={handleOpenFile}
                selectedFileIds={selectedFileIds}
                onSelectFile={handleSelectFile}
                onSelectAll={handleSelectAll}
                onDeleteFiles={handleTrashFiles}
                onMoveFiles={handleOpenMoveModal}
                onDownloadFiles={handleDownloadFiles}
                clearSelection={clearSelection}
                deletingFileIds={deletingFileIds}
                onToggleFavorite={handleToggleFavorite}
                onToggleQuickAccess={handleToggleQuickAccess}
            />;
        case 'trash':
            return <TrashManager
                files={trashedFiles}
                isLoading={isLoading}
                onRestoreFiles={handleRestoreFiles}
                onDeletePermanently={handleDeletePermanently}
                onEmptyTrash={handleEmptyTrash}
                selectedFileIds={selectedFileIds}
                onSelectFile={handleSelectFile}
                onSelectAll={handleSelectAll}
                clearSelection={clearSelection}
                deletingFileIds={deletingFileIds}
            />;
        case 'favorites':
            return <FavoritesManager
                files={favoriteFiles}
                isLoading={isLoading}
                onDeleteFiles={handleTrashFiles}
                onDownloadFiles={handleDownloadFiles}
                onMoveFiles={handleOpenMoveModal}
                onOpenFile={handleOpenFile}
                onToggleFavorite={handleToggleFavorite}
                selectedFileIds={selectedFileIds}
                onSelectFile={handleSelectFile}
                onSelectAll={handleSelectAll}
                clearSelection={clearSelection}
                deletingFileIds={deletingFileIds}
                onNavigate={navigateToPath}
                onToggleQuickAccess={handleToggleQuickAccess}
            />
        case 'quickaccess':
            return <QuickAccessManager
                files={quickAccessFiles}
                isLoading={isLoading}
                onDeleteFiles={handleTrashFiles}
                onDownloadFiles={handleDownloadFiles}
                onMoveFiles={handleOpenMoveModal}
                onOpenFile={handleOpenFile}
                onToggleFavorite={handleToggleFavorite}
                onToggleQuickAccess={handleToggleQuickAccess}
                selectedFileIds={selectedFileIds}
                onSelectFile={handleSelectFile}
                onSelectAll={handleSelectAll}
                clearSelection={clearSelection}
                deletingFileIds={deletingFileIds}
                onNavigate={navigateToPath}
            />
        default:
            return null;
    }
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="h-screen flex font-sans">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      <Sidebar 
        currentView={currentView} 
        onSetView={setCurrentView} 
        totalStorageUsed={totalStorageUsedMB}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        onLogout={onLogout}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Header 
          user={user}
          onMenuClick={toggleSidebar}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchResults={searchResults}
          isSearching={isSearching}
          onResultClick={handleSearchResultClick}
          isSearchFocused={isSearchFocused}
          onSearchFocus={() => setIsSearchFocused(true)}
          onSearchBlur={() => setIsSearchFocused(false)}
          onClearSearch={handleClearSearch}
          searchFilters={searchFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />
        <CreateFolderModal 
            isOpen={isCreateFolderModalOpen}
            onClose={() => setCreateFolderModalOpen(false)}
            onCreate={handleCreateFolder}
        />
        <MoveFileModal
            isOpen={!!filesToMove}
            onClose={handleCloseMoveModal}
            onMove={handleMoveFiles}
            filesToMove={filesToMove}
        />
        <div className="mt-8 space-y-12">
            {error && <div className="p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">{error}</div>}
            
            {progressInfo.length > 0 && (
                <div className="space-y-4">
                    {progressInfo.map(p => (
                        <ProgressLoader 
                            key={p.id}
                            type={p.type}
                            fileName={p.fileName}
                            progress={p.progress}
                            status={p.status}
                        />
                    ))}
                </div>
            )}
            
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
