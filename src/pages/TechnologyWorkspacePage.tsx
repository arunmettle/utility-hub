import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getIndustryWorkspaceTools,
  technologyWorkspace,
  technologyWorkspaceHighlights,
  workspaces,
} from '../data/industryWorkspaces';

const workspaceTools = getIndustryWorkspaceTools(technologyWorkspace);
const WorkspaceIcon = technologyWorkspace.icon;

export default function TechnologyWorkspacePage() {
  return (
    <div className="catalog-page technology-workspace-page">
      <section className="hero-band hero-band--collections">
        <article className="feature-card collection-hero-card">
          <div className="feature-card__icon">
            <WorkspaceIcon size={30} />
          </div>
          <div>
            <h1>Technology tools, organized like a real workspace.</h1>
            <p>
              This workspace keeps delivery, review, formatting, validation, API, and data-shaping tools together so
              technical teams can start from the work they are doing instead of a flat catalog.
            </p>
          </div>
        </article>

        <aside className="hero-copy">
          <h2>Built for software delivery flow, not just one-off utility lookups.</h2>
          <p>
            Search stays scoped to the technology workspace, the sidebar stays technology-specific, and related tools
            remain grouped in the same place while you move from cleanup to inspection to output.
          </p>
          <p>
            When the workflow changes, jump into a different workspace instead of dragging unrelated tools into the same
            navigation shell.
          </p>
          <div className="guide-hero-actions">
            <Link className="cta-button" to="/workspaces">
              Browse all workspaces
            </Link>
            <Link className="guide-inline-link" to="/workspaces">
              Switch workspace context <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Other published workspaces</h2>
          <p>Use a dedicated workspace when the problem shifts from technology delivery into industry-specific work.</p>
        </div>

        <div className="collection-grid">
          {workspaces
            .filter((workspace) => workspace.slug !== technologyWorkspace.slug)
            .map((workspace) => {
              const Icon = workspace.icon;
              return (
                <Link key={workspace.slug} to={workspace.path} className="tool-card collection-card">
                  <div className="tool-card__top">
                    <div className="tool-card__icon">
                      <Icon size={28} />
                    </div>
                    <span className="collection-card__count">{workspace.toolIds.length} tools</span>
                  </div>
                  <h3>{workspace.shortTitle}</h3>
                  <p>{workspace.description}</p>
                </Link>
              );
            })}
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Start with the highest-confidence tools</h2>
          <p>These are the technology tools that map cleanly to recurring delivery work and repeated team friction.</p>
        </div>

        <div className="collection-grid">
          {workspaceTools.slice(0, 12).map((tool) => {
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

      <section className="catalog-section" id="technology-tool-groups">
        <div className="section-heading">
          <h2>Organized by workflow cluster</h2>
          <p>Technology users should land in the right group quickly instead of translating from a giant undifferentiated list.</p>
        </div>

        <div className="mechanical-workspace-grid">
          {technologyWorkspace.sections.map((section) => (
            <article key={section.id} className="mechanical-workspace-card">
              <div className="mechanical-workspace-card__body">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
                <div className="mechanical-workspace-links">
                  {section.toolIds.slice(0, 8).flatMap((toolId) => {
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
          <h2>Why this workspace model works</h2>
          <p>The shell, search, and grouping all follow the same technology-specific logic.</p>
        </div>

        <div className="docs-note-grid">
          {technologyWorkspaceHighlights.map((item) => {
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
