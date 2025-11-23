import React from 'react';
import { StorageCategory } from '../types';
import { SortIcon, ViewGridIcon, PlusIcon, FolderIcon } from '../constants/icons';

interface StorageOverviewProps {
  categories: StorageCategory[];
  totalStorageUsedInBytes: number;
  onCreateFile: () => void;
  onCreateFolder: () => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const StorageOverview: React.FC<StorageOverviewProps> = ({ categories, totalStorageUsedInBytes, onCreateFile, onCreateFolder }) => {
  return (
    <section>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
            <ViewGridIcon />
            <h2 className="text-2xl font-semibold text-mono-text-primary">Overview Storage</h2>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {categories.map((category) => {
          const isTrash = category.id === 'trash';
          
          const percentage = !isTrash && totalStorageUsedInBytes > 0 
            ? (category.storageUsed / totalStorageUsedInBytes) * 100 
            : 0;

          return (
            <div key={category.id} className="p-5 rounded-xl glossy-card">
              {category.icon}
              <h3 className="text-lg font-semibold text-mono-text-primary mt-4">{category.name}</h3>
              <p className="text-sm text-mono-text-secondary">{category.itemCount} items</p>
              <div className="mt-4">
                <div className="flex justify-between items-baseline mb-2">
                  <p className="text-sm text-mono-text-primary font-medium">
                    {formatBytes(category.storageUsed)}
                  </p>
                </div>
                <div className="w-full bg-mono-gray-light/30 rounded-full h-1.5">
                  <div
                    className={`${category.color} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${isTrash ? 100 : percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StorageOverview;