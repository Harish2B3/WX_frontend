import React from 'react';
import { RecentFile } from '../types';
import DocxEditor from './DocxEditor';
import PdfViewer from './PdfViewer';
import SpreadsheetEditor from './SpreadsheetEditor';
import TextEditor from './TextEditor';
import ImageEditor from './ImageEditor';
import VideoEditor from './VideoEditor';
import { BackIcon } from '../constants/icons';

interface FileEditorProps {
  file: RecentFile;
  onClose: () => void;
}

const FileEditor: React.FC<FileEditorProps> = ({ file, onClose }) => {
  const renderEditor = () => {
    const mimeType = file.mimeType;
    
    if (mimeType.startsWith('image/')) {
        return <ImageEditor file={file} />;
    }
    if (mimeType.startsWith('video/')) {
        return <VideoEditor file={file} />;
    }
    if (mimeType.includes('wordprocessingml')) {
      return <DocxEditor file={file} />;
    }
    if (mimeType === 'application/pdf') {
      return <PdfViewer file={file} />;
    }
    if (mimeType.includes('spreadsheetml')) {
      return <SpreadsheetEditor file={file} />;
    }
    if (mimeType === 'text/plain') {
      return <TextEditor file={file} />;
    }
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-accent-purple-light scale-[2] mb-8">
            {file.icon}
          </div>
          <h2 className="text-2xl font-bold text-mono-text-primary mb-2 break-all max-w-2xl">{file.name}</h2>
          <p className="text-mono-text-secondary mb-8">
            {file.size} &middot; Last Modified: {file.lastModified}
          </p>
          <div className="bg-mono-gray-dark/70 p-4 rounded-lg text-mono-text-secondary border border-mono-border">
            <p>Live preview is not available for this file type.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen" style={{ animation: 'fade-in 0.3s ease-out' }}>
      <header className="grid grid-cols-3 items-center p-3 border-b border-mono-border flex-shrink-0 bg-mono-black/30 backdrop-blur-sm z-10">
        <div className="justify-self-start">
            <button onClick={onClose} className="flex items-center gap-2 py-2 px-4 rounded-lg text-mono-text-secondary hover:bg-mono-gray-mid/50 hover:text-mono-text-primary transition-colors duration-200">
              <BackIcon />
              <span>Back</span>
            </button>
        </div>
        <div className="justify-self-center text-center font-semibold text-mono-text-primary truncate px-4 flex items-center gap-3">
          <div className="text-mono-text-secondary flex-shrink-0">{file.icon}</div>
          <span className="truncate">{file.name}</span>
        </div>
        <div className="justify-self-end"></div>
      </header>
      <main className="flex-1 overflow-hidden bg-mono-gray-dark relative">
        {renderEditor()}
      </main>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
export default FileEditor;