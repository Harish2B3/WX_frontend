


import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { SearchIcon, InfoIcon, BellIcon, SettingsIcon, MenuIcon, XIcon, FilterIcon } from '../constants/icons';
import { SearchResultFile, User, SearchFilters } from '../types';
import SearchResults from './SearchResults';
import SearchFiltersComponent from './SearchFilters';

interface HeaderProps {
  user: User;
  onMenuClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: SearchResultFile[];
  isSearching: boolean;
  onResultClick: (result: SearchResultFile) => void;
  isSearchFocused: boolean;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  onClearSearch: () => void;
  searchFilters: SearchFilters;
  onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { 
    user, onMenuClick, 
    searchQuery, onSearchChange, searchResults, isSearching, onResultClick,
    isSearchFocused, onSearchFocus, onSearchBlur, onClearSearch,
    searchFilters, onFilterChange, onClearFilters
  } = props;
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterPopupRef = useRef<HTMLDivElement>(null);
  const [filterMenuStyle, setFilterMenuStyle] = useState<React.CSSProperties>({});

  const portalRoot = typeof document !== 'undefined' ? document.getElementById('portal-root') : null;
  
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // If the element that receives focus is not a child of the search container, then blur.
    if (!searchContainerRef.current?.contains(e.relatedTarget as Node)) {
      onSearchBlur();
    }
  };

  useLayoutEffect(() => {
    if (isFilterOpen && filterButtonRef.current) {
      const rect = filterButtonRef.current.getBoundingClientRect();
      const dropdownWidth = 288; // w-72
      let top = rect.bottom + 8;
      let left = rect.right - dropdownWidth;

      if (left < 8) left = 8;

      setFilterMenuStyle({ top: `${top}px`, left: `${left}px`, width: `${dropdownWidth}px` });
    }
  }, [isFilterOpen]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        isFilterOpen &&
        filterPopupRef.current && !filterPopupRef.current.contains(target) &&
        filterButtonRef.current && !filterButtonRef.current.contains(target)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);
  
  const isFilterActive = searchFilters.type !== 'all' || searchFilters.dateRange !== 'any' || searchFilters.sizeRange !== 'any';

  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <button 
          onClick={onMenuClick} 
          className="p-2 rounded-full text-mono-text-secondary hover:bg-mono-gray-mid/50 hover:text-mono-text-primary transition-colors duration-200 lg:hidden"
          aria-label="Open sidebar"
        >
          <MenuIcon />
        </button>
        <h1 className="text-3xl font-bold text-shiny-gradient hidden sm:block">File Manager</h1>
      </div>
      
      <div 
        ref={searchContainerRef}
        onFocus={onSearchFocus}
        onBlur={handleBlur}
        className="flex-1 w-full md:w-auto md:max-w-xl relative flex items-center gap-2"
      >
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-mono-gray-dark/50 border border-mono-border text-mono-text-primary rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-accent-purple shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
          />
          {searchQuery ? (
            <button 
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-mono-text-secondary hover:text-mono-text-primary"
              aria-label="Clear search"
            >
              <XIcon />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-mono-text-secondary pointer-events-none">
              <kbd className="px-2 py-1.5 border border-mono-border rounded-md">⌘+K</kbd>
            </div>
          )}
        </div>

        <button 
            ref={filterButtonRef}
            onClick={() => setIsFilterOpen(prev => !prev)}
            className={`p-2 rounded-lg text-mono-text-secondary hover:bg-mono-gray-mid/50 hover:text-mono-text-primary transition-colors duration-200 ${isFilterActive ? 'filter-button-active' : ''}`}
            aria-label="Toggle search filters"
        >
            <FilterIcon />
        </button>
        
        {isFilterOpen && portalRoot && createPortal(
            <div ref={filterPopupRef} style={filterMenuStyle} className="fixed z-50 filter-popover-enter-active">
                <SearchFiltersComponent 
                    filters={searchFilters}
                    onFilterChange={onFilterChange}
                    onClearFilters={onClearFilters}
                />
            </div>,
            portalRoot
        )}

        {(isSearchFocused && searchQuery) && (
          <SearchResults 
            results={searchResults}
            isLoading={isSearching}
            onResultClick={onResultClick}
          />
        )}
      </div>
      
      <div className="hidden sm:flex items-center gap-4">
        <button className="p-2 rounded-full text-mono-text-secondary hover:bg-mono-gray-mid/50 hover:text-mono-text-primary transition-colors duration-200">
          <InfoIcon />
        </button>
        <button className="p-2 rounded-full text-mono-text-secondary hover:bg-mono-gray-mid/50 hover:text-mono-text-primary transition-colors duration-200">
          <BellIcon />
        </button>
        <button className="p-2 rounded-full text-mono-text-secondary hover:bg-mono-gray-mid/50 hover:text-mono-text-primary transition-colors duration-200">
          <SettingsIcon />
        </button>
        <div
          title={user.username}
          className="w-10 h-10 rounded-full border-2 border-accent-purple flex items-center justify-center bg-mono-gray-dark text-accent-purple-light font-bold text-lg"
        >
          {user.username.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Header;