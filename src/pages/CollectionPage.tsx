import { ArrowRight, BookOpenText, Lightbulb, MessageSquarePlus } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getCollectionGuideBySlug } from '../content/collectionGuides';
import { getPersonaCollectionBySlug, getPersonaCollectionTools } from '../data/collections';

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const collection = slug ? getPersonaCollectionBySlug(slug) : undefined;

  if (!collection) {
    return <Navigate to="/collections" replace />;
  }

  const collectionTools = getPersonaCollectionTools(collection);
  const guide = getCollectionGuideBySlug(collection.slug);
  const contentLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'use-cases', label: 'When it helps' },
    { id: 'how-tools-help', label: 'How the tools help' },
    { id: 'pain-points', label: 'Why this exists' },
    { id: 'tool-list', label: 'Tools in this collection' },
  ];

  return (
    <div className="docs-shell docs-shell--editorial">
      <aside className="docs-sidebar">
        <div className="docs-sidebar__section">
          <p className="docs-sidebar__label">On this page</p>
          <div className="docs-sidebar__list">
            {contentLinks.map((entry) => (
              <a key={entry.id} href={`#${entry.id}`} className="docs-sidebar__item docs-sidebar__item--link">
                {entry.label}
              </a>
            ))}
          </div>
        </div>
      </aside>

      <div className="docs-main">
        <article className="docs-article">
          <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Help center</Link>
            <span>/</span>
            <Link to="/collections">Collections</Link>
            <span>/</span>
            <span>{collection.title}</span>
          </nav>

          <header className="docs-article__head" id="overview">
            <div className="docs-article__eyebrow">
              <span className="docs-article__type">Collection</span>
              <span className="docs-article__topic">{collection.audience}</span>
            </div>
            <div>
              <h1>{collection.title}</h1>
              <p>{guide?.summary ?? collection.description}</p>
            </div>
          </header>

          <div className="docs-meta">
            <span className="docs-meta__author">UtilityHub editorial</span>
            <span>{collectionTools.length} mapped tools</span>
            <span>Role-based workflow guide</span>
          </div>

          {guide ? (
            <>
              <section className="docs-article__intro">
                <p>{guide.intro}</p>
              </section>

              <section className="docs-section" id="use-cases">
                <h2>Use this collection when</h2>
                <p className="docs-section__intro">These are the moments where this toolkit saves the most time for this role.</p>
                <div className="docs-plain-list">
                  {guide.useCases.map((item) => (
                    <article key={item} className="docs-plain-item">
                      <p>{item}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="docs-section" id="how-tools-help">
                <h2>How the tools help</h2>
                <p className="docs-section__intro">The tools work best as a small workflow, not as isolated one-off utilities.</p>
                <div className="collection-guide-list">
                  {guide.sections.map((section) => (
                    <article key={section.title} className="collection-guide-item">
                      <h3>{section.title}</h3>
                      <p>{section.body}</p>
                      <div className="chip-list">
                        {section.toolIds.flatMap((toolId) => {
                          const tool = collectionTools.find((entry) => entry.id === toolId);
                          return tool ? (
                            <Link key={tool.id} to={tool.path} className="chip chip--link">
                              {tool.name}
                            </Link>
                          ) : (
                            []
                          );
                        })}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="docs-section" id="pain-points">
                <h2>Why this toolkit exists</h2>
                <div className="docs-plain-list">
                  {collection.painPoints.map((point) => (
                    <article key={point} className="docs-plain-item">
                      <p>{point}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="docs-section">
                <h2>Bottom line</h2>
                <div className="docs-prose-minimal">
                  <p>{guide.closing}</p>
                </div>
              </section>
            </>
          ) : null}

          <section className="docs-section" id="tool-list">
            <h2>Tools in this collection</h2>
            <p className="docs-section__intro">Open any linked tool directly from this article and keep moving through the workflow.</p>
            <div className="docs-link-list">
              {collectionTools.map((tool) => {
                const ToolIcon = tool.icon;
                return (
                  <Link key={tool.id} to={tool.path} className="docs-link-item">
                    <div className="docs-link-item__icon">
                      <ToolIcon size={18} />
                    </div>
                    <div className="docs-link-item__body">
                      <h2>{tool.name}</h2>
                      <p>{tool.description}</p>
                      <span className="guide-inline-link">
                        Open tool <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </article>

        <aside className="docs-rail">
          <section className="docs-side-note">
            <div className="docs-side-note__head">
              <BookOpenText size={16} />
              <span>Collections</span>
            </div>
            <h2>Browse every curated category</h2>
            <p>Move between collections to see how UtilityHub is packaged for delivery, QA, security, AI, product, and data work.</p>
            <Link to="/collections" className="guide-inline-link">
              View all collections <ArrowRight size={16} />
            </Link>
          </section>

          <section className="docs-side-note">
            <div className="docs-side-note__head">
              <MessageSquarePlus size={16} />
              <span>Feedback</span>
            </div>
            <h2>Tell us what is missing</h2>
            <p>If this collection helps only partly, send feedback so we can understand the missing step in the workflow.</p>
            <Link to="/feedback" className="guide-inline-link">
              Leave feedback <ArrowRight size={16} />
            </Link>
          </section>

          <section className="docs-side-note">
            <div className="docs-side-note__head">
              <Lightbulb size={16} />
              <span>Wishlist</span>
            </div>
            <h2>Request the next tool</h2>
            <p>Add the missing utility or workflow to the wishlist so the roadmap reflects what professionals actually need.</p>
            <Link to="/wishlist" className="guide-inline-link">
              Open wishlist <ArrowRight size={16} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
