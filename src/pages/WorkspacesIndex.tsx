import { Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';
import { workspaces } from '../data/industryWorkspaces';

export default function WorkspacesIndex() {
  return (
    <div className="catalog-page">
      <section className="hero-band hero-band--collections">
        <article className="feature-card collection-hero-card">
          <div className="feature-card__icon">
            <Boxes size={30} />
          </div>
          <div>
            <h1>Workspaces for the industries and teams using UtilityHub.</h1>
            <p>
              Start from a workspace when you want the sidebar, search, and tool list to stay aligned with one domain
              instead of showing the whole platform at once.
            </p>
          </div>
        </article>

        <aside className="hero-copy">
          <span className="hero-copy__eyebrow">Workspace-based navigation</span>
          <h2>Choose the shell that matches your context before you choose the individual tool.</h2>
          <p>
            Technology, mechanical, and civil now each have their own workspace flow so people can search and browse
            within the context that actually matches their day-to-day work.
          </p>
        </aside>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Available workspaces</h2>
          <p>{workspaces.length} published workspaces are currently live across UtilityHub.</p>
        </div>

        <div className="collection-grid">
          {workspaces.map((workspace) => {
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
    </div>
  );
}
