import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import DocumentCard from './DocumentCard';
import { Document, SortOption, SortDirection } from '../../types';
import { filterDocuments, sortDocuments } from '../../utils/fileUtils';
import { ArrowDownAZ, ArrowUpAZ, Calendar, FileText, Filter } from 'lucide-react';

interface DocumentListProps {
  selectedFolderId?: string | null;
  selectedTagIds?: string[];
}

const DocumentList = ({ selectedFolderId, selectedTagIds = [] }: DocumentListProps) => {
  const { documents, searchQuery } = useAppContext();
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort documents
  const filteredDocuments = filterDocuments(
    documents,
    searchQuery,
    selectedTagIds,
    selectedFolderId
  );
  
  const sortedDocuments = sortDocuments(
    filteredDocuments,
    sortBy,
    sortDirection
  );

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold text-gray-800">
          Documents {filteredDocuments.length > 0 && `(${filteredDocuments.length})`}
        </h2>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white rounded-md border border-gray-300 px-3 py-1">
            <Filter size={16} className="text-gray-500" />
            <select 
              className="bg-transparent border-none outline-none text-sm text-gray-600"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
          </div>
          
          <button 
            className="p-2 rounded-md border border-gray-300 bg-white text-gray-600"
            onClick={toggleSortDirection}
            aria-label="Toggle sort direction"
          >
            {sortDirection === 'asc' ? (
              <ArrowUpAZ size={16} />
            ) : (
              <ArrowDownAZ size={16} />
            )}
          </button>
          
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-500' : 'bg-white text-gray-600'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-500' : 'bg-white text-gray-600'}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <div className="flex flex-col gap-0.5">
                <div className="w-3 h-1.5 bg-current rounded-sm"></div>
                <div className="w-3 h-1.5 bg-current rounded-sm"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg border border-gray-200 p-8 mt-4 text-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <FileText size={24} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-1">No documents found</h3>
          <p className="text-gray-500">
            {searchQuery
              ? `No documents match your search "${searchQuery}"`
              : 'Upload some documents to get started'}
          </p>
        </div>
      ) : (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}`}>
          {sortedDocuments.map((document: Document) => (
            <DocumentCard 
              key={document.id} 
              document={document} 
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;