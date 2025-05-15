import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Document, Folder, User, Tag } from '../types';
import { getFromStorage } from '../utils/storageUtils';

type Page = 'dashboard' | 'documents' | 'folders' | 'settings';

interface AppContextProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load data from local storage on initial render
    const storedDocuments = getFromStorage<Document[]>('documents') || [];
    const storedFolders = getFromStorage<Folder[]>('folders') || [];
    const storedUser = getFromStorage<User>('currentUser') || null;
    const storedTags = getFromStorage<Tag[]>('tags') || [];

    setDocuments(storedDocuments);
    setFolders(storedFolders);
    setCurrentUser(storedUser);
    setTags(storedTags);
    setIsLoading(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        documents,
        setDocuments,
        folders,
        setFolders,
        currentUser,
        setCurrentUser,
        tags,
        setTags,
        isLoading,
        setIsLoading,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};