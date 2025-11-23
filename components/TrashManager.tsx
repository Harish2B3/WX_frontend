import React from 'react';
import { RecentFile } from '../types';
import { SortAscIcon, TrashIcon, XIcon, RestoreIcon } from '../constants/icons';

interface TrashManagerProps {
  files: RecentFile[];
  isLoading: boolean;
  onRestoreFiles: (fileIds: string[]) => void;
  onDeletePermanently: (fileIds: string[]) => void;
  onEmptyTrash: () => void;
  selectedFileIds: string[];
  onSelectFile: (fileId: string) => void;
  onSelectAll: () => void;
  clearSelection: () => void;
  deletingFileIds: string[];
}

const TrashManager: React.FC<TrashManagerProps> = (props) => {
    const { 
        files, isLoading, onRestoreFiles, onDeletePermanently, onEmptyTrash,
        selectedFileIds, onSelectFile, onSelectAll, clearSelection, deletingFileIds
    } = props;

    const isAllSelected = files.length > 0 && files.every(f => selectedFileIds.includes(f.id));

    const BulkActionBar = () => (
        <div className="flex items-center justify-between animate-fade-in w-full">
             <div className="flex items-center gap-2">
                <span className="font-semibold text-mono-text-primary text-sm">{selectedFileIds.length} selected</span>
                <button onClick={() => onRestoreFiles(selectedFileIds)} className="flex items-center gap-2 py-2 px-3 bg-mono-gray-mid/50 rounded-lg text-mono-text-secondary hover:bg-mono-gray-light/50 hover:text-mono-text-primary transition-colors duration-200 text-sm font-medium">
                    <RestoreIcon /> Restore
                </button>
                <button onClick={() => onDeletePermanently(selectedFileIds)} className="flex items-center gap-2 py-2 px-3 bg-mono-gray-mid/50 rounded-lg text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors duration-200 text-sm font-medium">
                    <TrashIcon /> Delete Permanently
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
                    <h2 className="text-2xl font-semibold text-mono-text-primary">Trash</h2>
                     <p className="text-sm text-mono-text-secondary">Items in trash will be deleted permanently after 30 days.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    {selectedFileIds.length > 0 ? <BulkActionBar /> : (
                        <button
                            onClick={onEmptyTrash}
                            disabled={files.length === 0}
                            className="flex items-center gap-2 py-2 px-4 glossy-accent-button text-mono-text-primary rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <TrashIcon />
                            Empty Trash
                        </button>
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
                        <th scope="col" className="p-4 w-5/12"><div className="flex items-center gap-1">Name <SortAscIcon /></div></th>
                        <th scope="col" className="p-4 w-2/12"><div className="flex items-center gap-1">Size <SortAscIcon /></div></th>
                        <th scope="col" className="p-4 w-2/12"><div className="flex items-center gap-1">Date Trashed <SortAscIcon /></div></th>
                        <th scope="col" className="p-4 w-2/12 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr><td colSpan={5} className="text-center p-8 text-mono-text-secondary">Loading...</td></tr>
                    ) : files.length === 0 ? (
                        <tr><td colSpan={5} className="text-center p-8 text-mono-text-secondary">The trash is empty.</td></tr>
                    ) : (
                        files.map((file) => {
                            const isSelected = selectedFileIds.includes(file.id);
                            const isDeleting = deletingFileIds.includes(file.id);
                            return (
                                <tr 
                                    key={file.id} 
                                    className={`
                                        border-t border-mono-border/50 transition-colors duration-150 cursor-pointer
                                        ${isSelected ? 'bg-accent-purple/10' : 'hover:bg-mono-gray-dark/50'}
                                        ${isDeleting ? 'file-delete-animation' : ''}
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
                                            <span>{file.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-mono-text-secondary">{file.size}</td>
                                    <td className="p-4 text-mono-text-secondary">{file.trashedAt}</td>
                                    <td className="p-4 text-mono-text-secondary" data-no-select>
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); onRestoreFiles([file.id]); }} className="p-2 rounded-lg text-mono-text-primary hover:bg-mono-gray-light transition-colors" title="Restore">
                                                <RestoreIcon />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); onDeletePermanently([file.id]); }} className="p-2 rounded-lg text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-colors" title="Delete Permanently">
                                                <TrashIcon />
                                            </button>
                                        </div>
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

export default TrashManager;