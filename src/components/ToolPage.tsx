import type { LucideIcon } from 'lucide-react';

interface ToolPageProps {
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function ToolPage({
  title,
  description,
  category,
  icon: Icon,
  actions,
  children,
}: ToolPageProps) {
  return (
    <div className="page-shell">
      <section className="app-panel p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary">
              <Icon size={22} />
            </div>
            <div className="space-y-3">
              <span className="tool-tag">{category}</span>
              <div>
                <h1 className="text-headline-lg font-bold tracking-[-0.02em] text-text-primary">{title}</h1>
                <p className="mt-2 max-w-3xl text-body-lg text-text-secondary">{description}</p>
              </div>
            </div>
          </div>

          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </section>

      {children}
    </div>
  );
}
