

import React from 'react';
import {
  OverviewIcon,
  FolderIcon,
  StarIcon,
  TrashIcon,
  StorageBoxIcon,
  XIcon,
  LightningIcon
} from '../constants/icons';
import { MoveIcon } from '../constants/icons';

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between py-2 px-4 rounded-lg transition-colors duration-200 text-left ${
      active ? 'bg-black/20 text-accent-purple font-semibold' : 'text-mono-text-secondary hover:bg-black/20 hover:text-mono-text-primary'
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    {count && (
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
        active ? 'bg-accent-purple text-mono-text-primary' : 'bg-mono-gray-light text-mono-text-primary'
      }`}>
        {count}
      </span>
    )}
  </button>
);

interface SidebarProps {
    currentView: 'overview' | 'storage' | 'trash' | 'favorites' | 'quickaccess';
    onSetView: (view: 'overview' | 'storage' | 'trash' | 'favorites' | 'quickaccess') => void;
    totalStorageUsed: string;
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onSetView, totalStorageUsed, isOpen, onClose, onLogout }) => {
  return (
    <aside className={`w-80 p-6 flex-col flex rounded-r-2xl glossy-card fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold text-shiny-gradient">WormX Drive</h1>
        <button onClick={onClose} className="lg:hidden p-1 rounded-full text-mono-text-secondary hover:bg-black/20">
          <XIcon />
        </button>
      </div>
      
      <nav className="flex-1 space-y-4">
        <div>
          <h2 className="text-xs text-mono-text-secondary font-semibold uppercase px-4 mb-2">Overview</h2>
          <NavLink 
            icon={<OverviewIcon />} 
            label="Overview Storage" 
            active={currentView === 'overview'}
            onClick={() => onSetView('overview')}
          />
        </div>
        
        <div>
          <h2 className="text-xs text-mono-text-secondary font-semibold uppercase px-4 mb-2">File Manager</h2>
          <div className="space-y-1">
            <NavLink 
                icon={<FolderIcon />} 
                label="My Storage" 
                active={currentView === 'storage'}
                onClick={() => onSetView('storage')}
            />
            <NavLink 
                icon={<LightningIcon />} 
                label="Quick Access" 
                active={currentView === 'quickaccess'}
                onClick={() => onSetView('quickaccess')}
            />
            <NavLink 
                icon={<StarIcon />} 
                label="Favorites" 
                active={currentView === 'favorites'}
                onClick={() => onSetView('favorites')}
            />
            <NavLink 
                icon={<TrashIcon />} 
                label="Trash"
                active={currentView === 'trash'}
                onClick={() => onSetView('trash')}
            />
          </div>
        </div>
      </nav>
      
      <div className="mt-auto">
        <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2 text-mono-text-secondary">
                <StorageBoxIcon />
                <span>Storage</span>
            </div>
            <span className="font-medium text-mono-text-primary">{totalStorageUsed} MB Used</span>
        </div>
        <div className="w-full text-center text-mono-text-secondary text-sm p-2 bg-black/20 rounded-lg">
           <span className="font-bold text-lg text-accent-purple-light">&infin;</span> Unlimited Storage
        </div>
        <div className="flex gap-2 mt-4">
            <button onClick={onLogout} className="flex-1 flex justify-center items-center gap-2 py-3 px-4 bg-mono-gray-mid/50 rounded-lg text-mono-text-secondary hover:bg-mono-gray-light/50 hover:text-mono-text-primary transition-colors duration-200 text-sm font-medium">
                <MoveIcon /> Logout
            </button>
            <button className="flex-1 glossy-accent-button text-mono-text-primary font-bold py-3 px-4 rounded-lg text-sm">
                Manage Plan
            </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;