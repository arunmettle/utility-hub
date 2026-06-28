import { ArrowRight, FileText, Info, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrustPageSection {
  id: string;
  title: string;
  body: string[];
}

export default function TrustPage({
  kind,
  title,
  summary,
  sections,
}: {
  kind: 'About' | 'Privacy' | 'Terms';
  title: string;
  summary: string;
  sections: TrustPageSection[];
}) {
  return (
    <div className="docs-shell docs-shell--editorial">
      <aside className="docs-sidebar">
        <div className="docs-sidebar__section">
          <p className="docs-sidebar__label">On this page</p>
          <div className="docs-sidebar__list">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="docs-sidebar__item docs-sidebar__item--link">
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </aside>

      <div className="docs-main">
        <article className="docs-article">
          <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{title}</span>
          </nav>

          <header className="docs-article__head">
            <div className="docs-article__eyebrow">
              <span className="docs-article__type">{kind}</span>
              <span className="docs-article__topic">UtilityHub</span>
            </div>
            <div>
              <h1>{title}</h1>
              <p>{summary}</p>
            </div>
          </header>

          <div className="docs-meta">
            <span className="docs-meta__author">UtilityHub</span>
            <span>Privacy-first browser tools</span>
            <span>Updated June 2026</span>
          </div>

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="docs-section">
              <h2>{section.title}</h2>
              <div className="docs-plain-list">
                {section.body.map((paragraph) => (
                  <article key={paragraph} className="docs-plain-item">
                    <p>{paragraph}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </article>

        <aside className="docs-rail">
          <section className="docs-side-note">
            <div className="docs-side-note__head">
              <Info size={16} />
              <span>About</span>
            </div>
            <h2>What UtilityHub is</h2>
            <p>Browser-based utilities designed to keep copied payloads, snippets, and workflow data on the page whenever possible.</p>
            <Link to="/about" className="guide-inline-link">
              Read about us <ArrowRight size={16} />
            </Link>
          </section>

          <section className="docs-side-note">
            <div className="docs-side-note__head">
              <ShieldCheck size={16} />
              <span>Privacy</span>
            </div>
            <h2>How data is handled</h2>
            <p>Most tools are designed for local, browser-side use. Check the privacy page for the current product-level explanation.</p>
            <Link to="/privacy" className="guide-inline-link">
              View privacy page <ArrowRight size={16} />
            </Link>
          </section>

          <section className="docs-side-note">
            <div className="docs-side-note__head">
              <FileText size={16} />
              <span>Terms</span>
            </div>
            <h2>Use and access</h2>
            <p>If you need the basic usage rules and limitations for the website, the terms page covers them in a simple format.</p>
            <Link to="/terms" className="guide-inline-link">
              Read terms <ArrowRight size={16} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
