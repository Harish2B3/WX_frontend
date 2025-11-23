import React from 'react';
import { DocFileIcon, PdfFileIcon, XlsFileIcon, ImageIcon, VideoIcon, FileIcon, FolderIcon } from '../constants/icons';

export const getFileIcon = (mimeType?: string): React.ReactNode => {
    if (!mimeType) return <FileIcon />;

    if (mimeType === 'application/vnd.wormx-cloud.folder') {
        return <FolderIcon />;
    }

    if (mimeType.startsWith('image/')) {
        return <ImageIcon />;
    }
    if (mimeType.startsWith('video/')) {
        return <VideoIcon />;
    }
    if (mimeType === 'application/pdf') {
        return <PdfFileIcon />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
        return <XlsFileIcon />;
    }
    if (mimeType.includes('word') || mimeType.includes('document') || mimeType === 'text/plain') {
        return <DocFileIcon />;
    }
    
    return <FileIcon />;
};