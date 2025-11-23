import React, { useState, useEffect, useCallback } from 'react';
import { RecentFile } from '../types';
import { FolderIcon, ChevronRightIcon } from '../constants/icons';
import { getFiles } from '../services/api';

interface MoveFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (destinationId: string) => void;
  filesToMove: RecentFile[] | null;
}

const MoveFileModal: React.FC<MoveFileModalProps> = ({ isOpen, onClose, onMove, filesToMove }) => {
  const [modalPath, setModalPath] = useState<{ id: string; name: string }[]>([{ id: 'root', name: 'Drive' }]);
  const [folders, setFolders] = useState<Partial<RecentFile>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const currentFolderId = modalPath[modalPath.length - 1].id;

  const fetchFolders = useCallback(async () => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      const allItems = await getFiles(currentFolderId);
      const fileIdsToMove = filesToMove?.map(f => f.id) || [];
      const folderItems = allItems
        .filter(item => item.mimeType === 'application/vnd.wormx-cloud.folder' && !fileIdsToMove.includes(item._id))
        .map((item: any) => ({
            id: item._id,
            name: item.fileName,
            mimeType: item.mimeType,
        }));
      setFolders(folderItems);
    } catch (e) {
      console.error("Failed to fetch folders for move modal", e);
      setFolders([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId, isOpen, filesToMove]);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    if (isOpen) {
      setModalPath([{ id: 'root', name: 'Drive' }]);
    }
  }, [isOpen]);

  if (!isOpen || !filesToMove) return null;
  
  const handleFolderClick = (folder: Partial<RecentFile>) => {
    setModalPath(prev => [...prev, { id: folder.id!, name: folder.name! }]);
  };
  
  const handleBreadcrumbClick = (index: number) => {
    setModalPath(prev => prev.slice(0, index + 1));
  };

  const handleSubmit = () => {
    onMove(currentFolderId);
  };

  const isMoveDisabled = !currentFolderId || filesToMove.some(f => f.parentId === currentFolderId);
  const moveItemName = filesToMove.length === 1 ? `"${filesToMove[0].name}"` : `${filesToMove.length} items`;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="glossy-card rounded-xl p-6 w-full max-w-lg m-4 flex flex-col h-[60vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-mono-text-primary mb-2">Move Item(s)</h2>
        <p className="text-mono-text-secondary mb-4 text-sm">Move <span className="font-semibold text-mono-text-primary truncate">{moveItemName}</span> to:</p>
        
        <nav className="flex items-center text-sm text-mono-text-secondary mb-3 p-2 bg-black/20 rounded-md" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1">
            {modalPath.map((part, index) => (
              <li key={part.id} className="inline-flex items-center">
                {index > 0 && <ChevronRightIcon />}
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  disabled={index === modalPath.length - 1}
                  className={`ml-1 text-sm font-medium ${index === modalPath.length - 1 ? 'text-mono-text-primary' : 'hover:text-accent-purple-light'}`}
                >
                  {part.name}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="bg-mono-gray-dark/50 rounded-lg border border-mono-border flex-1 overflow-y-auto mb-4">
            {isLoading ? (
                <p className="p-4 text-center text-mono-text-secondary">Loading folders...</p>
            ) : folders.length > 0 ? (
                folders.map(folder => (
                    <button
                        key={folder.id}
                        onClick={() => handleFolderClick(folder)}
                        className="w-full flex items-center text-left p-3 transition-colors text-mono-text-secondary hover:bg-black/20 hover:text-mono-text-primary"
                    >
                        <FolderIcon />
                        <span className="ml-3">{folder.name}</span>
                    </button>
                ))
            ) : (
                <p className="p-4 text-center text-mono-text-secondary">No subfolders.</p>
            )}
        </div>

        <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-mono-border/50">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-mono-gray-mid/50 rounded-lg text-mono-text-secondary hover:bg-mono-gray-light/50 hover:text-mono-text-primary transition-colors duration-200 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isMoveDisabled}
            className="py-2 px-4 glossy-accent-button text-mono-text-primary rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Move Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveFileModal;