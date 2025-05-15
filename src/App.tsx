import { useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Folders from './pages/Folders';
import Settings from './pages/Settings';
import { initializeLocalStorage } from './utils/storageUtils';

function App() {
  const { currentPage } = useAppContext();

  useEffect(() => {
    // Initialize local storage with default data if needed
    initializeLocalStorage();
  }, []);

  return (
    <Layout>
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'documents' && <Documents />}
      {currentPage === 'folders' && <Folders />}
      {currentPage === 'settings' && <Settings />}
    </Layout>
  );
}

export default App;