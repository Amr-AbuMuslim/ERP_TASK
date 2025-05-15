import { 
  LayoutDashboard, 
  FileText, 
  FolderTree, 
  Settings, 
  Star, 
  Clock, 
  Trash 
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Sidebar = () => {
  const { currentPage, setCurrentPage } = useAppContext();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={20} /> },
    { id: 'folders', label: 'Folders', icon: <FolderTree size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const quickAccessItems = [
    { id: 'starred', label: 'Starred', icon: <Star size={20} /> },
    { id: 'recent', label: 'Recent', icon: <Clock size={20} /> },
    { id: 'trash', label: 'Trash', icon: <Trash size={20} /> },
  ];

  const handleNavigate = (page: string) => {
    // Check if page is one of our main pages
    if (menuItems.find(item => item.id === page)) {
      setCurrentPage(page as any);
    }
  };

  return (
    <div className="hidden md:block w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="p-4">
        <div className="space-y-1">
          <h3 className="text-xs uppercase text-gray-500 font-semibold pl-2 mb-2">
            Main Menu
          </h3>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md w-full transition-colors ${
                currentPage === item.id
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleNavigate(item.id)}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-1">
          <h3 className="text-xs uppercase text-gray-500 font-semibold pl-2 mb-2">
            Quick Access
          </h3>
          {quickAccessItems.map((item) => (
            <button
              key={item.id}
              className="flex items-center space-x-3 px-3 py-2 rounded-md w-full text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;