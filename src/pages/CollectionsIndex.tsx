import { BriefcaseBusiness } from 'lucide-react';
import { Link } from 'react-router-dom';
import { featuredPersonaCollections, getPersonaCollectionTools, personaCollections } from '../data/collections';

export default function CollectionsIndex() {
  return (
    <div className="catalog-page">
      <section className="hero-band hero-band--collections">
        <article className="feature-card collection-hero-card">
          <div className="feature-card__icon">
            <BriefcaseBusiness size={30} />
          </div>
          <div>
            <h1>Curated toolkits for the roles that keep delivery moving.</h1>
            <p>
              UtilityHub now groups browser-local workflows by persona so teams can start from the problems they solve
              every day instead of searching a flat catalog first.
            </p>
          </div>
        </article>

        <aside className="hero-copy">
          <span className="hero-copy__eyebrow">Role-based collections</span>
          <h2>Choose a published collection guide built around recurring day-to-day friction.</h2>
          <p>
            Each collection includes at least 10 tools mapped to practical pain points for that role, from payload
            cleanup and security review to AI prompt evaluation and fixture generation.
          </p>
          <p>
            Every curated category now has live guide content behind it, so people can start with a role-based use
            case and then open the exact tools that support that workflow.
          </p>
        </aside>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <h2>Featured collections</h2>
          <p>Start with the high-signal role groupings that best match the current UtilityHub catalog depth.</p>
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
          <h2>All curated categories</h2>
          <p>{personaCollections.length} role-based collections now include published guide content across UtilityHub.</p>
        </div>

        <div className="collection-grid">
          {personaCollections.map((collection) => {
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
    </div>
  );
}
