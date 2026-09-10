import { useState } from 'react';
import { Layout, PageKey } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Export from './pages/Export';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'statistics':
        return <Statistics />;
      case 'settings':
        return <Settings />;
      case 'export':
        return <Export />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      isMobileOpen={isMobileOpen}
      onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
      onMobileClose={() => setIsMobileOpen(false)}
    >
      {renderPage()}
    </Layout>
  );
}
