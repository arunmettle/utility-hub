import { useMemo, useState } from 'react';
import { GitCompareArrows, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { detectBreakingChanges } from '../lib/privacyTools';

const previousSample = `{
  "id": 12,
  "name": "UtilityHub",
  "settings": {
    "theme": "light",
    "beta": false
  }
}`;

const nextSample = `{
  "id": "12",
  "settings": {
    "theme": "dark"
  },
  "workspace": "engineering"
}`;

export default function BreakingChangeDetector() {
  const [previousValue, setPreviousValue] = useState(previousSample);
  const [nextValue, setNextValue] = useState(nextSample);
  const result = useMemo(() => detectBreakingChanges(previousValue, nextValue), [nextValue, previousValue]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Breaking Change Detector"
      description="Compare two JSON shapes and surface removals or type shifts that could break consumers, contracts, or fixtures."
      actions={
        <button
          type="button"
          className="action-button"
          onClick={() => {
            setPreviousValue(previousSample);
            setNextValue(nextSample);
          }}
        >
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Contract review',
        body: 'This is meant for quick compatibility reviews of payload samples, configuration objects, or API responses. Added fields are listed separately from actual break risks.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Previous shape</span>
            <span>Baseline JSON</span>
          </div>
          <textarea value={previousValue} onChange={(event) => setPreviousValue(event.target.value)} className="editor-textarea" />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Next shape</span>
            <span>Candidate JSON</span>
          </div>
          <textarea value={nextValue} onChange={(event) => setNextValue(event.target.value)} className="editor-textarea" />
        </section>
      </div>

      {result.error ? (
        <div className="editor-error">
          <strong>Comparison issue</strong>
          <p>{result.error}</p>
        </div>
      ) : result.output ? (
        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Compatibility</span>
              <strong>{result.output.compatibilityScore}/100</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Breaking findings</span>
              <strong>{result.output.breakingFindings.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Non-breaking additions</span>
              <strong>{result.output.nonBreakingFindings.length}</strong>
            </article>
          </div>

          <div className="editor-grid">
            <section className="editor-panel">
              <div className="editor-panel__head">
                <span className="editor-panel__heading-with-icon">
                  <GitCompareArrows size={16} />
                  Breaking changes
                </span>
                <span>Review before release</span>
              </div>
              <div className="insight-list">
                {result.output.breakingFindings.length > 0 ? (
                  result.output.breakingFindings.map((finding) => (
                    <article key={`${finding.kind}-${finding.path}`} className="insight-row insight-row--high">
                      <strong>{finding.path}</strong>
                      <p>
                        {finding.kind === 'removed'
                          ? `Removed ${finding.oldType} path.`
                          : `Type changed from ${finding.oldType} to ${finding.newType}.`}
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="empty-panel-copy">No obvious breaking changes were detected.</div>
                )}
              </div>
            </section>

            <section className="editor-panel">
              <div className="editor-panel__head">
                <span>Compatible additions</span>
                <span>New paths only</span>
              </div>
              <div className="insight-list">
                {result.output.nonBreakingFindings.length > 0 ? (
                  result.output.nonBreakingFindings.map((finding) => (
                    <article key={`${finding.kind}-${finding.path}`} className="insight-row">
                      <strong>{finding.path}</strong>
                      <p>Added new {finding.newType} path.</p>
                    </article>
                  ))
                ) : (
                  <div className="empty-panel-copy">No additive changes were found.</div>
                )}
              </div>
            </section>
          </div>
        </section>
      ) : null}
    </ToolFrame>
  );
}
