import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandMark from '../components/BrandMark';
import { tools } from '../data/tools';

const highlightPoints = [
  {
    title: 'Browser-local by default',
    body: 'Most workflows are designed so pasted payloads, tokens, headers, diffs, and snippets stay on the page instead of bouncing through a backend.',
  },
  {
    title: 'Built for everyday engineering',
    body: 'Format JSON, inspect JWTs, compare text, review Docker and workflow config, generate IDs, and transform request data without leaving the browser.',
  },
  {
    title: 'Useful for people and machines',
    body: 'Routes, metadata, sitemap entries, `llms.txt`, and the tool catalog are aligned so crawlers and assistants can identify what each page is for.',
  },
];

const homepageFaqs = [
  {
    question: 'What is Cobalt?',
    answer:
      'Cobalt is a privacy-first collection of browser-based utilities for developers, reviewers, and platform teams. It focuses on quick local transformations, inspections, and workflow checks.',
  },
  {
    question: 'Does Cobalt send my data to a server?',
    answer:
      'The tools are designed to work in the browser for normal usage. That means pasted snippets, request payloads, config files, response headers, and review text can stay local to the page.',
  },
  {
    question: 'Who is Cobalt for?',
    answer:
      'It is useful for frontend and backend developers, DevOps and platform engineers, reviewers, QA engineers, and anyone who regularly needs small transformation tools during daily delivery work.',
  },
  {
    question: 'What kinds of tools are included in Cobalt?',
    answer:
      'The current catalog covers formatters, encoders, converters, generators, security tools, testers, and a growing set of developer workflow utilities such as OpenAPI summaries, Docker audits, cron explainers, and schema generation.',
  },
];

export default function Home() {
  return (
    <div className="catalog-page">
      <section className="hero-band">
        <article className="feature-card">
          <div className="feature-card__icon">
            <BrandMark size={34} />
          </div>
          <div>
            <h1>Privacy-first browser tools for daily engineering work.</h1>
            <p>
              Cobalt keeps repetitive transformations calm, quick, and local. Start with a formatter for structured
              payloads, inspect secure tokens, compare text, shape data, and transform encoded content without server
              round-trips.
            </p>
          </div>
        </article>

        <aside className="hero-copy">
          <span className="hero-copy__eyebrow">Browser-based developer utility suite</span>
          <h2>Built for payloads, diffs, configs, and delivery workflows that should stay readable.</h2>
          <p>
            Cobalt helps teams move through everyday engineering chores faster: formatting JSON, decoding Base64,
            checking regexes, comparing text, reviewing headers, tightening Docker config, and exploring API specs.
          </p>
          <p>
            The experience is intentionally lightweight and privacy-aware so developers can use it as a practical companion
            during coding, QA, documentation, pull request review, and release preparation.
          </p>
        </aside>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Why teams use it</h2>
          <p>Cobalt is shaped around local-first utility work rather than one-off marketing demos.</p>
        </div>

        <div className="insight-grid">
          {highlightPoints.map((point) => (
            <article key={point.title} className="insight-card">
              <div className="insight-card__head">
                <strong className="insight-card__title">{point.title}</strong>
              </div>
              <p className="insight-card__body">{point.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="all-tools" className="catalog-section">
        <div className="section-heading">
          <h2>All tools</h2>
          <p>{tools.length} privacy-first workflows, designed around quick local transformations instead of server round-trips.</p>
        </div>

        <div className="tool-grid">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} to={tool.path} className="tool-card">
                <div className="tool-card__top">
                  <div className="tool-card__icon">
                    <Icon size={28} />
                  </div>
                  <Heart size={18} className="tool-card__favorite" />
                </div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>How Cobalt fits into developer workflows</h2>
          <p>Use it as a browser-side scratchpad for transforming or reviewing working material before it lands in code, docs, or delivery systems.</p>
        </div>

        <div className="workflow-copy">
          <article className="tool-note">
            <h2>Local transformation tools</h2>
            <p>
              These are the quick-turn utilities you reach for while building or reviewing: JSON formatting, Base64
              conversion, query-string inspection, HTML entity conversion, UUID and ULID generation, hash creation, and
              markdown table building.
            </p>
          </article>
          <article className="tool-note">
            <h2>Review and platform tools</h2>
            <p>
              Cobalt also covers review-heavy workflows such as side-by-side text diffs, GitHub Actions checks,
              Docker and docker-compose inspection, cron schedule explanation, OpenAPI summarization, header inspection,
              semantic version guidance, and JSON schema bootstrapping.
            </p>
          </article>
        </div>
      </section>

      <section id="faq" className="catalog-section">
        <div className="section-heading">
          <h2>Frequently asked questions</h2>
          <p>Clear answers for search engines, LLMs, and people evaluating whether this utility app matches their workflow.</p>
        </div>

        <div className="faq-grid">
          {homepageFaqs.map((item) => (
            <article key={item.question} className="tool-note faq-card">
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
