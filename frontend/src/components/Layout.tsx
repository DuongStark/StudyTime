import { ReactNode } from 'react';
import { Timer, ChartBar, GearSix, Export, Moon, Sun } from '@phosphor-icons/react';

export type PageKey = 'dashboard' | 'statistics' | 'settings' | 'export';

interface NavItem {
  key: PageKey;
  label: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <Timer size={20} weight="duotone" /> },
  { key: 'statistics', label: 'Statistics', icon: <ChartBar size={20} weight="duotone" /> },
  { key: 'settings', label: 'Settings', icon: <GearSix size={20} weight="duotone" /> },
  { key: 'export', label: 'Export', icon: <Export size={20} weight="duotone" /> },
];

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  isMobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentPage, onNavigate, isMobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-60 bg-white shadow-lg transition-transform duration-300 dark:bg-slate-800 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Study Timer
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  onClose();
                }}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  currentPage === item.key
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Pomodoro Timer
          </div>
        </div>
      </aside>
    </>
  );
}

interface LayoutProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  children: ReactNode;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
  onMobileClose: () => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

export function Layout({
  currentPage,
  onNavigate,
  children,
  isMobileOpen,
  onMobileToggle,
  onMobileClose,
  isDarkMode,
  onDarkModeToggle,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        isMobileOpen={isMobileOpen}
        onClose={onMobileClose}
      />

      {/* Top bar - desktop */}
      <div className="sticky top-0 z-30 hidden items-center justify-between border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-700 dark:bg-slate-800 lg:flex lg:ml-60">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {navItems.find((n) => n.key === currentPage)?.label}
        </h1>
        <button
          onClick={onDarkModeToggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
        </button>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-30 flex items-center border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800 lg:hidden">
        <button
          onClick={onMobileToggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="ml-3 flex-1 text-lg font-bold text-slate-900 dark:text-slate-100">
          {navItems.find((n) => n.key === currentPage)?.label}
        </h1>
        <button
          onClick={onDarkModeToggle}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          title="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={20} weight="fill" /> : <Moon size={20} weight="fill" />}
        </button>
      </div>

      {/* Main content */}
      <main className="lg:ml-60">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
