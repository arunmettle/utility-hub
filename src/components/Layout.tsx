import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeftRight,
  Braces,
  Command,
  FlaskConical,  LayoutGrid,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  Wand2,
  X,
} from 'lucide-react';
import { categories, tools } from '../utils/toolsData';
import { ToolFiltersProvider } from './ToolFiltersContext';

const categoryIcons = {
  'All Tools': LayoutGrid,
  'Encoders/Decoders': Braces,
  Formatters: Braces,
  Generators: Wand2,
  Converters: ArrowLeftRight,
  Testers: FlaskConical,
} as const;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('utility-hub-theme') === 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Tools');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('utility-hub-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query);
      const matchesCategory = selectedCategory === 'All Tools' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filterContext = {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredTools,
  };
  const activeSidebarBorderStyle = { borderLeftColor: '#0058be' };

  return (
    <ToolFiltersProvider value={filterContext}>
      <div className="min-h-screen bg-background text-text-primary dark:bg-[#101418] dark:text-[#f0f1f3]">
        <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border bg-surface shadow-header dark:border-[#2a2f34] dark:bg-[#151a20]">
          <div className="mx-auto flex h-full max-w-[1440px] items-center gap-4 px-6 md:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen((value) => !value)}
                className="button-ghost lg:!hidden"
                aria-label="Toggle navigation"
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              <Link to="/" className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-hover to-primary text-white shadow-card">
                  <Sparkles size={18} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold tracking-[-0.02em] text-text-primary dark:text-white">
                    Utility Hub
                  </p>
                  <p className="truncate text-xs text-text-secondary dark:text-[#aab2c0]">
                    Modern developer toolbox
                  </p>
                </div>
              </Link>
            </div>

            <div className="hidden flex-1 justify-center lg:flex">
              <label className="relative w-full min-w-[400px] max-w-[720px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-[#aab2c0]" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search tools, categories, and workflows"
                  className="h-11 w-full rounded-full border border-transparent bg-sidebar pl-11 pr-24 text-body-md text-text-primary outline-none placeholder:text-slate-400 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-[rgba(0,88,190,0.15)] dark:bg-[#1d232b] dark:text-white"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-text-secondary dark:border-[#2a2f34] dark:bg-[#151a20] dark:text-[#aab2c0]">
                  <Command size={12} />K
                </span>
              </label>
            </div>

            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={() => setDarkMode((value) => !value)}
                className="button-ghost"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="button-ghost"
                aria-label="Open GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-.09-1.09A3.37 3.37 0 0 0 18 14.5c0-4-2-5-2-5 .08-.2.34-1.02-.08-2.12 0 0-.67-.21-2.2.82a7.6 7.6 0 0 0-4 0c-1.53-1.03-2.2-.82-2.2-.82-.42 1.1-.16 1.92-.08 2.12 0 0-2 1-2 5a3.37 3.37 0 0 0 3.09 2.41A4.8 4.8 0 0 0 9 18v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </div>
          </div>
        </header>

        <aside
          className={`fixed bottom-0 left-0 top-16 z-40 w-[280px] border-r border-border bg-sidebar dark:border-[#2a2f34] dark:bg-[#151a20] ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6">
            <div className="lg:hidden">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary dark:text-[#aab2c0]" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search tools"
                  className="h-11 w-full rounded-full border border-transparent bg-surface pl-11 pr-4 text-body-md text-text-primary outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-[rgba(0,88,190,0.15)] dark:bg-[#1d232b] dark:text-white"
                />
              </label>
            </div>

            <div className="app-panel p-4 dark:border-[#2a2f34] dark:bg-[#11161c]">
              <p className="font-mono text-label-sm uppercase text-text-secondary dark:text-[#aab2c0]">Workspace</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="mini-card dark:border-[#2a2f34] dark:bg-[#1a2028]">
                  <p className="text-headline-sm font-semibold text-text-primary dark:text-white">{tools.length}</p>
                  <p className="mt-1 text-body-md text-text-secondary dark:text-[#aab2c0]">Tools</p>
                </div>
                <div className="mini-card dark:border-[#2a2f34] dark:bg-[#1a2028]">
                  <p className="text-headline-sm font-semibold text-text-primary dark:text-white">{categories.length - 1}</p>
                  <p className="mt-1 text-body-md text-text-secondary dark:text-[#aab2c0]">Categories</p>
                </div>
              </div>
            </div>

            <div>
              <p className="px-2 font-mono text-label-sm uppercase text-text-secondary dark:text-[#aab2c0]">Browse</p>
              <div className="mt-3 space-y-1">
                {categories.map((category) => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons] ?? LayoutGrid;
                  const isActive = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      style={isActive ? activeSidebarBorderStyle : undefined}
                      className={`flex w-full items-center gap-3 rounded-r-md border-l-4 px-3 py-3 text-left text-body-md transition ${
                        isActive
                          ? 'border-primary bg-[#DBEAFE] font-semibold text-text-primary dark:bg-[#1d334f] dark:text-white'
                          : 'border-transparent text-text-secondary hover:bg-[#F9FAFB] hover:text-text-primary dark:text-[#aab2c0] dark:hover:bg-[#1a2028] dark:hover:text-white'
                      }`}
                    >
                      <Icon size={17} className={isActive ? 'text-primary dark:text-[#adc6ff]' : ''} />
                      <span className="truncate">{category}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-h-0 flex-1">
              <div className="mb-3 flex items-center justify-between px-2">
                <p className="font-mono text-label-sm uppercase text-text-secondary dark:text-[#aab2c0]">Tools</p>
                <span className="rounded-full bg-surface px-2.5 py-1 font-mono text-[11px] text-text-secondary shadow-card dark:bg-[#1a2028] dark:text-[#aab2c0]">
                  {filteredTools.length}
                </span>
              </div>
              <div className="space-y-1">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = location.pathname === tool.path;

                  return (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      style={isActive ? activeSidebarBorderStyle : undefined}
                      className={`flex items-center gap-3 rounded-r-md border-l-4 px-3 py-3 transition ${
                        isActive
                          ? 'border-primary bg-[#DBEAFE] text-text-primary dark:bg-[#1d334f] dark:text-white'
                          : 'border-transparent text-text-secondary hover:bg-[#F9FAFB] hover:text-text-primary dark:text-[#aab2c0] dark:hover:bg-[#1a2028] dark:hover:text-white'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-primary dark:text-[#adc6ff]' : ''} />
                      <div className="min-w-0">
                        <p className={`truncate text-body-md ${isActive ? 'font-semibold' : 'font-medium'}`}>{tool.name}</p>
                        <p className="truncate font-mono text-[11px] uppercase text-text-secondary dark:text-[#8a94a6]">
                          {tool.category}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-[#191c1e]/20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        ) : null}

        <main className="pt-16 lg:pl-[280px]">
          <div className="min-h-[calc(100vh-64px)]">{children}</div>
        </main>
      </div>
    </ToolFiltersProvider>
  );
}
