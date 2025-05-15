import { Star, MoreVertical, FileText, Image, FileSpreadsheet } from 'lucide-react';
import { Document, Tag } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { formatFileSize, getFileIconByType } from '../../utils/fileUtils';
import { updateStorage } from '../../utils/storageUtils';

interface DocumentCardProps {
  document: Document;
  viewMode: 'grid' | 'list';
}

const DocumentCard = ({ document, viewMode }: DocumentCardProps) => {
  const { tags, setDocuments, documents } = useAppContext();

  // Get tags associated with this document
  const documentTags = tags.filter(tag => document.tags.includes(tag.id));
  
  // Get icon based on file type
  const iconName = getFileIconByType(document.type);
  
  const getIcon = () => {
    switch (iconName) {
      case 'file-text':
        return <FileText className="text-blue-500" />;
      case 'image':
        return <Image className="text-purple-500" />;
      case 'file-spreadsheet':
        return <FileSpreadsheet className="text-green-500" />;
      default:
        return <FileText className="text-gray-500" />;
    }
  };

  const toggleStar = () => {
    const updatedDocument = { ...document, isStarred: !document.isStarred };
    const updatedDocuments = documents.map(doc => 
      doc.id === document.id ? updatedDocument : doc
    );
    
    setDocuments(updatedDocuments);
    updateStorage('documents', () => updatedDocuments);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-md border border-gray-200 hover:border-primary-300 p-3 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
            {getIcon()}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-800 truncate max-w-xs">
              {document.name}
            </h3>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span>{formatFileSize(document.size)}</span>
              <span className="mx-1">•</span>
              <span>{new Date(document.lastModified).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {documentTags.slice(0, 2).map(tag => (
            <span 
              key={tag.id} 
              className="tag"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
          
          <button 
            className={`p-1 rounded-full ${document.isStarred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
            onClick={toggleStar}
            aria-label={document.isStarred ? "Unstar document" : "Star document"}
          >
            <Star size={16} fill={document.isStarred ? 'currentColor' : 'none'} />
          </button>
          
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-700" aria-label="More options">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-primary-300 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
            {getIcon()}
          </div>
          
          <div className="flex items-center">
            <button 
              className={`p-1 rounded-full ${document.isStarred ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}`}
              onClick={toggleStar}
              aria-label={document.isStarred ? "Unstar document" : "Star document"}
            >
              <Star size={16} fill={document.isStarred ? 'currentColor' : 'none'} />
            </button>
            
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-700" aria-label="More options">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>
        
        <h3 className="text-sm font-medium text-gray-800 truncate mb-1">{document.name}</h3>
        
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <span>{formatFileSize(document.size)}</span>
          <span className="mx-1">•</span>
          <span>{new Date(document.lastModified).toLocaleDateString()}</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {documentTags.slice(0, 3).map(tag => (
            <span 
              key={tag.id} 
              className="tag"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              {tag.name}
            </span>
          ))}
          {documentTags.length > 3 && (
            <span className="tag bg-gray-100 text-gray-600">+{documentTags.length - 3}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;