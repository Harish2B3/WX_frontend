import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { RecentFile } from '../types';
import { DotsVerticalIcon, DownloadIcon, TrashIcon, MoveIcon, StarIcon, StarFilledIcon, LightningIcon, LightningFilledIcon } from '../constants/icons';

interface ActionsMenuProps {
  file: RecentFile;
  onDelete: (fileId: string) => void;
  onDownload: (file: RecentFile) => void;
  onMove: (file: RecentFile) => void;
  onToggleFavorite: (fileId: string) => void;
  onToggleQuickAccess: (fileId: string) => void;
}

const ActionsMenu: React.FC<ActionsMenuProps> = ({ file, onDelete, onDownload, onMove, onToggleFavorite, onToggleQuickAccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const portalRoot = typeof document !== 'undefined' ? document.getElementById('portal-root') : null;

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 200; // Adjusted for 5 items, padding, and border
      const dropdownWidth = 224;  // w-56
      
      let top = rect.bottom + 4;
      let left = rect.right - dropdownWidth;

      // Flip vertically if not enough space below
      if (rect.bottom + dropdownHeight > window.innerHeight && rect.top > dropdownHeight) {
        top = rect.top - dropdownHeight - 4;
      }
      
      // Prevent horizontal overflow
      if (left < 8) left = 8;
      if (rect.right > window.innerWidth) left = window.innerWidth - dropdownWidth - 8;
      
      setMenuStyle({ top: `${top}px`, left: `${left}px` });
    }
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
    setIsOpen(false);
  };

  const menuContent = (
    <div
      ref={menuRef}
      style={menuStyle}
      className="fixed w-56 bg-mono-gray-mid rounded-lg shadow-lg z-50 glossy-card py-1 border border-mono-border/50"
    >
      <button
        onClick={(e) => handleAction(e, () => onDownload(file))}
        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-mono-text-primary hover:bg-black/20 transition-colors"
      >
        <DownloadIcon /> Download
      </button>
      <button
        onClick={(e) => handleAction(e, () => onMove(file))}
        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-mono-text-primary hover:bg-black/20 transition-colors"
      >
        <MoveIcon /> Move
      </button>
      <button
        onClick={(e) => handleAction(e, () => onToggleFavorite(file.id))}
        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-mono-text-primary hover:bg-black/20 transition-colors"
      >
        {file.isFavorite ? <StarFilledIcon /> : <StarIcon />} {file.isFavorite ? 'Unfavorite' : 'Mark as Favorite'}
      </button>
      <button
        onClick={(e) => handleAction(e, () => onToggleQuickAccess(file.id))}
        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-mono-text-primary hover:bg-black/20 transition-colors"
      >
        {file.isQuickAccess ? <LightningFilledIcon /> : <LightningIcon />} {file.isQuickAccess ? 'Remove from Quick Access' : 'Add to Quick Access'}
      </button>
      <div className="border-t border-mono-border/50 my-1"></div>
      <button
        onClick={(e) => handleAction(e, () => onDelete(file.id))}
        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/50 transition-colors"
      >
        <TrashIcon /> Delete
      </button>
    </div>
  );

  return (
    <>
      <button ref={buttonRef} onClick={toggleMenu} className="p-1 rounded-full hover:bg-mono-gray-light transition-colors">
        <DotsVerticalIcon />
      </button>
      {isOpen && portalRoot && createPortal(menuContent, portalRoot)}
    </>
  );
};

export default ActionsMenu;