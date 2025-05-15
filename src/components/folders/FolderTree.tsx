import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderPlus,
  FolderOpenDot,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Check 
} from 'lucide-react';
import { Folder as FolderType } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { updateStorage } from '../../utils/storageUtils';

interface FolderTreeProps {
  selectedFolderId?: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

const FolderTree = ({ selectedFolderId, onSelectFolder }: FolderTreeProps) => {
  const { folders, setFolders, currentUser, documents } = useAppContext();
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['root']);
  const [newFolderParentId, setNewFolderParentId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  // Get root level folders
  const rootFolders = folders.filter(folder => folder.parentId === 'root');

  // Get count of documents in a folder and its subfolders
  const getDocumentCount = (folderId: string): number => {
    const directDocuments = documents.filter(doc => doc.folderId === folderId).length;
    const childFolders = folders.filter(folder => folder.parentId === folderId);
    const childDocuments = childFolders.reduce((count, folder) => {
      return count + getDocumentCount(folder.id);
    }, 0);
    
    return directDocuments + childDocuments;
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const startNewFolder = (parentId: string) => {
    setNewFolderParentId(parentId);
    setNewFolderName('');
    setEditingFolderId(null);
  };

  const cancelNewFolder = () => {
    setNewFolderParentId(null);
    setNewFolderName('');
  };

  const startEditFolder = (folder: FolderType) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
    setNewFolderParentId(null);
  };

  const cancelEditFolder = () => {
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  const createNewFolder = () => {
    if (!newFolderName.trim() || !newFolderParentId) return;

    const newFolder: FolderType = {
      id: uuidv4(),
      name: newFolderName.trim(),
      parentId: newFolderParentId,
      createdDate: new Date().toISOString(),
      createdBy: currentUser?.id || 'anonymous',
      permissions: {
        view: currentUser ? [currentUser.id] : [],
        edit: currentUser ? [currentUser.id] : [],
        delete: currentUser ? [currentUser.id] : []
      }
    };

    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    updateStorage('folders', () => updatedFolders);
    
    // Expand the parent folder
    if (!expandedFolders.includes(newFolderParentId)) {
      setExpandedFolders([...expandedFolders, newFolderParentId]);
    }
    
    // Reset new folder state
    setNewFolderParentId(null);
    setNewFolderName('');
  };

  const updateFolder = () => {
    if (!editingFolderId || !editingFolderName.trim()) return;

    const updatedFolders = folders.map(folder => 
      folder.id === editingFolderId
        ? { ...folder, name: editingFolderName.trim() }
        : folder
    );

    setFolders(updatedFolders);
    updateStorage('folders', () => updatedFolders);
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  const deleteFolder = (folderId: string) => {
    // Check if folder has documents
    const hasDocuments = documents.some(doc => doc.folderId === folderId);
    
    // Check if folder has subfolders
    const hasSubfolders = folders.some(folder => folder.parentId === folderId);

    if (hasDocuments || hasSubfolders) {
      alert('Cannot delete folder that contains documents or subfolders');
      return;
    }

    if (confirm('Are you sure you want to delete this folder?')) {
      const updatedFolders = folders.filter(folder => folder.id !== folderId);
      setFolders(updatedFolders);
      updateStorage('folders', () => updatedFolders);

      // If deleted folder was selected, reset selection
      if (selectedFolderId === folderId) {
        onSelectFolder(null);
      }
    }
  };

  // Recursive component to render folder tree
  const renderFolderTree = (parentId: string | null) => {
    const childFolders = folders.filter(folder => folder.parentId === parentId);
    
    return (
      <ul className={`space-y-1 ${parentId !== 'root' ? 'ml-4' : ''}`}>
        {childFolders.map((folder) => {
          const isExpanded = expandedFolders.includes(folder.id);
          const isSelected = selectedFolderId === folder.id;
          const hasChildren = folders.some(f => f.parentId === folder.id);
          const documentCount = getDocumentCount(folder.id);
          const isEditing = editingFolderId === folder.id;
          
          return (
            <li key={folder.id}>
              <div className="flex group">
                <div 
                  className={`flex-1 flex items-center py-1 px-2 rounded-md cursor-pointer ${
                    isSelected ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <button
                    onClick={() => hasChildren && toggleFolder(folder.id)}
                    className={`p-1 mr-1 text-gray-400 ${!hasChildren && 'invisible'}`}
                    aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
                  >
                    {isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                  
                  {isEditing ? (
                    <div className="flex items-center flex-1">
                      <input
                        type="text"
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border rounded-md"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') updateFolder();
                          if (e.key === 'Escape') cancelEditFolder();
                        }}
                      />
                      <button
                        onClick={updateFolder}
                        className="p-1 text-success-500 hover:text-success-600"
                        aria-label="Save folder name"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={cancelEditFolder}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        aria-label="Cancel editing"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="flex items-center flex-1"
                      onClick={() => onSelectFolder(folder.id)}
                    >
                      {isSelected ? (
                        <FolderOpenDot size={16} className="text-primary-500 mr-1.5" />
                      ) : (
                        <Folder size={16} className="text-gray-500 mr-1.5" />
                      )}
                      <span className="text-sm">{folder.name}</span>
                      
                      {documentCount > 0 && (
                        <span className="ml-1.5 text-xs text-gray-500">{documentCount}</span>
                      )}
                    </button>
                  )}
                </div>
                
                {!isEditing && (
                  <div className="flex items-center invisible group-hover:visible">
                    <button
                      className="p-1 text-gray-400 hover:text-gray-700"
                      onClick={() => startNewFolder(folder.id)}
                      aria-label="New subfolder"
                    >
                      <FolderPlus size={14} />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-gray-700"
                      onClick={() => startEditFolder(folder)}
                      aria-label="Edit folder"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-gray-700"
                      onClick={() => deleteFolder(folder.id)}
                      aria-label="Delete folder"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              {newFolderParentId === folder.id && (
                <div className="flex items-center ml-6 mt-1 mb-1">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name"
                    className="text-sm py-1 px-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') createNewFolder();
                      if (e.key === 'Escape') cancelNewFolder();
                    }}
                  />
                  <button
                    className="py-1 px-2 bg-primary-500 text-white rounded-r-md text-sm"
                    onClick={createNewFolder}
                  >
                    Add
                  </button>
                </div>
              )}
              
              {isExpanded && hasChildren && renderFolderTree(folder.id)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Folders</h3>
        <button
          className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
          onClick={() => startNewFolder('root')}
          aria-label="Add new root folder"
        >
          <FolderPlus size={16} />
        </button>
      </div>
      
      <div>
        <div 
          className={`flex items-center py-1 px-2 rounded-md cursor-pointer mb-2 ${
            selectedFolderId === null ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-100'
          }`}
          onClick={() => onSelectFolder(null)}
        >
          <Folder size={16} className={selectedFolderId === null ? 'text-primary-500 mr-1.5' : 'text-gray-500 mr-1.5'} />
          <span className="text-sm">All Documents</span>
        </div>
        
        {newFolderParentId === 'root' && (
          <div className="flex items-center ml-2 mb-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="text-sm py-1 px-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') createNewFolder();
                if (e.key === 'Escape') cancelNewFolder();
              }}
            />
            <button
              className="py-1 px-2 bg-primary-500 text-white rounded-r-md text-sm"
              onClick={createNewFolder}
            >
              Add
            </button>
          </div>
        )}
        
        {renderFolderTree('root')}
      </div>
    </div>
  );
};

export default FolderTree;