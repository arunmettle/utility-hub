import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandMark from '../components/BrandMark';
import { featuredPersonaCollections, getPersonaCollectionTools } from '../data/collections';
import { tools } from '../data/tools';

const entryPaths = [
  {
    title: 'Start with your role',
    body: 'Use curated collections when you want the shortest path to useful tools for backend work, AI workflows, DevOps, SecOps, QA, Scrum ceremonies, and more.',
    cta: 'Browse collections',
    to: '/collections',
  },
  {
    title: 'Start with a guide',
    body: 'Use workflow guides when you want examples, context, and a calmer explanation of how a tool fits into real day-to-day work.',
    cta: 'Read guides',
    to: '/guides',
  },
  {
    title: 'Start with the catalog',
    body: 'Jump straight into the full tool catalog when you already know the job to be done and want the fastest path from messy input to clean output.',
    cta: 'View all tools',
    to: '/#all-tools',
  },
];

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

const roadmapItems = [
  {
    audience: 'Scrum Masters',
    title: 'Team facilitation and ceremony helpers',
    body: 'Spinner wheel, retro prompt generator, ceremony timer, and delivery-friendly summaries for Azure DevOps and other ALM workflows.',
  },
  {
    audience: 'Backend and API teams',
    title: 'Deeper API review workflows',
    body: 'More direct helpers for request replay, webhook triage, safer sharing, and API incident cleanup around payloads and auth artifacts.',
  },
  {
    audience: 'AI teams',
    title: 'Prompt and evaluation operations',
    body: 'More structured tools for prompt review, eval dataset prep, output inspection, and safety workflow support across practical AI delivery work.',
  },
  {
    audience: 'Operations and platform teams',
    title: 'Delivery visibility and config hygiene',
    body: 'Helpers that make CI, release, environment, and infrastructure artifacts easier to summarize and review without context switching.',
  },
];

const homepageFaqs = [
  {
    question: 'What is UtilityHub?',
    answer:
      'UtilityHub is a privacy-first collection of browser-based utilities for developers, reviewers, and platform teams. It focuses on quick local transformations, inspections, and workflow checks.',
  },
  {
    question: 'Does UtilityHub send my data to a server?',
    answer:
      'The tools are designed to work in the browser for normal usage. That means pasted snippets, request payloads, config files, response headers, and review text can stay local to the page.',
  },
  {
    question: 'Who is UtilityHub for?',
    answer:
      'It is useful for frontend and backend developers, DevOps and platform engineers, reviewers, QA engineers, and anyone who regularly needs small transformation tools during daily delivery work.',
  },
  {
    question: 'What kinds of tools are included in UtilityHub?',
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
            <h1>Privacy-first browser tools for real delivery work.</h1>
            <p>
              UtilityHub helps teams move from messy inputs to usable outputs faster. Format payloads, inspect tokens,
              compare text, shape data, review config, and support delivery workflows without depending on a pile of
              disconnected browser tools.
            </p>
          </div>
        </article>

        <aside className="hero-copy">
          <span className="hero-copy__eyebrow">Privacy-first browser tools</span>
          <h2>Start by role, start by guide, or jump straight into the tool you need.</h2>
          <p>
            UtilityHub is built for the raw material of software delivery: payloads, prompts, diffs, configs,
            spreadsheets, headers, workflow exports, and all the messy artifacts that slow teams down.
          </p>
          <p>
            The experience is intentionally lightweight and local-first so people can use it during coding, QA, reviews,
            facilitation, incident response, sprint work, and release preparation without unnecessary noise.
          </p>
        </aside>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Choose how to enter UtilityHub</h2>
          <p>The fastest path depends on whether you think in roles, workflows, or individual tasks.</p>
        </div>

        <div className="workflow-copy">
          {entryPaths.map((entry) => (
            <article key={entry.title} className="tool-note guide-cta-card">
              <h2>{entry.title}</h2>
              <p>{entry.body}</p>
              <Link to={entry.to} className="guide-inline-link">
                {entry.cta}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Browse by role</h2>
          <p>Jump straight into curated toolkits for the people doing the work, not just the file format in front of them.</p>
        </div>

        <div className="collection-grid">
          {featuredPersonaCollections.map((collection) => {
            const Icon = collection.icon;
            const collectionTools = getPersonaCollectionTools(collection);

            return (
              <Link key={collection.slug} to={collection.path} className="tool-card collection-card">
                <div className="tool-card__top">
                  <div className="tool-card__icon">
                    <Icon size={28} />
                  </div>
                  <span className="collection-card__count">{collectionTools.length} tools</span>
                </div>
                <h3>{collection.shortTitle}</h3>
                <p>{collection.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Why teams use it</h2>
          <p>UtilityHub is shaped around practical workflow friction rather than one-off marketing demos.</p>
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
          <h2>How UtilityHub fits into developer workflows</h2>
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
              UtilityHub also covers review-heavy workflows such as side-by-side text diffs, GitHub Actions checks,
              Docker and docker-compose inspection, cron schedule explanation, OpenAPI summarization, header inspection,
              semantic version guidance, and JSON schema bootstrapping.
            </p>
          </article>
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Coming next</h2>
          <p>These are the workflow gaps to close next based on audience fit, feedback direction, and where the current catalog still feels incomplete.</p>
        </div>

        <div className="insight-grid">
          {roadmapItems.map((item) => (
            <article key={item.title} className="insight-card">
              <div className="insight-card__head">
                <strong className="insight-card__title">{item.title}</strong>
              </div>
              <p className="insight-card__body">
                <strong>{item.audience}:</strong> {item.body}
              </p>
            </article>
          ))}
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
