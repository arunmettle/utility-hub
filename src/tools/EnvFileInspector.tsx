import { useMemo, useState } from 'react';
import { RotateCcw, ScanSearch, Shield } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectEnvFile } from '../lib/privacyTools';

const sampleEnv = `# Utility Hub local config
VITE_APP_NAME=Utility Hub
API_BASE_URL=https://api.example.com
OPENAI_API_KEY=sk-example-secret
JWT_SECRET=super-secret-value
FEATURE_FLAG_AI=true
API_BASE_URL=https://duplicate.example.com
INVALID LINE`;

export default function EnvFileInspector() {
  const [input, setInput] = useState(sampleEnv);
  const result = useMemo(() => inspectEnvFile(input), [input]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="ENV File Inspector"
      description="Inspect `.env` style files locally for duplicate keys, likely secrets, invalid lines, and missing values before they cause deployment or runtime confusion."
      actions={
        <button type="button" className="action-button" onClick={() => setInput(sampleEnv)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Privacy guardrail',
        body: 'Values stay in the browser. Secret-like keys are masked in the preview so you can review config shape without re-exposing tokens while screen sharing or pasting.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>.env input</span>
            <span>dotenv style lines</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="stack-grid">
          {result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card"><span className="stat-card__label">Entries</span><strong>{result.output.entries.length}</strong></article>
                <article className="stat-card"><span className="stat-card__label">Secret-like keys</span><strong>{result.output.secretLikeCount}</strong></article>
                <article className="stat-card"><span className="stat-card__label">Duplicate keys</span><strong>{result.output.duplicateKeys.length}</strong></article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <ScanSearch size={16} />
                    Parsed entries
                  </span>
                  <span>Masked preview</span>
                </div>
                <div className="insight-list">
                  {result.output.entries.map((entry) => (
                    <article key={`${entry.key}-${entry.valuePreview}`} className={`insight-row ${entry.secretLike ? 'insight-row--medium' : ''}`}>
                      <strong>{entry.key}</strong>
                      <p>{entry.valuePreview}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <Shield size={16} />
                    Findings
                  </span>
                  <span>Config hygiene</span>
                </div>
                <div className="chip-list">
                  {result.output.duplicateKeys.map((key) => <span key={key} className="chip">{key}</span>)}
                  {result.output.invalidLines.map((line) => <span key={line} className="chip chip--muted">{line}</span>)}
                </div>
                {result.output.duplicateKeys.length === 0 && result.output.invalidLines.length === 0 ? (
                  <div className="empty-panel-copy">No duplicate keys or invalid lines were detected.</div>
                ) : null}
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
