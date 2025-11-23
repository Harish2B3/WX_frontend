import React from 'react';

interface ProgressLoaderProps {
  type: 'upload' | 'download';
  fileName: string;
  progress: number;
  status?: 'uploading' | 'processing' | 'downloading';
}

const ProgressLoader: React.FC<ProgressLoaderProps> = ({ type, fileName, progress, status }) => {
  const actionText = type === 'upload' 
    ? (status === 'processing' ? 'Processing' : 'Uploading') 
    : 'Downloading';

  return (
    <div className="mb-8 p-4 glossy-card rounded-lg animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-mono-text-primary truncate pr-4">
          {actionText}: <span className="text-mono-text-secondary">{fileName}</span>
        </p>
        <p className="text-sm font-bold text-accent-purple-light">{Math.round(progress)}%</p>
      </div>
      <div className="w-full bg-mono-gray-light/30 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-accent-purple-light to-accent-purple-dark h-2 rounded-full transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
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
    </div>
  );
};

export default ProgressLoader;
