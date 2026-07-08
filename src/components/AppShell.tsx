import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpenText,
  ChevronDown,
  Info,
  Lightbulb,
  Menu,
  MessageSquarePlus,
  Moon,
  Search,
  Sun,
  X,
  type LucideIcon,
} from 'lucide-react';
import { getIndustryToolPath, getIndustryWorkspaceByPathname, workspaces } from '../data/industryWorkspaces';
import { tools, type ToolDefinition } from '../data/tools';
import BrandMark from './BrandMark';
import AdNetworkLoader from './AdNetworkLoader';
import SeoManager from './SeoManager';

type ThemeMode = 'light' | 'dark';

const themeStorageKey = 'utility-hub-theme';

type SidebarToolEntry = ToolDefinition & {
  navigationPath: string;
};

type SidebarGroup = {
  id: string;
  title: string;
  tools: SidebarToolEntry[];
};

type NavEntry = {
  label: string;
  to: string;
  match: (pathname: string) => boolean;
  description: string;
  icon: LucideIcon;
};

function createGroupOpenState(groups: SidebarGroup[], isExpandedByDefault: boolean) {
  return Object.fromEntries(groups.map((group) => [group.id, isExpandedByDefault])) as Record<string, boolean>;
}

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
  const location = useLocation();
  const workspace = useMemo(() => getIndustryWorkspaceByPathname(location.pathname), [location.pathname]);
  const isWorkspaceContext = Boolean(workspace);

  const scopedTools = useMemo<SidebarToolEntry[]>(() => {
    if (!workspace) {
      return [];
    }

    return workspace.toolIds.flatMap((toolId) => {
      const tool = tools.find((entry) => entry.id === toolId);
      return tool
        ? [
            {
              ...tool,
              navigationPath: getIndustryToolPath(workspace.slug, tool.id),
            },
          ]
        : [];
    });
  }, [workspace]);

  const groupedTools = useMemo<SidebarGroup[]>(() => {
    if (!workspace) {
      return [];
    }

    return workspace.sections.map((section) => ({
      id: section.id,
      title: section.title,
      tools: section.toolIds.flatMap((toolId) => scopedTools.filter((tool) => tool.id === toolId)),
    }));
  }, [scopedTools, workspace]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    createGroupOpenState(groupedTools, typeof window !== 'undefined' ? window.innerWidth > 960 : true),
  );

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.hash) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.replace('#', '');
    const scrollToTarget = () => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    };

    const frame = window.requestAnimationFrame(scrollToTarget);
    return () => window.cancelAnimationFrame(frame);
  }, [location.hash, location.pathname]);

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
    if (isDesktop || query.trim().length > 0) {
      return;
    }

    setOpenGroups((current) => {
      const collapsedState = createGroupOpenState(groupedTools, false);
      const hasDifferentValue = groupedTools.some((group) => current[group.id] !== collapsedState[group.id]);
      return hasDifferentValue ? collapsedState : current;
    });
  }, [groupedTools, isDesktop, query]);

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

  useEffect(() => {
    setOpenGroups((current) => {
      const nextState = createGroupOpenState(groupedTools, isDesktop);
      for (const group of groupedTools) {
        if (group.id in current) {
          nextState[group.id] = current[group.id];
        }
      }

      const currentKeys = Object.keys(current);
      const nextKeys = Object.keys(nextState);
      const sameKeys =
        currentKeys.length === nextKeys.length && nextKeys.every((key) => currentKeys.includes(key) && current[key] === nextState[key]);

      return sameKeys ? current : nextState;
    });
  }, [groupedTools, isDesktop]);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return scopedTools.filter((tool) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery) ||
        tool.category.toLowerCase().includes(normalizedQuery);

      return matchesQuery;
    });
  }, [query, scopedTools]);

  const visibleGroups = useMemo(
    () =>
      groupedTools
        .map((group) => ({
          ...group,
          tools: group.tools.filter((tool) => filteredTools.some((entry) => entry.id === tool.id)),
        }))
        .filter((group) => group.tools.length > 0 || query.trim().length === 0),
    [filteredTools, groupedTools, query],
  );

  useEffect(() => {
    const activeTool = scopedTools.find((tool) => tool.navigationPath === location.pathname);
    if (!activeTool) return;

    const activeGroup = groupedTools.find((group) => group.tools.some((tool) => tool.id === activeTool.id));
    if (!activeGroup) return;

    setOpenGroups((current) => {
      if (current[activeGroup.id]) {
        return current;
      }

      return {
        ...current,
        [activeGroup.id]: true,
      };
    });
  }, [groupedTools, location.pathname, scopedTools]);

  useEffect(() => {
    const hasSearch = query.trim().length > 0;
    if (!hasSearch) return;

    setOpenGroups((current) => {
      const nextState = { ...current };
      let changed = false;

      for (const group of groupedTools) {
        const hasMatchingTools = group.tools.some((tool) => filteredTools.some((entry) => entry.id === tool.id));
        if (current[group.id] !== hasMatchingTools) {
          nextState[group.id] = hasMatchingTools;
          changed = true;
        }
      }

      return changed ? nextState : current;
    });
  }, [filteredTools, groupedTools, query]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  };

  const sidebarVisible = isDesktop ? desktopSidebarExpanded : mobileSidebarOpen;
  const sidebarNavEntries: NavEntry[] = workspace
    ? [
        ...workspaces.map((entry) => ({
          label: `${entry.shortTitle} workspace`,
          to: entry.path,
          match: (pathname: string) => pathname === entry.path || Boolean(getIndustryWorkspaceByPathname(pathname)?.slug === entry.slug),
          description: entry.audience,
          icon: entry.icon,
        })),
        ...(workspace.collectionPath
          ? [
              {
                label: 'Collections',
                to: workspace.collectionPath,
                match: (pathname: string) => pathname === workspace.collectionPath || pathname.startsWith('/collections'),
                description: 'Role and workflow guides',
                icon: Lightbulb,
              },
            ]
          : []),
        {
          label: 'Feedback',
          to: '/feedback',
          match: (pathname) => pathname === '/feedback',
          description: 'Tell us what is missing',
          icon: MessageSquarePlus,
        },
        {
          label: 'Wishlist',
          to: '/wishlist',
          match: (pathname) => pathname === '/wishlist',
          description: 'Request the next tool',
          icon: Lightbulb,
        },
      ]
    : [
        ...workspaces.map((entry) => ({
          label: `${entry.shortTitle} workspace`,
          to: entry.path,
          match: (pathname: string) => pathname === entry.path,
          description: entry.audience,
          icon: entry.icon,
        })),
        {
          label: 'Guides',
          to: '/guides',
          match: (pathname) => pathname.startsWith('/guides'),
          description: 'Learn and use cases',
          icon: BookOpenText,
        },
        {
          label: 'Collections',
          to: '/collections',
          match: (pathname) => pathname.startsWith('/collections'),
          description: 'Curated by role',
          icon: Lightbulb,
        },
        {
          label: 'Feedback',
          to: '/feedback',
          match: (pathname) => pathname === '/feedback',
          description: 'What was missing',
          icon: MessageSquarePlus,
        },
        {
          label: 'Wishlist',
          to: '/wishlist',
          match: (pathname) => pathname === '/wishlist',
          description: 'Request a tool',
          icon: Lightbulb,
        },
      ];

  const topbarLinks = workspace
    ? [
        { label: 'Workspaces', to: '/workspaces' },
        { label: `${workspace.shortTitle} workspace`, to: workspace.path },
        ...(workspace.collectionPath ? [{ label: 'Collections', to: workspace.collectionPath }] : []),
        { label: 'All collections', to: '/collections' },
        { label: 'About', to: '/about' },
      ]
    : [
        { label: 'Workspaces', to: '/workspaces' },
        { label: 'Guides', to: '/guides' },
        { label: 'Collections', to: '/collections' },
        { label: 'About', to: '/about' },
        { label: 'Wishlist', to: '/wishlist' },
      ];

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
      <AdNetworkLoader />
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
          <Link
            to="/"
            className="sidebar__brand-copy"
            aria-label="Go to UtilityHub home"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <BrandMark withWordmark />
          </Link>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__section-head">
            <p className="sidebar__label">{isWorkspaceContext ? 'Tools' : 'Workspaces'}</p>
            <span className="sidebar__count">{isWorkspaceContext ? filteredTools.length : workspaces.length}</span>
          </div>
        </div>

        <div className="sidebar__section">
          <div className="sidebar__group">
            {sidebarNavEntries.map((entry) => {
              const Icon = entry.icon;
              return (
                <Link
                  key={entry.label}
                  to={entry.to}
                  className={`sidebar__item sidebar__item--link ${entry.match(location.pathname) ? 'is-active' : ''}`}
                >
                  <Icon size={18} />
                  <div>
                    <p>{entry.label}</p>
                    <span>{entry.description}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {isWorkspaceContext ? (
          <div className="sidebar__section sidebar__section--grow">
            <div className="sidebar__scroll">
              <nav className="sidebar__accordion">
                {visibleGroups.map((group) => {
                  const isOpen = openGroups[group.id];

                  return (
                    <section key={group.id} className="sidebar__accordion-section">
                      <button
                        type="button"
                        className={`sidebar__accordion-trigger ${isOpen ? 'is-open' : ''}`}
                        onClick={() => toggleGroup(group.id)}
                        aria-expanded={isOpen}
                        aria-controls={`sidebar-panel-${group.id.toLowerCase()}`}
                      >
                        <ChevronDown size={18} />
                        <span>{group.title}</span>
                      </button>

                      <div
                        id={`sidebar-panel-${group.id.toLowerCase()}`}
                        className={`sidebar__accordion-panel ${isOpen ? 'is-open' : ''}`}
                        hidden={!isOpen}
                      >
                        <div className="sidebar__accordion-rail" aria-hidden="true" />
                        <div className="sidebar__group sidebar__group--nested">
                          {group.tools.map((tool) => {
                            const Icon = tool.icon;

                            return (
                              <Link
                                key={tool.id}
                                to={tool.navigationPath}
                                className={`sidebar__item sidebar__item--link ${location.pathname === tool.navigationPath ? 'is-active' : ''}`}
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
        ) : null}
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
            <Link to="/" className="icon-button icon-button--brand" aria-label="UtilityHub home">
              <BrandMark size={36} />
            </Link>
            <label className="searchbar" htmlFor="tool-search">
              <Search size={18} />
              <input
                id="tool-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={workspace?.searchPlaceholder ?? 'Open a workspace to search tools'}
                disabled={!isWorkspaceContext}
              />
              <span className="searchbar__hint">Ctrl + K</span>
            </label>
          </div>

          <div className="topbar__actions">
            {topbarLinks.map((entry) => (
              <Link key={entry.label} className="topbar__link" to={entry.to}>
                {entry.label}
              </Link>
            ))}
            <Link className="icon-button" to="/about" aria-label="About UtilityHub">
              <Info size={20} />
            </Link>
            <button
              type="button"
              className="icon-button"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Link className="cta-button" to={workspace ? `${workspace.path}#${workspace.slug}-tool-groups` : '/workspaces'}>
              {workspace?.ctaLabel ?? 'View tools'}
            </Link>
          </div>
        </header>

        {!isDesktop && query.trim().length > 0 && isWorkspaceContext ? (
          <section className="mobile-search-results" aria-label="Search results">
            <div className="mobile-search-results__head">
              <strong>Matching tools</strong>
              <span>{filteredTools.length}</span>
            </div>
            {filteredTools.length > 0 ? (
              <div className="mobile-search-results__list">
                {filteredTools.slice(0, 8).map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Link
                      key={tool.id}
                      to={tool.navigationPath}
                      className={`mobile-search-results__item ${location.pathname === tool.navigationPath ? 'is-active' : ''}`}
                      onClick={() => {
                        setQuery('');
                        setMobileSidebarOpen(false);
                      }}
                    >
                      <Icon size={18} />
                      <div>
                        <p>{tool.name}</p>
                        <span>{tool.category}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="mobile-search-results__empty">No matching tools yet. Try another keyword.</p>
            )}
          </section>
        ) : null}

        <main className="workspace">{children}</main>
        <footer className="site-footer" aria-label="Site footer">
          <div className="site-footer__inner">
            <p className="site-footer__copy">UtilityHub is a privacy-first collection of browser-based workflow tools.</p>
            <nav className="site-footer__nav" aria-label="Footer links">
              <Link to="/about" className="site-footer__link">
                About
              </Link>
              <Link to="/privacy" className="site-footer__link">
                Privacy
              </Link>
              <Link to="/terms" className="site-footer__link">
                Terms
              </Link>
              <Link to="/feedback" className="site-footer__link">
                Feedback
              </Link>
              <Link to="/wishlist" className="site-footer__link">
                Wishlist
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
