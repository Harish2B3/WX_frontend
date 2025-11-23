// FIX: Add React import to resolve namespace errors.
import React from 'react';

export interface StorageCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  itemCount: number;
  storageUsed: number;
  storageTotal: number;
  color: string;
}

export interface RecentFile {
  id: string;
  name: string;
  icon: React.ReactNode;
  size: string;
  shared: 'Me' | 'Team' | string;
  lastModified: string;
  lastModifiedTimestamp: string;
  mimeType: string;
  parentId?: string;
  previewUrl?: string;
  trashedAt?: string;
  isFavorite?: boolean;
  isQuickAccess?: boolean;
  path?: { id: string; name: string }[];
}

export interface SearchResultFile extends RecentFile {
  path: { id: string; name: string }[];
}

export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
}

export interface SearchFilters {
  type: 'all' | 'image' | 'video' | 'document' | 'folder';
  dateRange: 'any' | 'day' | 'week' | 'month' | 'year';
  sizeRange: 'any' | 'small' | 'medium' | 'large' | 'xlarge';
}