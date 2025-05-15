import { useState } from 'react';
import { UserCircle, Shield, Tag, Database, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';
import { saveToStorage } from '../utils/storageUtils';

const Settings = () => {
  const { currentUser, setCurrentUser } = useAppContext();
  const [formData, setFormData] = useState<User>({
    id: currentUser?.id || '1',
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    role: currentUser?.role || 'user',
    avatar: currentUser?.avatar || '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(formData);
    saveToStorage('currentUser', formData);
    setSaveSuccess(true);
    
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const menuItems = [
    { id: 'profile', label: 'User Profile', icon: <UserCircle size={20} /> },
    { id: 'permissions', label: 'Permissions', icon: <Shield size={20} /> },
    { id: 'tags', label: 'Tags Management', icon: <Tag size={20} /> },
    { id: 'storage', label: 'Storage Settings', icon: <Database size={20} /> },
  ];

  return (
    <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-6">
      <div className="lg:w-64 bg-white rounded-lg border border-gray-200 p-4 h-fit">
        <h3 className="text-sm font-medium mb-4">Settings</h3>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md w-full transition-colors ${
                item.id === 'profile'
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">User Profile</h2>
          
          {saveSuccess && (
            <div className="mb-4 p-3 bg-success-50 text-success-500 rounded-md">
              Profile settings saved successfully!
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL (optional)
                </label>
                <input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar || ''}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">Application Settings</h2>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
            
            <div className="bg-red-50 rounded-md p-4 flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">Clear All Data</h4>
                <p className="text-sm text-red-700 mt-1">
                  This will permanently delete all documents, folders, and settings. This action cannot be undone.
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                    onClick={clearAllData}
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;