import React from 'react';
import { RecentFile } from '../types';
import { InfoIcon, DocumentIcon } from '../constants/icons';

const DocxEditor: React.FC<{ file: RecentFile }> = ({ file }) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-mono-gray-dark p-8 overflow-y-auto">
      <div className="absolute top-4 right-6 z-10">
        <div className="flex items-center gap-2 p-2 bg-yellow-900/50 border border-yellow-500/50 rounded-lg text-yellow-300 text-sm shadow">
          <InfoIcon />
          <span>This is a read-only preview. Full document rendering is not supported.</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center text-mono-text-secondary">
        <div className="text-accent-purple-light mb-6" style={{ transform: 'scale(3)' }}>
            <DocumentIcon />
        </div>
        <h1 className="text-2xl font-bold text-mono-text-primary mb-2 break-all max-w-2xl">{file.name}</h1>
        <p>To view the full content, please download the file.</p>
      </div>
    </div>
  );
};

export default DocxEditor;
