import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppContext } from '../../context/AppContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isLoading } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 overflow-auto min-h-screen-without-header">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary-300 mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="mt-6 w-full max-w-lg">
                  <div className="h-10 bg-gray-200 rounded mb-4"></div>
                  <div className="h-32 bg-gray-200 rounded mb-4"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="fade-in">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;