import React, { useState, useEffect } from 'react';
import { RecentFile } from '../types';
import { XIcon } from '../constants/icons';
import { getFilePreviewUrl } from '../services/api';

interface FilePreviewModalProps {
  file: RecentFile;
  onClose: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose }) => {
  const isImage = file.mimeType.startsWith('image/');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isImage);

  useEffect(() => {
    let objectUrl: string;
    if (isImage) {
      const loadImage = async () => {
        setIsLoading(true);
        try {
          objectUrl = await getFilePreviewUrl(file);
          setImageUrl(objectUrl);
        } catch (error) {
          console.error("Failed to load image for preview modal:", error);
          setImageUrl(null);
        } finally {
          setIsLoading(false);
        }
      };
      loadImage();
    }
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file, isImage]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="glossy-card rounded-xl w-full max-w-3xl m-4 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'scale-in 0.2s ease-out forwards' }}
      >
        <div className="absolute top-3 right-3 z-10">
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="p-2 rounded-full bg-black/30 text-mono-text-secondary hover:bg-black/50 hover:text-mono-text-primary transition-colors duration-200"
            >
              <XIcon />
            </button>
        </div>

        {isImage ? (
          <div className="w-full h-auto max-h-[80vh] flex items-center justify-center p-4">
            {isLoading && <p className="text-mono-text-secondary">Loading image...</p>}
            {imageUrl && <img src={imageUrl} alt={`Preview of ${file.name}`} className="max-w-full max-h-[75vh] object-contain rounded-lg" />}
            {!isLoading && !imageUrl && <p className="text-red-400">Preview not available.</p>}
          </div>
        ) : (
          <div className="p-8 py-12 flex flex-col items-center text-center">
            <div className="text-accent-purple-light scale-[2] mb-8">
              {file.icon}
            </div>
            <h2 className="text-2xl font-bold text-mono-text-primary mb-2 break-all">{file.name}</h2>
            <p className="text-mono-text-secondary mb-8">
              {file.size} &middot; Last Modified: {file.lastModified}
            </p>
            <div className="bg-mono-gray-dark/70 p-4 rounded-lg text-mono-text-secondary border border-mono-border">
              <p>Live preview is not available for this file type.</p>
            </div>
          </div>
        )}
      </div>
       <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FilePreviewModal;