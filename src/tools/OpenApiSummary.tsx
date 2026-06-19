import { useMemo, useState } from 'react';
import { RotateCcw, Workflow } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { summarizeOpenApi } from '../lib/privacyTools';

const sampleOpenApi = `{
  "openapi": "3.1.0",
  "info": {
    "title": "Cobalt API",
    "version": "1.2.0"
  },
  "servers": [
    { "url": "https://api.utilityhub.dev" }
  ],
  "paths": {
    "/tools": {
      "get": { "tags": ["tools"] }
    },
    "/tools/{id}": {
      "get": { "tags": ["tools"] },
      "delete": { "tags": ["admin"] }
    }
  },
  "components": {
    "securitySchemes": {
      "bearerAuth": {
        "type": "http",
        "scheme": "bearer"
      }
    }
  }
}`;

export default function OpenApiSummary() {
  const [input, setInput] = useState(sampleOpenApi);
  const result = useMemo(() => summarizeOpenApi(input), [input]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="OpenAPI Summary"
      description="Summarize a pasted OpenAPI document into endpoints, methods, tags, and auth schemes so reviewers can understand the surface quickly."
      actions={
        <button type="button" className="action-button" onClick={() => setInput(sampleOpenApi)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'JSON first, YAML aware',
        body: 'The richest summaries come from JSON OpenAPI documents. YAML can still be scanned for paths and method counts when you need a quick browser-side overview.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>OpenAPI document</span>
            <span>Paste JSON or YAML</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Spec issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Title</span>
                  <strong>{result.output.title}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Paths</span>
                  <strong>{result.output.pathCount}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Operations</span>
                  <strong>{result.output.operationCount}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <Workflow size={16} />
                    API surface
                  </span>
                  <span>Version {result.output.version}</span>
                </div>
                <div className="insight-list">
                  <article className="insight-row">
                    <strong>Methods</strong>
                    <p>
                      {Object.entries(result.output.methods)
                        .filter(([, count]) => count > 0)
                        .map(([method, count]) => `${method} ${count}`)
                        .join(' • ')}
                    </p>
                  </article>
                  <article className="insight-row">
                    <strong>Tags</strong>
                    <p>{result.output.tags.length > 0 ? result.output.tags.join(', ') : 'No tags detected.'}</p>
                  </article>
                  <article className="insight-row">
                    <strong>Security schemes</strong>
                    <p>
                      {result.output.securitySchemes.length > 0
                        ? result.output.securitySchemes.join(', ')
                        : 'No security schemes detected.'}
                    </p>
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
