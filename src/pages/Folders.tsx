import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import DocumentList from '../components/documents/DocumentList';
import FolderTree from '../components/folders/FolderTree';
import FileUploader from '../components/documents/FileUploader';

const Folders = () => {
  const { folders } = useAppContext();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  const handleUploadComplete = () => {
    setIsUploadModalOpen(false);
  };

  // Get the current folder name
  const currentFolder = selectedFolderId 
    ? folders.find(folder => folder.id === selectedFolderId)
    : null;

  return (
    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4">
      <div className="lg:w-64">
        <FolderTree 
          selectedFolderId={selectedFolderId} 
          onSelectFolder={handleSelectFolder} 
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {currentFolder ? currentFolder.name : 'All Folders'}
          </h1>
          
          {selectedFolderId && (
            <button 
              className="btn btn-primary"
              onClick={() => setIsUploadModalOpen(!isUploadModalOpen)}
            >
              {isUploadModalOpen ? 'Close Upload' : 'Upload to Folder'}
            </button>
          )}
        </div>
        
        {isUploadModalOpen && selectedFolderId && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-md slide-up">
            <FileUploader 
              folderId={selectedFolderId}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        )}
        
        <DocumentList selectedFolderId={selectedFolderId} />
      </div>
    </div>
  );
};

export default Folders;