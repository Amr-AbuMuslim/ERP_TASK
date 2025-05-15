import { FolderUp } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 rounded bg-primary-500 flex items-center justify-center">
        <FolderUp size={20} className="text-white" />
      </div>
    </div>
  );
};

export default Logo;