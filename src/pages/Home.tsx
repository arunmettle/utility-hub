import { Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { tools } from '../utils/toolsData';
import { useToolFilters } from '../components/ToolFiltersContext';

const highlights = [
  {
    title: 'Runs locally',
    description: 'Every workflow stays in the browser, keeping sensitive developer data private.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast interactions',
    description: 'Subtle motion, sharp spacing, and predictable controls keep repetitive tasks efficient.',
    icon: Zap,
  },
  {
    title: 'Professional UI',
    description: 'A clean, modern toolbox system designed for daily engineering workflows.',
    icon: Sparkles,
  },
];

export default function Home() {
  const { filteredTools, searchQuery, selectedCategory } = useToolFilters();
  const visibleTools = filteredTools;

  return (
    <div className="page-shell">
      <section className="app-panel p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="tool-tag">Developer Toolbox</span>
            <h1 className="mt-4 text-headline-lg font-bold tracking-[-0.02em] text-text-primary">
              Clean utility workflows built around clarity, speed, and technical precision.
            </h1>
            <p className="mt-4 text-body-lg text-text-secondary">
              Browse focused tools for formatting, encoding, testing, and generating development data with a Stitch-inspired interface system.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <div className="mini-card min-w-[150px]">
              <p className="font-mono text-label-sm uppercase text-text-secondary">Tool Count</p>
              <p className="mt-3 text-headline-md font-semibold text-text-primary">{tools.length}</p>
            </div>
            <div className="mini-card min-w-[150px]">
              <p className="font-mono text-label-sm uppercase text-text-secondary">Visible</p>
              <p className="mt-3 text-headline-md font-semibold text-text-primary">{visibleTools.length}</p>
            </div>
            <div className="mini-card col-span-2 min-w-[150px] md:col-span-1">
              <p className="font-mono text-label-sm uppercase text-text-secondary">Focus</p>
              <p className="mt-3 truncate text-body-lg font-semibold text-text-primary">{selectedCategory}</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-label-sm uppercase text-text-secondary">Tools</p>
            <h2 className="mt-2 text-headline-md font-semibold tracking-[-0.01em] text-text-primary">
              {selectedCategory === 'All Tools' ? 'All utilities' : selectedCategory}
            </h2>
            <p className="mt-2 text-body-md text-text-secondary">
              {searchQuery
                ? `Showing results for “${searchQuery}”.`
                : 'Every tool follows the same refined card, spacing, and typography system.'}
            </p>
          </div>
        </div>

        {visibleTools.length === 0 ? (
          <div className="app-panel p-8 text-center">
            <p className="text-headline-sm font-semibold text-text-primary">No tools match your current filters.</p>
            <p className="mt-2 text-body-md text-text-secondary">Try a broader search or switch back to All Tools.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
            {visibleTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className="group rounded-2xl border border-border bg-surface p-6 shadow-card transition hover:shadow-hover"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-50 text-primary">
                      <Icon size={22} />
                    </div>
                    <span className="tool-tag">{tool.category}</span>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-headline-sm font-semibold text-text-primary">{tool.name}</h3>
                    <p className="mt-3 text-body-md text-text-secondary">{tool.description}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-mono text-label-sm uppercase text-text-secondary">Open tool</span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-primary transition group-hover:bg-primary-50">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-gutter xl:grid-cols-3">
        {highlights.map((highlight) => {
          const Icon = highlight.icon;

          return (
            <div key={highlight.title} className="app-panel p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-50 text-primary">
                <Icon size={22} />
              </div>
              <h3 className="mt-5 text-headline-sm font-semibold text-text-primary">{highlight.title}</h3>
              <p className="mt-3 text-body-md text-text-secondary">{highlight.description}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
