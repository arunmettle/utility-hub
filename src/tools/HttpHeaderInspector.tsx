import { useMemo, useState } from 'react';
import { RotateCcw, Shield } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectHttpHeaders } from '../lib/privacyTools';

const sampleHeaders = `HTTP/2 200
content-type: application/json
cache-control: private, max-age=60
access-control-allow-origin: *
x-content-type-options: nosniff`;

export default function HttpHeaderInspector() {
  const [input, setInput] = useState(sampleHeaders);
  const result = useMemo(() => inspectHttpHeaders(input), [input]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="HTTP Header Inspector"
      description="Review raw response headers for security gaps, cache behavior, and CORS posture without relying on external scanners."
      actions={
        <button type="button" className="action-button" onClick={() => setInput(sampleHeaders)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Paste raw headers',
        body: 'You can paste headers copied from DevTools, curl -I output, or an API gateway log snippet. The tool summarizes what is present and what is missing.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Response headers</span>
            <span>One header per line</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Header issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Security score</span>
                  <strong>{result.output.securityScore}/100</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Headers parsed</span>
                  <strong>{result.output.headers.length}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Findings</span>
                  <strong>{result.output.findings.length}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <Shield size={16} />
                    Summary
                  </span>
                  <span>Security and caching</span>
                </div>
                <div className="insight-list">
                  <article className="insight-row">
                    <strong>Cache</strong>
                    <p>{result.output.cacheSummary}</p>
                  </article>
                  <article className="insight-row">
                    <strong>CORS</strong>
                    <p>{result.output.corsSummary}</p>
                  </article>
                </div>
              </section>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Findings</span>
                  <span>Missing or risky headers</span>
                </div>
                <div className="insight-list">
                  {result.output.findings.map((finding) => (
                    <article key={finding.title} className={`insight-row insight-row--${finding.severity}`}>
                      <strong>{finding.title}</strong>
                      <p>{finding.detail}</p>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
