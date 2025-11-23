import React, { useState, useEffect } from 'react';
import { RecentFile } from '../types';
import { getFilePreviewUrl } from '../services/api';

// Simple SVG Icons for the toolbar
const ZoomInIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>;
const ZoomOutIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>;
const FitScreenIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5 5" /></svg>;

const ImageEditor: React.FC<{ file: RecentFile }> = ({ file }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let objectUrl: string;

    const loadImage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        objectUrl = await getFilePreviewUrl(file);
        setImageUrl(objectUrl);
      } catch (err) {
        console.error("Failed to load image preview:", err);
        setError("Could not load image.");
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  const handleZoom = (direction: 'in' | 'out') => {
    setScale(prev => {
      const newScale = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.1, Math.min(newScale, 5));
    });
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // FIX: Remove direct DOM manipulation to resolve TypeScript errors and follow React best practices.
  // The cursor is now controlled declaratively via component state and the `style` prop on the `img` element.
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    }
  };
  
  return (
    <div className="h-full flex flex-col items-center justify-center bg-mono-gray-dark relative overflow-hidden">
      {isLoading && <p className="text-mono-text-secondary">Loading image...</p>}
      {error && <p className="text-red-400">{error}</p>}
      
      {imageUrl && (
        <div 
          className="w-full h-full flex items-center justify-center overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img 
              src={imageUrl} 
              alt={`Preview of ${file.name}`}
              className="max-w-full max-h-full object-contain transition-transform duration-150 ease-out"
              style={{ 
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  cursor: isDragging ? 'grabbing' : (scale > 1 ? 'grab' : 'default'),
              }}
              onMouseDown={handleMouseDown}
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex items-center justify-center gap-2 p-2 glossy-card rounded-xl text-mono-text-primary shadow-lg">
          <button onClick={() => handleZoom('out')} className="p-2 rounded-lg hover:bg-black/20"><ZoomOutIcon /></button>
          <span className="text-sm font-semibold w-16 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => handleZoom('in')} className="p-2 rounded-lg hover:bg-black/20"><ZoomInIcon /></button>
          <div className="w-px h-6 bg-mono-border mx-2"></div>
          <button onClick={resetZoom} className="p-2 rounded-lg hover:bg-black/20"><FitScreenIcon /></button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;