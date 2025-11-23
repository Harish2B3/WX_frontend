import React from 'react';
// FIX: The `suggestedFiles` constant is not exported from `constants/data`.
// As this component is not actively used, it is safe to replace the import
// with an empty array to resolve the compilation error.
// import { suggestedFiles } from '../constants/data';
import { DotsVerticalIcon } from '../constants/icons';

const suggestedFiles: {
  id: string;
  name: string;
  thumbnailUrl: string;
  icon: React.ReactNode;
}[] = [];

const SuggestedFiles: React.FC = () => {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-mono-text-primary mb-6">Suggested</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {suggestedFiles.map((file) => (
          <div key={file.id} className="rounded-xl overflow-hidden glossy-card">
            <div className="bg-gray-700 h-32 flex items-center justify-center">
                <img src={file.thumbnailUrl} alt={file.name} className="w-full h-full object-cover"/>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-mono-text-secondary">
                  {file.icon}
                </div>
                <span className="text-sm font-medium text-mono-text-primary truncate">{file.name}</span>
              </div>
              <button className="text-mono-text-secondary hover:text-mono-text-primary">
                <DotsVerticalIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuggestedFiles;
