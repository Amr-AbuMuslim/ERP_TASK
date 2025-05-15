import { Document } from '../types';

export const allowedFileTypes = [
  'application/pdf', 
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  'image/jpeg',
  'image/png',
  'image/gif'
];

export const maxFileSize = 10 * 1024 * 1024; // 10MB

// Validate file type and size
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (!allowedFileTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Supported types: PDF, Word, Excel, PowerPoint, Text, CSV, and Images.`,
    };
  }

  if (file.size > maxFileSize) {
    return {
      valid: false,
      error: `File is too large. Maximum file size is ${formatFileSize(maxFileSize)}.`,
    };
  }

  return { valid: true };
};

// Read file as a base64 string
export const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file extension from mime type
export const getFileExtension = (mimeType: string): string => {
  const mimeToExt: Record<string, string> = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
  };
  
  return mimeToExt[mimeType] || 'unknown';
};

// Generate file icon based on file type
export const getFileIconByType = (mimeType: string): string => {
  const extension = getFileExtension(mimeType);
  
  switch (extension) {
    case 'pdf':
      return 'file-text';
    case 'doc':
    case 'docx':
      return 'file-text';
    case 'xls':
    case 'xlsx':
      return 'file-spreadsheet';
    case 'ppt':
    case 'pptx':
      return 'file-presentation';
    case 'jpg':
    case 'png':
    case 'gif':
      return 'image';
    case 'txt':
    case 'csv':
      return 'file-text';
    default:
      return 'file';
  }
};

// Filter documents based on search query, tags, and folder
export const filterDocuments = (
  documents: Document[], 
  searchQuery: string,
  tagFilter: string[] = [],
  folderFilter: string | null = null
): Document[] => {
  return documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = tagFilter.length === 0 || tagFilter.some(tagId => doc.tags.includes(tagId));
    const matchesFolder = folderFilter === null || doc.folderId === folderFilter;
    
    return matchesSearch && matchesTags && matchesFolder;
  });
};

// Sort documents based on criteria
export const sortDocuments = (
  documents: Document[],
  sortBy: 'name' | 'date' | 'size' | 'type',
  sortDirection: 'asc' | 'desc'
): Document[] => {
  return [...documents].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'type':
        comparison = getFileExtension(a.type).localeCompare(getFileExtension(b.type));
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};

// Check if user has permission for a document
export const checkDocumentPermission = (
  document: Document,
  userId: string,
  permission: 'view' | 'edit' | 'delete'
): boolean => {
  return document.permissions[permission].includes(userId);
};

// Generate document metadata
export const generateDocumentMetadata = (
  file: File,
  userId: string,
  folderId: string | null = null,
  tags: string[] = []
): Partial<Document> => {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    folderId,
    uploadDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    tags,
    createdBy: userId,
    isStarred: false,
    permissions: {
      view: [userId],
      edit: [userId],
      delete: [userId]
    }
  };
};