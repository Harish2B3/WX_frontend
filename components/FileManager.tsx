


import React from 'react';
import { RecentFile } from '../types';
import { SortAscIcon, TeamIcon, FolderIcon, PlusIcon, SortIcon, ChevronRightIcon, MoveIcon, TrashIcon, XIcon, DownloadIcon, BackIcon, StarFilledIcon, LightningFilledIcon } from '../constants/icons';
import ActionsMenu from './ActionsMenu';

interface FileManagerProps {
  files: RecentFile[];
  isLoading: boolean;
  onDelete: (fileId: string) => void;
  onDownload: (file: RecentFile) => void;
  onMove: (file: RecentFile) => void;
  onCreateFile: () => void;
  onCreateFolder: () => void;
  currentPath: { id: string; name: string }[];
  onFolderClick: (file: RecentFile) => void;
  onBreadcrumbClick: (index: number) => void;
  onOpenFile: (file: RecentFile) => void;
  selectedFileIds: string[];
  onSelectFile: (fileId: string) => void;
  onSelectAll: () => void;
  onDeleteFiles: (fileIds: string[]) => void;
  onMoveFiles: (files: RecentFile[]) => void;
  onDownloadFiles: (files: RecentFile[]) => void;
  clearSelection: () => void;
  deletingFileIds: string[];
  onToggleFavorite: (fileId: string) => void;
  onToggleQuickAccess: (fileId: string) => void;
}

const FileManager: React.FC<FileManagerProps> = (props) => {
    const { 
        files, isLoading, onDelete, onDownload, onMove, onCreateFile, onCreateFolder,
        currentPath, onFolderClick, onBreadcrumbClick, onOpenFile, selectedFileIds, onSelectFile, onSelectAll, onDeleteFiles, 
        onMoveFiles, onDownloadFiles, clearSelection, deletingFileIds, onToggleFavorite, onToggleQuickAccess
    } = props;
    
    const handleDoubleClick = (file: RecentFile) => {
        if (file.mimeType === 'application/vnd.wormx-cloud.folder') {
            onFolderClick(file);
        } else {
            onOpenFile(file);
        }
    };
    
    const handleBackClick = () => {
        if (currentPath.length > 1) {
            onBreadcrumbClick(currentPath.length - 2);
        }
    };
    
    const firstFileIndex = files.findIndex(file => file.mimeType !== 'application/vnd.wormx-cloud.folder');
    const isAllSelected = files.length > 0 && files.every(f => selectedFileIds.includes(f.id));
    const selectedFiles = files.filter(f => selectedFileIds.includes(f.id));

    const BulkActionBar = () => (
        <div className="flex items-center justify-between animate-fade-in w-full">
             <div className="flex items-center gap-2">
                <span className="font-semibold text-mono-text-primary text-sm">{selectedFileIds.length} selected</span>
                <button onClick={() => onDownloadFiles(selectedFiles)} className="flex items-center gap-2 py-2 px-3 bg-mono-gray-mid/50 rounded-lg text-mono-text-secondary hover:bg-mono-gray-light/50 hover:text-mono-text-primary transition-colors duration-200 text-sm font-medium">
                    <DownloadIcon /> Download
                </button>
                <button onClick={() => onMoveFiles(selectedFiles)} className="flex items-center gap-2 py-2 px-3 bg-mono-gray-mid/50 rounded-lg text-mono-text-secondary hover:bg-mono-gray-light/50 hover:text-mono-text-primary transition-colors duration-200 text-sm font-medium">
                    <MoveIcon /> Move
                </button>
                <button onClick={() => onDeleteFiles(selectedFileIds)} className="flex items-center gap-2 py-2 px-3 bg-mono-gray-mid/50 rounded-lg text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors duration-200 text-sm font-medium">
                    <TrashIcon /> Delete
                </button>
            </div>
             <button onClick={clearSelection} className="p-2 rounded-full text-mono-text-secondary hover:bg-mono-gray-mid/50 hover:text-mono-text-primary transition-colors duration-200">
                <XIcon />
            </button>
        </div>
    );

    return (
        <section>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-mono-text-primary mb-2">My Storage</h2>
                    <div className="flex items-center">
                        {currentPath.length > 1 && (
                            <button 
                                onClick={handleBackClick} 
                                className="mr-3 p-1.5 rounded-full text-mono-text-secondary hover:bg-mono-gray-mid/50 hover:text-mono-text-primary transition-colors duration-200"
                                aria-label="Go back"
                            >
                                <BackIcon />
                            </button>
                        )}
                        <nav className="flex items-center text-sm text-mono-text-secondary" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2">
                                {currentPath.map((part, index) => (
                                    <li key={part.id} className="inline-flex items-center">
                                    {index > 0 && <ChevronRightIcon />}
                                    <button
                                        onClick={() => onBreadcrumbClick(index)}
                                        disabled={index === currentPath.length - 1}
                                        className={`ml-1 text-sm font-medium ${index === currentPath.length - 1 ? 'text-mono-text-primary' : 'hover:text-accent-purple-light'}`}
                                    >
                                        {part.name}
                                    </button>
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    {selectedFileIds.length > 0 ? <BulkActionBar /> : (
                        <>
                            <button className="flex items-center gap-2 py-2 px-4 bg-mono-gray-mid/50 rounded-lg text-mono-text-secondary hover:bg-mono-gray-light/50 hover:text-mono-text-primary transition-colors duration-200 text-sm font-medium">
                                <SortIcon />
                                Sort
                            </button>
                            <button
                                onClick={onCreateFolder}
                                className="flex items-center gap-2 py-2 px-4 bg-mono-gray-mid/50 rounded-lg text-mono-text-secondary hover:bg-mono-gray-light/50 hover:text-mono-text-primary transition-colors duration-200 text-sm font-medium"
                            >
                                <FolderIcon />
                                New Folder
                            </button>
                            <button
                                onClick={onCreateFile}
                                className="flex items-center gap-2 py-2 px-4 glossy-accent-button text-mono-text-primary rounded-lg text-sm font-bold"
                            >
                                <PlusIcon />
                                Upload File
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            <div className="rounded-xl p-2 glossy-card">
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-mono-text-secondary uppercase">
                    <tr>
                        <th scope="col" className="p-4 w-1/12">
                            <input type="checkbox" checked={isAllSelected} onChange={onSelectAll} className="w-4 h-4 accent-accent-purple bg-mono-gray-dark border-mono-border rounded focus:ring-accent-purple" />
                        </th>
                        <th scope="col" className="p-4 w-4/12"><div className="flex items-center gap-1">Name <SortAscIcon /></div></th>
                        <th scope="col" className="p-4 w-2/12"><div className="flex items-center gap-1">Size <SortAscIcon /></div></th>
                        <th scope="col" className="p-4 w-2/12">Shared</th>
                        <th scope="col" className="p-4 w-2/12"><div className="flex items-center gap-1">Last modified <SortAscIcon /></div></th>
                        <th scope="col" className="p-4 w-1/12">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr><td colSpan={6} className="text-center p-8 text-mono-text-secondary">Loading...</td></tr>
                    ) : files.length === 0 ? (
                        <tr><td colSpan={6} className="text-center p-8 text-mono-text-secondary">This folder is empty.</td></tr>
                    ) : (
                        files.map((file, index) => {
                            const isFolder = file.mimeType === 'application/vnd.wormx-cloud.folder';
                            const isFirstFile = firstFileIndex > 0 && index === firstFileIndex;
                            const isSelected = selectedFileIds.includes(file.id);
                            const isDeleting = deletingFileIds.includes(file.id);
                            return (
                                <tr 
                                    key={file.id} 
                                    onDoubleClick={() => handleDoubleClick(file)}
                                    className={`
                                        border-t border-mono-border/50 transition-colors duration-150 cursor-pointer
                                        ${isFolder ? 'bg-mono-gray-mid/20' : ''}
                                        ${isSelected ? 'bg-accent-purple/10' : 'hover:bg-mono-gray-dark/50'}
                                        ${isFirstFile ? 'border-t-2 border-mono-gray-light/50' : ''}
                                        ${isDeleting ? 'file-delete-animation' : ''}
                                        no-select
                                    `}>
                                    <td className="p-4">
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected} 
                                            onChange={e => { e.stopPropagation(); onSelectFile(file.id); }} 
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-4 h-4 accent-accent-purple bg-mono-gray-dark border-mono-border rounded focus:ring-accent-purple" />
                                    </td>
                                    <td className="p-4 font-medium text-mono-text-primary">
                                        <div className="flex items-center gap-3">
                                            <div className="text-mono-text-secondary">{file.icon}</div>
                                            <span className={isFolder ? 'font-bold' : ''}>{file.name}</span>
                                            {file.isFavorite && <span className="text-accent-purple-light ml-1"><StarFilledIcon /></span>}
                                            {file.isQuickAccess && <span className="text-accent-purple-light ml-1"><LightningFilledIcon /></span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-mono-text-secondary">{file.size}</td>
                                    <td className="p-4 text-mono-text-secondary">
                                    <div className="flex items-center gap-2">
                                        {file.shared === 'Team' ? <TeamIcon /> : null}
                                        {file.shared}
                                    </div>
                                    </td>
                                    <td className="p-4 text-mono-text-secondary">{file.lastModified}</td>
                                    <td className="p-4 text-mono-text-secondary" data-no-select>
                                        <ActionsMenu 
                                            file={file} 
                                            onDelete={onDelete} 
                                            onDownload={onDownload} 
                                            onMove={onMove}
                                            onToggleFavorite={onToggleFavorite}
                                            onToggleQuickAccess={onToggleQuickAccess}
                                        />
                                    </td>
                                </tr>
                            )
                        })
                    )}
                    </tbody>
                </table>
                </div>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
             `}</style>
        </section>
    );
};

export default FileManager;