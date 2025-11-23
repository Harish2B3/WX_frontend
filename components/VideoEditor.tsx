import React, { useState, useEffect } from 'react';
import { RecentFile } from '../types';
import { getFilePreviewUrl } from '../services/api';

const VideoEditor: React.FC<{ file: RecentFile }> = ({ file }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string;

    const loadVideo = async () => {
      setIsLoading(true);
      setError(null);
      try {
        objectUrl = await getFilePreviewUrl(file);
        setVideoUrl(objectUrl);
      } catch (err: any) {
        console.error("Failed to load video preview:", err);
        setError(`Could not load video source: ${err.message || 'Please try again.'}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-black p-4">
      {isLoading && <p className="text-mono-text-secondary">Loading video...</p>}
      {error && (
        <div className="text-center text-red-400">
          <p className="text-lg">Video preview not available.</p>
          <p>{error}</p>
        </div>
      )}
      {videoUrl && (
        <video
          controls
          autoPlay
          muted
          className="max-w-full max-h-full object-contain shadow-2xl rounded-lg outline-none"
          data-testid="video-player"
        >
          <source src={videoUrl} type={file.mimeType} key={videoUrl} />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoEditor;