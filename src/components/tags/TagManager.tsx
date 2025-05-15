import { useState } from 'react';
import { Plus, X, Check, Edit2, Trash2 } from 'lucide-react';
import { Tag } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { updateStorage } from '../../utils/storageUtils';

interface TagManagerProps {
  selectedTags?: string[];
  onSelectTag?: (tagId: string) => void;
  onRemoveTag?: (tagId: string) => void;
}

// List of predefined colors for tags
const colorOptions = [
  '#f44336', // Red
  '#e91e63', // Pink
  '#9c27b0', // Purple
  '#673ab7', // Deep Purple
  '#3f51b5', // Indigo
  '#2196f3', // Blue
  '#03a9f4', // Light Blue
  '#00bcd4', // Cyan
  '#009688', // Teal
  '#4caf50', // Green
  '#8bc34a', // Light Green
  '#cddc39', // Lime
  '#ffeb3b', // Yellow
  '#ffc107', // Amber
  '#ff9800', // Orange
  '#ff5722', // Deep Orange
  '#795548', // Brown
  '#607d8b', // Blue Grey
];

const TagManager = ({ selectedTags = [], onSelectTag, onRemoveTag }: TagManagerProps) => {
  const { tags, setTags, documents, setDocuments } = useAppContext();
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(colorOptions[0]);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [editingTagColor, setEditingTagColor] = useState('');

  const startCreatingTag = () => {
    setIsCreatingTag(true);
    setNewTagName('');
    setNewTagColor(colorOptions[Math.floor(Math.random() * colorOptions.length)]);
    setEditingTagId(null);
  };

  const cancelCreateTag = () => {
    setIsCreatingTag(false);
    setNewTagName('');
  };

  const startEditingTag = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
    setEditingTagColor(tag.color);
    setIsCreatingTag(false);
  };

  const cancelEditingTag = () => {
    setEditingTagId(null);
    setEditingTagName('');
    setEditingTagColor('');
  };

  const createNewTag = () => {
    if (!newTagName.trim()) return;

    const newTag: Tag = {
      id: uuidv4(),
      name: newTagName.trim(),
      color: newTagColor,
    };

    const updatedTags = [...tags, newTag];
    setTags(updatedTags);
    updateStorage('tags', () => updatedTags);

    // Reset state
    setIsCreatingTag(false);
    setNewTagName('');

    // If onSelectTag is provided, select the new tag
    if (onSelectTag) {
      onSelectTag(newTag.id);
    }
  };

  const updateTag = () => {
    if (!editingTagId || !editingTagName.trim()) return;

    const updatedTags = tags.map(tag =>
      tag.id === editingTagId
        ? { ...tag, name: editingTagName.trim(), color: editingTagColor }
        : tag
    );

    setTags(updatedTags);
    updateStorage('tags', () => updatedTags);
    setEditingTagId(null);
    setEditingTagName('');
    setEditingTagColor('');
  };

  const deleteTag = (tagId: string) => {
    // Check if tag is being used in any documents
    const isTagInUse = documents.some(doc => doc.tags.includes(tagId));

    if (isTagInUse) {
      if (confirm('This tag is used in some documents. Deleting it will remove it from all documents. Continue?')) {
        // Remove tag from all documents
        const updatedDocuments = documents.map(doc => ({
          ...doc,
          tags: doc.tags.filter(id => id !== tagId)
        }));
        setDocuments(updatedDocuments);
        updateStorage('documents', () => updatedDocuments);
      } else {
        return;
      }
    }

    const updatedTags = tags.filter(tag => tag.id !== tagId);
    setTags(updatedTags);
    updateStorage('tags', () => updatedTags);

    // If tag was selected, remove it from selection
    if (onRemoveTag && selectedTags.includes(tagId)) {
      onRemoveTag(tagId);
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onRemoveTag && onRemoveTag(tagId);
    } else {
      onSelectTag && onSelectTag(tagId);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Tags</h3>
        <button
          className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
          onClick={startCreatingTag}
          aria-label="Create new tag"
        >
          <Plus size={16} />
        </button>
      </div>

      {isCreatingTag ? (
        <div className="mb-3">
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag name"
              className="text-sm py-1 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') createNewTag();
                if (e.key === 'Escape') cancelCreateTag();
              }}
            />
            <button
              className="ml-2 p-1 text-gray-400 hover:text-gray-700 rounded-full"
              onClick={cancelCreateTag}
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
            <button
              className="ml-1 p-1 text-gray-400 hover:text-success-500 rounded-full"
              onClick={createNewTag}
              aria-label="Create tag"
            >
              <Check size={16} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                className={`w-5 h-5 rounded-full ${newTagColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setNewTagColor(color)}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-1">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={`flex items-center justify-between py-1 px-2 rounded-md ${
              selectedTags.includes(tag.id) ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            {editingTagId === tag.id ? (
              <div className="flex items-center flex-1">
                <input
                  type="text"
                  value={editingTagName}
                  onChange={(e) => setEditingTagName(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border rounded-md"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') updateTag();
                    if (e.key === 'Escape') cancelEditingTag();
                  }}
                />
                <div className="flex ml-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`w-4 h-4 rounded-full mx-0.5 ${editingTagColor === color ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingTagColor(color)}
                    />
                  ))}
                </div>
                <button
                  onClick={updateTag}
                  className="ml-2 p-1 text-success-500 hover:text-success-600"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={cancelEditingTag}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <div 
                  className="flex items-center flex-1 cursor-pointer"
                  onClick={() => toggleTag(tag.id)}
                >
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: tag.color }}
                  ></span>
                  <span className="text-sm">{tag.name}</span>
                </div>
                
                <div className="flex items-center">
                  {selectedTags.includes(tag.id) && onRemoveTag && (
                    <Check size={14} className="text-primary-500 mr-2" />
                  )}
                  <button
                    onClick={() => startEditingTag(tag)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => deleteTag(tag.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        
        {tags.length === 0 && !isCreatingTag && (
          <p className="text-xs text-gray-500 py-1">No tags yet. Create a tag to get started.</p>
        )}
      </div>
    </div>
  );
};

export default TagManager;