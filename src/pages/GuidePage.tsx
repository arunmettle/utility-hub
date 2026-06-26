import { ArrowRight, Lightbulb, MessageSquarePlus, Sparkles } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getRelatedTools, getToolById, guideBySlug } from '../content/toolGuides';

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/guides" replace />;
  }

  const guide = guideBySlug.get(slug);

  if (!guide) {
    return <Navigate to="/guides" replace />;
  }

  const tool = getToolById(guide.toolId);
  const relatedTools = getRelatedTools(guide);
  const contentLinks = [
    { id: 'when-to-use', label: 'When to use it' },
    { id: 'walkthrough', label: 'Step-by-step walkthrough' },
    { id: 'privacy', label: 'Privacy note' },
    { id: 'faq', label: 'FAQ' },
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
            <Link to="/guides">Guides</Link>
            <span>/</span>
            <span>{tool?.name ?? guide.title}</span>
          </nav>

          <header className="docs-article__head">
            <div className="docs-article__eyebrow">
              <span className="docs-article__type">Guide</span>
              {tool ? <span className="docs-article__topic">{tool.category}</span> : null}
            </div>
            <div>
              <h1>{guide.title}</h1>
              <p>{guide.summary}</p>
            </div>
          </header>

          <div className="docs-meta">
            <span className="docs-meta__author">UtilityHub editorial</span>
            <span>Practical workflow guide</span>
            <span>Browser-local by default</span>
          </div>

          <section className="docs-article__intro">
            <p>{guide.intro}</p>
          </section>

          <section id="when-to-use" className="docs-section">
            <h2>When to use it</h2>
            <p className="docs-section__intro">These are the moments where this tool is most useful in real work.</p>
            <div className="docs-plain-list">
              {guide.whenToUse.map((item) => (
                <article key={item} className="docs-plain-item">
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="walkthrough" className="docs-section">
            <h2>Step-by-step walkthrough</h2>
            <p className="docs-section__intro">Use the live tool beside this guide and work through the steps with a real example.</p>
            <div className="docs-step-list">
              {guide.steps.map((step, index) => (
                <article key={step.title} className="docs-step-item">
                  <div className="docs-step__number">{index + 1}</div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="privacy" className="docs-section">
            <h2>Privacy note</h2>
            <div className="docs-prose-minimal">
              <p>{guide.privacyNote}</p>
            </div>
          </section>

          <section id="faq" className="docs-section">
            <h2>FAQ</h2>
            <div className="docs-faq-simple">
              {guide.faqs.map((item) => (
                <article key={item.question} className="docs-faq-simple__item">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          {relatedTools.length > 0 ? (
            <section className="docs-section">
              <h2>Related tools</h2>
              <div className="docs-link-list">
                {relatedTools.map((entry) => {
                  const RelatedIcon = entry.icon;
                  return (
                    <Link key={entry.id} to={entry.path} className="docs-link-item">
                      <div className="docs-link-item__icon">
                        <RelatedIcon size={18} />
                      </div>
                      <div className="docs-link-item__body">
                        <h2>{entry.name}</h2>
                        <p>{entry.description}</p>
                        <span className="guide-inline-link">
                          Open tool <ArrowRight size={16} />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </article>

        <aside className="docs-rail">
          {tool ? (
            <section className="docs-side-note">
              <div className="docs-side-note__head">
                <Sparkles size={16} />
                <span>Use the tool</span>
              </div>
              <h2>Try {tool.name}</h2>
              <p>Open the live tool and use this guide side by side while you work through a real example.</p>
              <Link to={tool.path} className="guide-inline-link">
                Open tool <ArrowRight size={16} />
              </Link>
            </section>
          ) : null}

          <section className="docs-side-note">
            <div className="docs-side-note__head">
              <MessageSquarePlus size={16} />
              <span>Feedback</span>
            </div>
            <h2>Tell us what is missing</h2>
            <p>If the tool helped only partly, use the feedback form so we can understand the missing step or edge case.</p>
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
            <p>If this guide solves only half the workflow, add the missing piece to the wishlist so we can prioritize it.</p>
            <Link to="/wishlist" className="guide-inline-link">
              Open wishlist <ArrowRight size={16} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
