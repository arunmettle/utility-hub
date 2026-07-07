import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getIndustryWorkspaceTools,
  mechanicalWorkspace,
  mechanicalWorkspaceHighlights,
} from '../data/industryWorkspaces';

const workspaceTools = getIndustryWorkspaceTools(mechanicalWorkspace);
const WorkspaceIcon = mechanicalWorkspace.icon;

export default function MechanicalWorkspacePage() {
  return (
    <div className="catalog-page mechanical-workspace-page">
      <section className="hero-band hero-band--collections">
        <article className="feature-card collection-hero-card">
          <div className="feature-card__icon">
            <WorkspaceIcon size={30} />
          </div>
          <div>
            <h1>Mechanical tools, without the generic catalog noise.</h1>
            <p>
              This workspace groups only the tools that clearly support mechanical design review, tolerance work,
              release comparison, and recurring calculation lookup.
            </p>
          </div>
        </article>

        <aside className="hero-copy">
          <h2>Built for the sequence mechanical engineers actually follow.</h2>
          <p>
            Start with dimensional checks, move into release review, then finish with recurring calculations and
            formula lookup. The goal is faster decisions, not more browsing.
          </p>
          <p>
            Every tool here runs browser-side and stays intentionally mechanical-only, so the workspace feels focused
            instead of intimidating.
          </p>
          <div className="guide-hero-actions">
            <Link className="cta-button" to={mechanicalWorkspace.collectionPath}>
              Read the collection guide
            </Link>
            <Link className="guide-inline-link" to="/collections">
              Browse all collections <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Start with the highest-confidence tools</h2>
          <p>These are the mechanical tools that already map cleanly to daily engineering work and repeated friction.</p>
        </div>

        <div className="collection-grid">
          {workspaceTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} to={tool.workspacePath} className="tool-card collection-card">
                <div className="tool-card__top">
                  <div className="tool-card__icon">
                    <Icon size={28} />
                  </div>
                  <span className="collection-card__count">{tool.category}</span>
                </div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="catalog-section" id="mechanical-tool-groups">
        <div className="section-heading">
          <h2>Organized by workflow</h2>
          <p>Mechanical users should be able to spot their next step immediately instead of translating generic categories.</p>
        </div>

        <div className="mechanical-workspace-grid">
          {mechanicalWorkspace.sections.map((section) => (
            <article key={section.id} className="mechanical-workspace-card">
              <div className="mechanical-workspace-card__body">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
                <div className="mechanical-workspace-links">
                  {section.toolIds.flatMap((toolId) => {
                    const tool = workspaceTools.find((entry) => entry.id === toolId);
                    return tool ? (
                      <Link key={tool.id} to={tool.workspacePath} className="mechanical-workspace-link">
                        {tool.name}
                      </Link>
                    ) : (
                      []
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Why this workspace structure works</h2>
          <p>The shell, search, and grouping all follow the same mechanical-only logic.</p>
        </div>

        <div className="docs-note-grid">
          {mechanicalWorkspaceHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="docs-note-card">
                <h3>
                  <span className="mechanical-workspace-note__icon">
                    <Icon size={16} />
                  </span>
                  {item.title}
                </h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
