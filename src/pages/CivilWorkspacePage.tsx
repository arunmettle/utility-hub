import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  civilWorkspace,
  civilWorkspaceHighlights,
  getIndustryWorkspaceTools,
} from '../data/industryWorkspaces';

const workspaceTools = getIndustryWorkspaceTools(civilWorkspace);
const WorkspaceIcon = civilWorkspace.icon;

export default function CivilWorkspacePage() {
  return (
    <div className="catalog-page civil-workspace-page">
      <section className="hero-band hero-band--collections">
        <article className="feature-card collection-hero-card">
          <div className="feature-card__icon">
            <WorkspaceIcon size={30} />
          </div>
          <div>
            <h1>Civil tools, without the generic catalog noise.</h1>
            <p>
              This workspace groups only the tools that clearly support drawing review, quantity comparison,
              hydraulic checks, embodied-carbon takeoff, and recurring formula lookup.
            </p>
          </div>
        </article>

        <aside className="hero-copy">
          <h2>Built for the sequence civil engineers actually follow.</h2>
          <p>
            Start with revision and quantity checks, move into hydraulic sanity checks, then finish with takeoff and
            formula lookup. The goal is faster decisions with less spreadsheet hopping.
          </p>
          <p>
            Every tool here runs browser-side and stays intentionally civil-only, so the workspace feels focused
            instead of cluttered.
          </p>
          <div className="guide-hero-actions">
            <Link className="cta-button" to={civilWorkspace.collectionPath ?? '/collections'}>
              Read the collection guide
            </Link>
            <Link className="guide-inline-link" to="/workspaces">
              Browse all workspaces <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Start with the highest-confidence tools</h2>
          <p>These are the civil tools that already map cleanly to daily engineering work and repeated friction.</p>
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

      <section className="catalog-section" id="civil-tool-groups">
        <div className="section-heading">
          <h2>Organized by workflow</h2>
          <p>Civil users should see their next step immediately instead of translating generic categories.</p>
        </div>

        <div className="mechanical-workspace-grid">
          {civilWorkspace.sections.map((section) => (
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
          <p>The shell, search, and grouping all follow the same civil-only logic.</p>
        </div>

        <div className="docs-note-grid">
          {civilWorkspaceHighlights.map((item) => {
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
