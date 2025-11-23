import React, { useState, useEffect } from 'react';
import { RecentFile } from '../types';
import { getFileAsText } from '../services/api';

const TextEditor: React.FC<{ file: RecentFile }> = ({ file }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadText = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const textContent = await getFileAsText(file);
        setContent(textContent);
      } catch (err) {
        console.error("Failed to load text file:", err);
        setError("Could not load file content.");
      } finally {
        setIsLoading(false);
      }
    };
    loadText();
  }, [file]);

  const lineCount = content.split('\n').length;

  return (
    <div className="h-full w-full flex bg-mono-gray-dark p-4 font-mono text-sm">
      <div className="w-full h-full flex overflow-auto bg-[#1E1E1E] rounded-lg border border-mono-border">
        {/* Line Numbers */}
        <div className="flex-shrink-0 text-right text-mono-text-secondary/50 p-4 select-none" style={{ lineHeight: '1.5rem' }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        {/* Content */}
        <div className="flex-grow p-4 overflow-auto">
          {isLoading && <p className="text-mono-text-secondary">Loading content...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!isLoading && !error && (
            <pre className="text-mono-text-primary whitespace-pre-wrap break-words m-0" style={{ lineHeight: '1.5rem' }}>
              <code>{content}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;