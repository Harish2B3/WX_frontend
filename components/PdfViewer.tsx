import React, { useState, useEffect } from 'react';
import { RecentFile } from '../types';
import { getFilePreviewUrl } from '../services/api';

const PdfViewer: React.FC<{ file: RecentFile }> = ({ file }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string;

    const loadPdf = async () => {
      setIsLoading(true);
      setError(null);
      try {
        objectUrl = await getFilePreviewUrl(file);
        setFileUrl(objectUrl);
      } catch (err) {
        console.error("Failed to load PDF preview:", err);
        setError("Could not load PDF file.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-mono-gray-dark">
      {isLoading && <p className="text-mono-text-secondary">Loading document...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {fileUrl && (
        <iframe
          src={fileUrl}
          title={file.name}
          className="w-full h-full border-none"
        />
      )}
    </div>
  );
};

export default PdfViewer;