

import React from 'react';
import { RecentFile } from '../types';
import { SortAscIcon, TeamIcon, MoveIcon, TrashIcon, XIcon, DownloadIcon, StarFilledIcon, LightningFilledIcon } from '../constants/icons';
import ActionsMenu from './ActionsMenu';

interface FavoritesManagerProps {
  files: RecentFile[];
  isLoading: boolean;
  onDeleteFiles: (fileIds: string[]) => void;
  onDownloadFiles: (files: RecentFile[]) => void;
  onMoveFiles: (files: RecentFile[]) => void;
  onOpenFile: (file: RecentFile) => void;
  onToggleFavorite: (fileId: string) => void;
  onToggleQuickAccess: (fileId: string) => void;
  selectedFileIds: string[];
  onSelectFile: (fileId: string) => void;
  onSelectAll: () => void;
  clearSelection: () => void;
  deletingFileIds: string[];
  onNavigate: (path: { id: string; name: string }[]) => void;
}

const FavoritesManager: React.FC<FavoritesManagerProps> = (props) => {
    const { 
        files, isLoading, onDeleteFiles, onDownloadFiles, onMoveFiles, onOpenFile, onToggleFavorite, onToggleQuickAccess,
        selectedFileIds, onSelectFile, onSelectAll, clearSelection, deletingFileIds, onNavigate
    } = props;

    const handleDoubleClick = (file: RecentFile) => {
        if (file.mimeType === 'application/vnd.wormx-cloud.folder' && file.path) {
            onNavigate(file.path);
        } else {
            onOpenFile(file);
        }
    };

    const isAllSelected = files.length > 0 && files.every(f => selectedFileIds.includes(f.id));
    const selectedFiles = files.filter(f => selectedFileIds.includes(f.id));

    const BulkActionBar = () => (
        <div className="flex items-center justify-between p-3 bg-accent-purple/10 border border-accent-purple/20 rounded-lg mb-4 animate-fade-in">
            <div className="flex items-center gap-4">
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
            <h2 className="text-2xl font-semibold text-mono-text-primary mb-6">Favorites</h2>
            {selectedFileIds.length > 0 && <BulkActionBar />}
            <div className="rounded-xl p-2 glossy-card">
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-mono-text-secondary uppercase">
                    <tr>
                        <th scope="col" className="p-4 w-1/12">
                        <input 
                            type="checkbox" 
                            checked={isAllSelected}
                            onChange={onSelectAll}
                            className="w-4 h-4 accent-accent-purple bg-mono-gray-dark border-mono-border rounded focus:ring-accent-purple" 
                        />
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
                        <tr><td colSpan={6} className="text-center p-8 text-mono-text-secondary">Loading favorites...</td></tr>
                    ) : files.length === 0 ? (
                        <tr><td colSpan={6} className="text-center p-8 text-mono-text-secondary">No favorites yet. Mark files with a star to see them here.</td></tr>
                    ) : (
                        files.map((file) => {
                        const isFolder = file.mimeType === 'application/vnd.wormx-cloud.folder';
                        const isSelected = selectedFileIds.includes(file.id);
                        const isDeleting = deletingFileIds.includes(file.id);

                        return (
                            <tr 
                            key={file.id} 
                            className={`
                                border-t border-mono-border/50
                                cursor-pointer transition-colors duration-150
                                ${isSelected ? 'bg-accent-purple/10' : 'hover:bg-black/20'}
                                ${isDeleting ? 'file-delete-animation' : ''}
                                no-select
                            `}
                            onDoubleClick={() => handleDoubleClick(file)}
                            >
                            <td className="p-4">
                                <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => { e.stopPropagation(); onSelectFile(file.id); }} 
                                onClick={(e) => e.stopPropagation()}
                                className="w-4 h-4 accent-accent-purple bg-mono-gray-dark border-mono-border rounded focus:ring-accent-purple" 
                                />
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
                                    onDelete={(fileId) => onDeleteFiles([fileId])}
                                    onDownload={(file) => onDownloadFiles([file])} 
                                    onMove={(file) => onMoveFiles([file])}
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

export default FavoritesManager;