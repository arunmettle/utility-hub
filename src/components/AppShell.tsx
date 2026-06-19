import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Info,
  Menu,
  Sun,
  Moon,
  Search,
  X,
} from 'lucide-react';
import { categories, tools, type ToolCategory } from '../data/tools';
import BrandMark from './BrandMark';
import SeoManager from './SeoManager';

type ThemeMode = 'light' | 'dark';

const toolCategories = categories.filter(
  (category): category is Exclude<ToolCategory, 'All tools'> => category !== 'All tools',
);

const themeStorageKey = 'utility-hub-theme';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 960 : true,
  );
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<Exclude<ToolCategory, 'All tools'>, boolean>>(() =>
    Object.fromEntries(toolCategories.map((category) => [category, true])) as Record<Exclude<ToolCategory, 'All tools'>, boolean>,
  );
  const location = useLocation();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const updateViewportMode = () => {
      setIsDesktop(window.innerWidth > 960);
    };

    updateViewportMode();
    window.addEventListener('resize', updateViewportMode);

    return () => {
      window.removeEventListener('resize', updateViewportMode);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = !isDesktop && mobileSidebarOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isDesktop, mobileSidebarOpen]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const field = document.getElementById('tool-search');
        if (field instanceof HTMLInputElement) {
          field.focus();
          field.select();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery) ||
        tool.category.toLowerCase().includes(normalizedQuery);

      return matchesQuery;
    });
  }, [query]);

  const groupedTools = useMemo(() => {
    return toolCategories
      .map((category) => ({
        category,
        tools: filteredTools.filter((tool) => tool.category === category),
      }))
      .filter((group) => group.tools.length > 0 || query.trim().length === 0);
  }, [filteredTools, query]);

  useEffect(() => {
    const activeTool = tools.find((tool) => tool.path === location.pathname);
    if (!activeTool) return;

    setOpenCategories((current) => {
      if (current[activeTool.category]) {
        return current;
      }

      return {
        ...current,
        [activeTool.category]: true,
      };
    });
  }, [location.pathname]);

  useEffect(() => {
    const hasSearch = query.trim().length > 0;
    if (!hasSearch) return;

    setOpenCategories((current) => {
      const nextState = { ...current };
      let changed = false;

      for (const category of toolCategories) {
        const hasMatchingTools = filteredTools.some((tool) => tool.category === category);
        if (current[category] !== hasMatchingTools) {
          nextState[category] = hasMatchingTools;
          changed = true;
        }
      }

      return changed ? nextState : current;
    });
  }, [filteredTools, query]);

  const toggleCategory = (category: Exclude<ToolCategory, 'All tools'>) => {
    setOpenCategories((current) => ({
      ...current,
      [category]: !current[category],
    }));
  };

  const sidebarVisible = isDesktop ? desktopSidebarExpanded : mobileSidebarOpen;

  const handleSidebarToggle = () => {
    if (isDesktop) {
      setDesktopSidebarExpanded((expanded) => !expanded);
      return;
    }

    setMobileSidebarOpen((open) => !open);
  };

  return (
    <div className={`app-shell ${isDesktop && !desktopSidebarExpanded ? 'app-shell--sidebar-collapsed' : ''}`}>
      <SeoManager />
      <aside
        id="app-sidebar"
        className={`sidebar ${sidebarVisible ? 'sidebar--open' : ''} ${isDesktop && !desktopSidebarExpanded ? 'sidebar--collapsed' : ''}`}
        aria-hidden={!sidebarVisible}
      >
        <div className="sidebar__brand">
          <button
            type="button"
            className="sidebar__close"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
          <div className="sidebar__brand-copy">
            <BrandMark withWordmark />
            <p className="sidebar__subtitle">Minimal browser-side utilities for developers, reviewers, and platform teams</p>
          </div>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__section-head">
            <p className="sidebar__label">Tools</p>
            <span className="sidebar__count">{filteredTools.length}</span>
          </div>
        </div>

        <div className="sidebar__section sidebar__section--grow">
          <div className="sidebar__scroll">
            <nav className="sidebar__accordion">
              {groupedTools.map((group) => {
                const isOpen = openCategories[group.category];

                return (
                  <section key={group.category} className="sidebar__accordion-section">
                    <button
                      type="button"
                      className={`sidebar__accordion-trigger ${isOpen ? 'is-open' : ''}`}
                      onClick={() => toggleCategory(group.category)}
                      aria-expanded={isOpen}
                      aria-controls={`sidebar-panel-${group.category.toLowerCase()}`}
                    >
                      <ChevronDown size={18} />
                      <span>{group.category}</span>
                    </button>

                    <div
                      id={`sidebar-panel-${group.category.toLowerCase()}`}
                      className={`sidebar__accordion-panel ${isOpen ? 'is-open' : ''}`}
                      hidden={!isOpen}
                    >
                      <div className="sidebar__accordion-rail" aria-hidden="true" />
                      <div className="sidebar__group sidebar__group--nested">
                        {group.tools.map((tool) => {
                          const Icon = tool.icon;
                          const active = location.pathname === tool.path;

                          return (
                            <Link
                              key={tool.id}
                              to={tool.path}
                              className={`sidebar__item sidebar__item--link ${active ? 'is-active' : ''}`}
                              onClick={() => setMobileSidebarOpen(false)}
                            >
                              <Icon size={18} />
                              <div>
                                <p>{tool.name}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {!isDesktop && mobileSidebarOpen ? (
        <button type="button" className="sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)} aria-label="Close sidebar" />
      ) : null}

      <div className={`main-shell ${isDesktop && !desktopSidebarExpanded ? 'main-shell--expanded' : ''}`}>
        <header className="topbar">
          <div className="topbar__left">
            <button
              type="button"
              className="icon-button topbar__nav-toggle"
              onClick={handleSidebarToggle}
              aria-label={sidebarVisible ? 'Close sidebar' : 'Open sidebar'}
              aria-expanded={sidebarVisible}
              aria-controls="app-sidebar"
            >
              {sidebarVisible ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link to="/" className="icon-button icon-button--brand" aria-label="Cobalt home">
              <BrandMark size={24} />
            </Link>
            <label className="searchbar" htmlFor="tool-search">
              <Search size={18} />
              <input
                id="tool-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
              />
              <span className="searchbar__hint">Ctrl + K</span>
            </label>
          </div>

          <div className="topbar__actions">
            <a className="icon-button" href="/#faq" aria-label="About Cobalt">
              <Info size={20} />
            </a>
            <button
              type="button"
              className="icon-button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <a className="cta-button" href="#all-tools">
              View tools
            </a>
          </div>
        </header>

        <main className="workspace">{children}</main>
      </div>
    </div>
  );
}
