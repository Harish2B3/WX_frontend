import React, { useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react';
import { PlusIcon } from '../constants/icons';

interface UploadAreaProps {
  onUpload: (file: File) => void;
}

interface UploadAreaHandle {
  triggerFileUpload: () => void;
}

const UploadArea = forwardRef<UploadAreaHandle, UploadAreaProps>(({ onUpload }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    triggerFileUpload: () => {
      fileInputRef.current?.click();
    },
  }));

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section>
        <h2 className="text-2xl font-semibold text-mono-text-primary mb-6">Upload File</h2>
        <div
            className={`flex justify-center items-center w-full p-8 border-2 ${isDragging ? 'border-accent-purple' : 'border-mono-border'} border-dashed rounded-xl cursor-pointer transition-all duration-300 glossy-card hover:border-accent-purple-light`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={onButtonClick}
        >
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
            />
            <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-mono-gray-dark flex items-center justify-center rounded-full">
                    <PlusIcon />
                </div>
                <p className="font-semibold text-mono-text-primary">Drag & drop your file here</p>
                <p className="text-sm text-mono-text-secondary">or click to browse</p>
            </div>
        </div>
    </section>
  );
});

export default UploadArea;
