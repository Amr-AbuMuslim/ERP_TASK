import { useState } from 'react';
import DocumentList from '../components/documents/DocumentList';
import FileUploader from '../components/documents/FileUploader';
import FolderTree from '../components/folders/FolderTree';
import TagManager from '../components/tags/TagManager';

const Documents = () => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleSelectFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  const handleSelectTag = (tagId: string) => {
    if (!selectedTagIds.includes(tagId)) {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
  };

  const handleUploadComplete = () => {
    setIsUploadModalOpen(false);
  };

  return (
    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4">
      <div className="lg:w-64 space-y-4">
        <FolderTree 
          selectedFolderId={selectedFolderId} 
          onSelectFolder={handleSelectFolder} 
        />
        
        <TagManager 
          selectedTags={selectedTagIds}
          onSelectTag={handleSelectTag}
          onRemoveTag={handleRemoveTag}
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Documents</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setIsUploadModalOpen(!isUploadModalOpen)}
          >
            {isUploadModalOpen ? 'Close Upload' : 'Upload Documents'}
          </button>
        </div>
        
        {isUploadModalOpen && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-md slide-up">
            <FileUploader 
              folderId={selectedFolderId}
              onUploadComplete={handleUploadComplete}
            />
          </div>
        )}
        
        <DocumentList 
          selectedFolderId={selectedFolderId}
          selectedTagIds={selectedTagIds}
        />
      </div>
    </div>
  );
};

export default Documents;