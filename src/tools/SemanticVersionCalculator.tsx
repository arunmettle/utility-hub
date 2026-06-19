import { useMemo, useState } from 'react';
import { Boxes, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { calculateSemanticVersion } from '../lib/privacyTools';

const sampleNotes = 'Add a new export endpoint for team usage reports without breaking existing clients.';

export default function SemanticVersionCalculator() {
  const [version, setVersion] = useState('2.4.1');
  const [notes, setNotes] = useState(sampleNotes);
  const result = useMemo(() => calculateSemanticVersion(version, notes), [notes, version]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Semantic Version Calculator"
      description="Estimate the right patch, minor, or major version bump from release notes before you tag or publish a package."
      actions={
        <button
          type="button"
          className="action-button"
          onClick={() => {
            setVersion('2.4.1');
            setNotes(sampleNotes);
          }}
        >
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Recommendation logic',
        body: 'The recommendation is heuristic-based. It looks for feature and breaking-change language so teams can get a fast gut check before a real release review.',
      }}
    >
      <div className="editor-grid">
        <section className="stack-grid">
          <section className="editor-panel">
            <div className="editor-panel__head">
              <span>Current version</span>
              <span>major.minor.patch</span>
            </div>
            <input id="current-version" className="tool-input" value={version} onChange={(event) => setVersion(event.target.value)} />
          </section>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span>Release notes</span>
              <span>What changed</span>
            </div>
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="editor-textarea editor-textarea--compact" />
          </section>
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Version issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Recommended</span>
                  <strong>{result.output.recommendedVersion}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Patch</span>
                  <strong>{result.output.patch}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Minor</span>
                  <strong>{result.output.minor}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Major</span>
                  <strong>{result.output.major}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <Boxes size={16} />
                    Recommendation
                  </span>
                  <span>{result.output.recommendedLevel} bump</span>
                </div>
                <div className="insight-list">
                  <article className="insight-row">
                    <strong>{result.output.rationale}</strong>
                    <p>{result.output.signals.join(' ')}</p>
                  </article>
                </div>
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
