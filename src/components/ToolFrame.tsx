import { ArrowRight, BookOpenText, Lightbulb, MessageSquarePlus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AdSlot from './AdSlot';
import { getGuideForToolPath, getRelatedTools } from '../content/toolGuides';

export default function ToolFrame({
  eyebrow,
  title,
  description,
  actions,
  children,
  note,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  note?: { title: string; body: string };
}) {
  const location = useLocation();
  const guide = getGuideForToolPath(location.pathname);
  const relatedTools = guide ? getRelatedTools(guide).slice(0, 3) : [];

  return (
    <div className="tool-page">
      <div className="tool-page__header">
        <div>
          <p className="tool-page__eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="tool-page__description">{description}</p>
        </div>
        {actions ? <div className="tool-actions">{actions}</div> : null}
      </div>

      <AdSlot placement="banner" pageLabel={title} />

      {children}

      {note ? (
        <section className="tool-note">
          <h2>{note.title}</h2>
          <p>{note.body}</p>
        </section>
      ) : null}

      {guide ? (
        <section className="tool-promo-grid">
          <article className="tool-note guide-cta-card">
            <div className="guide-cta-card__icon">
              <BookOpenText size={18} />
            </div>
            <h2>Learn how to use this tool</h2>
            <p>{guide.summary}</p>
            <Link to={`/guides/${guide.slug}`} className="guide-inline-link">
              Read the guide <ArrowRight size={16} />
            </Link>
          </article>

          <article className="tool-note guide-cta-card">
            <div className="guide-cta-card__icon">
              <MessageSquarePlus size={18} />
            </div>
            <h2>Tell us what is missing</h2>
            <p>If this flow helped only partly, leave feedback so we can understand the missing step or edge case.</p>
            <Link to="/feedback" className="guide-inline-link">
              Leave feedback <ArrowRight size={16} />
            </Link>
          </article>

          <article className="tool-note guide-cta-card">
            <div className="guide-cta-card__icon">
              <Lightbulb size={18} />
            </div>
            <h2>Request the next tool</h2>
            <p>Use the wishlist to suggest the next utility, workflow, or improvement that would complete this job to be done.</p>
            <Link to="/wishlist" className="guide-inline-link">
              Open wishlist <ArrowRight size={16} />
            </Link>
          </article>
        </section>
      ) : null}

      {relatedTools.length > 0 ? (
        <section className="catalog-section">
          <div className="section-heading">
            <h2>Related tools</h2>
            <p>These tools often appear right before or right after this workflow.</p>
          </div>
          <div className="tool-promo-grid">
            {relatedTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} to={tool.path} className="tool-note tool-note--link">
                  <div className="guide-cta-card__icon">
                    <Icon size={18} />
                  </div>
                  <h2>{tool.name}</h2>
                  <p>{tool.description}</p>
                  <span className="guide-inline-link">
                    Open tool <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <AdSlot placement="floating" pageLabel={title} />
    </div>
  );
}
