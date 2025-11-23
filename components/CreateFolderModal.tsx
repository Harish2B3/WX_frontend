import React, { useState, useEffect, useRef } from 'react';
import { FolderIcon } from '../constants/icons';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when the modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
      setFolderName(''); // Reset folder name
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = folderName.trim();
    const invalidChars = /[\\/:"*?<>|]/;
    
    if (!name) return;
    
    if (invalidChars.test(name)) {
        setError('Folder name cannot contain characters like / \\ : * ? " < > |');
        return;
    }

    setError(null);
    onCreate(name);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="glossy-card rounded-xl p-6 w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-xl font-semibold text-mono-text-primary mb-4 flex items-center gap-3">
            <FolderIcon /> Create New Folder
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Enter folder name"
            className="w-full bg-mono-gray-dark/50 border border-mono-border text-mono-text-primary rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent-purple shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] mb-2"
          />
          {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-mono-gray-mid/50 rounded-lg text-mono-text-secondary hover:bg-mono-gray-light/50 hover:text-mono-text-primary transition-colors duration-200 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim()}
              className="py-2 px-4 glossy-accent-button text-mono-text-primary rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Folder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;