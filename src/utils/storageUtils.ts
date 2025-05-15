import { Document, Folder, User, Tag } from '../types';

// Check if local storage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Initialize local storage with default data
export const initializeLocalStorage = () => {
  if (!isLocalStorageAvailable()) {
    console.error('Local storage is not available. Document manager will not persist data.');
    return;
  }

  // Check if data already exists
  if (!localStorage.getItem('initialized')) {
    // Default admin user
    const defaultUser: User = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    };

    // Default folders
    const defaultFolders: Folder[] = [
      {
        id: 'root',
        name: 'Root',
        parentId: null,
        createdDate: new Date().toISOString(),
        createdBy: defaultUser.id,
        permissions: {
          view: [defaultUser.id],
          edit: [defaultUser.id],
          delete: [defaultUser.id],
        },
      },
      {
        id: 'documents',
        name: 'Documents',
        parentId: 'root',
        createdDate: new Date().toISOString(),
        createdBy: defaultUser.id,
        permissions: {
          view: [defaultUser.id],
          edit: [defaultUser.id],
          delete: [defaultUser.id],
        },
      },
      {
        id: 'templates',
        name: 'Templates',
        parentId: 'root',
        createdDate: new Date().toISOString(),
        createdBy: defaultUser.id,
        permissions: {
          view: [defaultUser.id],
          edit: [defaultUser.id],
          delete: [defaultUser.id],
        },
      },
    ];

    // Default tags
    const defaultTags: Tag[] = [
      { id: '1', name: 'Important', color: '#f44336' },
      { id: '2', name: 'Contract', color: '#2196f3' },
      { id: '3', name: 'Invoice', color: '#4caf50' },
      { id: '4', name: 'Report', color: '#ff9800' },
    ];

    // Save default data
    saveToStorage('users', [defaultUser]);
    saveToStorage('currentUser', defaultUser);
    saveToStorage('folders', defaultFolders);
    saveToStorage('documents', []);
    saveToStorage('tags', defaultTags);
    saveToStorage('initialized', true);
  }
};

// Generic save to local storage
export const saveToStorage = <T>(key: string, data: T): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to local storage: ${error}`);
  }
};

// Generic get from local storage
export const getFromStorage = <T>(key: string): T | null => {
  if (!isLocalStorageAvailable()) return null;
  
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error retrieving from local storage: ${error}`);
    return null;
  }
};

// Update storage item
export const updateStorage = <T>(key: string, updateFn: (prevData: T) => T): void => {
  if (!isLocalStorageAvailable()) return;
  
  try {
    const prevData = getFromStorage<T>(key);
    if (prevData !== null) {
      const newData = updateFn(prevData);
      saveToStorage(key, newData);
    }
  } catch (error) {
    console.error(`Error updating local storage: ${error}`);
  }
};