import { useState, useEffect } from 'react';
import { 
  FileText, 
  Clock, 
  Star, 
  BarChart3, 
  HardDrive,
  FileWarning
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import DocumentCard from '../components/documents/DocumentCard';
import { formatFileSize } from '../utils/fileUtils';

const Dashboard = () => {
  const { documents, currentUser } = useAppContext();
  const [totalSize, setTotalSize] = useState(0);
  const [fileTypeDistribution, setFileTypeDistribution] = useState<Record<string, number>>({});

  useEffect(() => {
    // Calculate total storage used
    const totalBytes = documents.reduce((sum, doc) => sum + doc.size, 0);
    setTotalSize(totalBytes);

    // Calculate file type distribution
    const typeCount: Record<string, number> = {};
    documents.forEach(doc => {
      const extension = doc.name.split('.').pop()?.toLowerCase() || 'unknown';
      typeCount[extension] = (typeCount[extension] || 0) + 1;
    });
    setFileTypeDistribution(typeCount);
  }, [documents]);

  // Get recently modified documents
  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
    .slice(0, 4);

  // Get starred documents
  const starredDocuments = documents.filter(doc => doc.isStarred).slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, {currentUser?.name || 'User'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card flex items-center p-5">
          <div className="p-3 bg-blue-50 rounded-full mr-4">
            <FileText size={24} className="text-primary-500" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500 font-medium">Total Documents</h3>
            <p className="text-2xl font-semibold">{documents.length}</p>
          </div>
        </div>
        
        <div className="card flex items-center p-5">
          <div className="p-3 bg-green-50 rounded-full mr-4">
            <HardDrive size={24} className="text-success-500" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500 font-medium">Storage Used</h3>
            <p className="text-2xl font-semibold">{formatFileSize(totalSize)}</p>
          </div>
        </div>
        
        <div className="card flex items-center p-5">
          <div className="p-3 bg-yellow-50 rounded-full mr-4">
            <Star size={24} className="text-yellow-500" />
          </div>
          <div>
            <h3 className="text-sm text-gray-500 font-medium">Starred Documents</h3>
            <p className="text-2xl font-semibold">{starredDocuments.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Clock size={18} className="text-primary-500 mr-2" />
              <h2 className="text-lg font-medium">Recent Documents</h2>
            </div>
            <a href="#" className="text-sm text-primary-500 hover:underline">View All</a>
          </div>
          
          {recentDocuments.length > 0 ? (
            <div className="space-y-2">
              {recentDocuments.map(doc => (
                <DocumentCard key={doc.id} document={doc} viewMode="list" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <FileWarning size={36} className="text-gray-300 mb-2" />
              <p className="text-gray-500">No recent documents found</p>
            </div>
          )}
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Star size={18} className="text-yellow-500 mr-2" />
              <h2 className="text-lg font-medium">Starred Documents</h2>
            </div>
            <a href="#" className="text-sm text-primary-500 hover:underline">View All</a>
          </div>
          
          {starredDocuments.length > 0 ? (
            <div className="space-y-2">
              {starredDocuments.map(doc => (
                <DocumentCard key={doc.id} document={doc} viewMode="list" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Star size={36} className="text-gray-300 mb-2" />
              <p className="text-gray-500">No starred documents yet</p>
              <p className="text-xs text-gray-400 mt-1">Star important documents for quick access</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center mb-4">
          <BarChart3 size={18} className="text-primary-500 mr-2" />
          <h2 className="text-lg font-medium">Storage Overview</h2>
        </div>
        
        {Object.keys(fileTypeDistribution).length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Object.entries(fileTypeDistribution).map(([type, count]) => (
                <div key={type} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="font-medium">{type.toUpperCase()}</div>
                  <div className="text-sm text-gray-500">{count} files</div>
                </div>
              ))}
            </div>
            
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500" style={{ width: `${(totalSize / (100 * 1024 * 1024)) * 100}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatFileSize(totalSize)}</span>
              <span>100 MB</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <HardDrive size={36} className="text-gray-300 mb-2" />
            <p className="text-gray-500">No documents uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;