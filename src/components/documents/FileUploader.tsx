import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, X, AlertCircle, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../../context/AppContext';
import { UploadProgress, Document } from '../../types';
import { validateFile, readFileAsBase64, generateDocumentMetadata, allowedFileTypes } from '../../utils/fileUtils';
import { saveToStorage } from '../../utils/storageUtils';

interface FileUploaderProps {
  folderId?: string | null;
  onUploadComplete?: () => void;
  onError?: (error: string) => void;
}

const FileUploader = ({ folderId = null, onUploadComplete, onError }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { documents, setDocuments, currentUser, tags } = useAppContext();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    if (!currentUser) {
      onError?.('Please log in to upload files');
      return;
    }

    // Reset progress tracker for new uploads
    setUploadProgress([]);
    
    // Initialize progress for each file
    const initialProgress = files.map(file => ({
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const
    }));
    
    setUploadProgress(initialProgress);

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file);

      if (!validation.valid) {
        setUploadProgress(prev => 
          prev.map((item, idx) => 
            idx === i ? { ...item, status: 'error' as const, error: validation.error } : item
          )
        );
        onError?.(validation.error || 'File validation failed');
        continue;
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = [...prev];
          if (newProgress[i] && newProgress[i].progress < 90) {
            newProgress[i] = { 
              ...newProgress[i], 
              progress: newProgress[i].progress + 10 
            };
          }
          return newProgress;
        });
      }, 200);

      try {
        // Read file as base64
        const content = await readFileAsBase64(file);
        
        // Generate metadata
        const metadata = generateDocumentMetadata(file, currentUser.id, folderId, selectedTags);
        
        // Create new document object with unique identifier
        const newDocument: Document = {
          id: uuidv4(),
          content,
          ...metadata as Document
        };

        // Add to documents array
        const updatedDocuments = [...documents, newDocument];
        setDocuments(updatedDocuments);
        saveToStorage('documents', updatedDocuments);

        // Update progress to complete
        clearInterval(progressInterval);
        setUploadProgress(prev => 
          prev.map((item, idx) => 
            idx === i ? { ...item, progress: 100, status: 'complete' as const } : item
          )
        );
      } catch (error) {
        clearInterval(progressInterval);
        const errorMessage = error instanceof Error ? error.message : 'Failed to process file';
        setUploadProgress(prev => 
          prev.map((item, idx) => 
            idx === i ? { ...item, status: 'error' as const, error: errorMessage } : item
          )
        );
        onError?.(errorMessage);
      }
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Reset selected tags
    setSelectedTags([]);

    // Call onUploadComplete callback
    if (onUploadComplete) {
      onUploadComplete();
    }

    // Clear progress after 3 seconds
    setTimeout(() => {
      setUploadProgress([]);
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all ${
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-3 bg-primary-50 rounded-full text-primary-500 mb-4">
          <UploadCloud size={24} />
        </div>
        <p className="text-sm font-medium mb-1">
          {isDragging ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className="text-xs text-gray-500 mb-3">Or click to browse</p>
        <button
          className="btn btn-primary text-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          accept={allowedFileTypes.join(',')}
        />
      </div>

      {uploadProgress.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Upload Progress</h3>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setUploadProgress([])}
              aria-label="Clear upload progress"
            >
              <X size={16} />
            </button>
          </div>
          
          {uploadProgress.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  {item.status === 'error' ? (
                    <AlertCircle size={16} className="text-error-500 mr-2" />
                  ) : item.status === 'complete' ? (
                    <CheckCircle size={16} className="text-success-500 mr-2" />
                  ) : null}
                  <span className="truncate max-w-xs">{item.fileName}</span>
                </div>
                <span className="text-xs text-gray-500">{item.progress}%</span>
              </div>
              
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    item.status === 'error' 
                      ? 'bg-error-500' 
                      : item.status === 'complete' 
                        ? 'bg-success-500' 
                        : 'bg-primary-500'
                  }`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
              
              {item.error && (
                <p className="text-xs text-error-500">{item.error}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium mb-3">Select Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => {
                setSelectedTags(prev => 
                  prev.includes(tag.id) 
                    ? prev.filter(id => id !== tag.id)
                    : [...prev, tag.id]
                );
              }}
              className={`tag ${
                selectedTags.includes(tag.id)
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;