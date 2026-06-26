import { useMemo, useState } from 'react';
import { ArrowRight, BookOpenText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toolGuides, getToolById } from '../content/toolGuides';
import { categories, type ToolCategory } from '../data/tools';

type GuideTopic = ToolCategory | 'All guides';

export default function GuidesIndex() {
  const guideTopics = categories.filter((category) => category !== 'All tools');
  const [selectedTopic, setSelectedTopic] = useState<GuideTopic>('All guides');
  const visibleGuides = useMemo(
    () =>
      selectedTopic === 'All guides'
        ? toolGuides
        : toolGuides.filter((guide) => getToolById(guide.toolId)?.category === selectedTopic),
    [selectedTopic],
  );

  return (
    <div className="docs-shell">
      <aside className="docs-sidebar" aria-label="Guide filters">
        <div className="docs-sidebar__section" data-testid="guide-topic-filter">
          <p className="docs-sidebar__label">Browse by topic</p>
          <div className="docs-sidebar__list">
            <button
              type="button"
              className={`docs-sidebar__item${selectedTopic === 'All guides' ? ' is-active' : ''}`}
              onClick={() => setSelectedTopic('All guides')}
              aria-pressed={selectedTopic === 'All guides'}
              data-testid="guide-topic-all"
            >
              All guides
            </button>
            {guideTopics.map((topic) => (
              <button
                key={topic}
                type="button"
                className={`docs-sidebar__item${selectedTopic === topic ? ' is-active' : ''}`}
                onClick={() => setSelectedTopic(topic)}
                aria-pressed={selectedTopic === topic}
                data-testid={`guide-topic-${topic.toLowerCase()}`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="docs-main">
        <section className="docs-article">
          <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Help center</Link>
            <span>/</span>
            <span>Guides</span>
          </nav>

          <div className="docs-article__head">
            <div className="docs-article__icon">
              <BookOpenText size={18} />
            </div>
            <div>
              <h1>Guides</h1>
              <p>
                Step-by-step guides that help people move from quick tool usage into repeatable engineering, review, and
                AI workflows.
              </p>
            </div>
          </div>

          <div className="docs-guide-grid">
            {visibleGuides.map((guide) => {
              const tool = getToolById(guide.toolId);
              const Icon = tool?.icon ?? BookOpenText;

              return (
                <Link key={guide.slug} to={`/guides/${guide.slug}`} className="docs-guide-card">
                  <div className="docs-guide-card__icon">
                    <Icon size={18} />
                  </div>
                  <div className="docs-guide-card__body">
                    <h2>{guide.title}</h2>
                    <p>{guide.summary}</p>
                    <span className="guide-inline-link">
                      Read guide <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
