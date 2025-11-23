
import React from 'react';
import { SearchResultFile } from '../types';

interface SearchResultsProps {
  results: SearchResultFile[];
  isLoading: boolean;
  onResultClick: (result: SearchResultFile) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading, onResultClick }) => {
  const formatPath = (path: { id: string; name: string }[]): string => {
    // Return all but the last part of the path, joined by " / "
    return path.slice(0, -1).map(p => p.name).join(' / ');
  };

  return (
    <div className="absolute top-full mt-2 w-full bg-mono-gray-mid rounded-lg shadow-lg z-20 glossy-card overflow-hidden border border-mono-border/50 animate-fade-in-down">
      <div className="max-h-80 overflow-y-auto">
        {isLoading && (
          <div className="p-4 text-center text-mono-text-secondary">Searching...</div>
        )}
        {!isLoading && results.length === 0 && (
          <div className="p-4 text-center text-mono-text-secondary">No results found.</div>
        )}
        {!isLoading && results.length > 0 && (
          <ul>
            {results.map(result => (
              <li key={result.id}>
                <button
                  onClick={() => onResultClick(result)}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-mono-text-primary hover:bg-black/20 transition-colors"
                >
                  <div className="flex-shrink-0 text-mono-text-secondary">{result.icon}</div>
                  <div className="flex-grow overflow-hidden">
                    <p className="font-medium truncate">{result.name}</p>
                    <p className="text-xs text-mono-text-secondary truncate">{formatPath(result.path)}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
       <style>{`
        @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
            animation: fade-in-down 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SearchResults;
