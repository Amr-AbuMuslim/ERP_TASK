export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  folderId: string | null;
  uploadDate: string;
  lastModified: string;
  content: string; // Base64 encoded file content
  tags: string[]; // Array of tag IDs
  createdBy: string; // User ID
  isStarred: boolean;
  permissions: {
    view: string[]; // Array of user IDs with view permission
    edit: string[]; // Array of user IDs with edit permission
    delete: string[]; // Array of user IDs with delete permission
  };
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdDate: string;
  createdBy: string; // User ID
  permissions: {
    view: string[]; // Array of user IDs with view permission
    edit: string[]; // Array of user IDs with edit permission
    delete: string[]; // Array of user IDs with delete permission
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number; // 0-100
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export type SortOption = 'name' | 'date' | 'size' | 'type';
export type SortDirection = 'asc' | 'desc';