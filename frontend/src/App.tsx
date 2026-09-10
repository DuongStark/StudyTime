import { useState, useEffect } from 'react';
import { Layout, PageKey } from './components/Layout';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Export from './pages/Export';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleDarkModeToggle = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'statistics':
        return <Statistics />;
      case 'settings':
        return <Settings isDarkMode={isDarkMode} onDarkModeToggle={handleDarkModeToggle} />;
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
      isDarkMode={isDarkMode}
      onDarkModeToggle={handleDarkModeToggle}
    >
      {renderPage()}
    </Layout>
  );
}
