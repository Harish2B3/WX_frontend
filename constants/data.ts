import { StorageCategory, RecentFile } from '../types';
import { 
    FileTypeIcon, ImageIcon, VideoIcon, DocumentIcon, OtherIcon
} from './icons';
import React from 'react';

// FIX: The `FileTypeIcon` component requires a `children` prop, which was causing a
// TypeScript error. The fix is to include `children` explicitly in the props object
// passed to `React.createElement`.
export const storageCategories: StorageCategory[] = [
  {
    id: 'image',
    name: 'Image',
    icon: React.createElement(FileTypeIcon, { color: "bg-mono-gray-light", children: React.createElement(ImageIcon) }),
    itemCount: 0,
    storageUsed: 0,
    storageTotal: 0,
    color: 'bg-gradient-to-r from-accent-purple-light to-accent-purple-dark'
  },
  {
    id: 'video',
    name: 'Video',
    icon: React.createElement(FileTypeIcon, { color: "bg-mono-gray-light", children: React.createElement(VideoIcon) }),
    itemCount: 0,
    storageUsed: 0,
    storageTotal: 0,
    color: 'bg-gradient-to-r from-accent-purple-light to-accent-purple-dark'
  },
  {
    id: 'document',
    name: 'Document',
    icon: React.createElement(FileTypeIcon, { color: "bg-mono-gray-light", children: React.createElement(DocumentIcon) }),
    itemCount: 0,
    storageUsed: 0,
    storageTotal: 0,
    color: 'bg-gradient-to-r from-accent-purple-light to-accent-purple-dark'
  },
  {
    id: 'others',
    name: 'Others',
    icon: React.createElement(FileTypeIcon, { color: "bg-mono-gray-light", children: React.createElement(OtherIcon) }),
    itemCount: 0,
    storageUsed: 0,
    storageTotal: 0,
    color: 'bg-gradient-to-r from-accent-purple-light to-accent-purple-dark'
  },
];

export const recentFiles: RecentFile[] = [];