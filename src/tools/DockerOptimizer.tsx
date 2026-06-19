import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, ScanSearch } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { analyzeDockerfile } from '../lib/privacyTools';

const sampleDockerfile = `FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]`;

export default function DockerOptimizer() {
  const [input, setInput] = useState(sampleDockerfile);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => analyzeDockerfile(input), [input]);

  const handleCopy = async () => {
    const nextOutput = result.output?.optimizedDockerfile;
    if (!nextOutput) return;
    await navigator.clipboard.writeText(nextOutput);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Docker Optimizer"
      description="Review Dockerfiles locally for repeatability, image size, and runtime hygiene with a suggested tightened version."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy} disabled={!result.output?.optimizedDockerfile}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy optimized'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleDockerfile)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Local review',
        body: 'This tool lint-checks the Dockerfile in your browser only. It is meant to surface obvious build and runtime hygiene issues quickly before CI.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Dockerfile</span>
            <span>Paste the current container recipe</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Optimized output</span>
            <span>Suggested tightened version</span>
          </div>
          {result.error ? (
            <div className="editor-error">
              <strong>Review issue</strong>
              <p>{result.error}</p>
            </div>
          ) : (
            <textarea value={result.output?.optimizedDockerfile ?? ''} readOnly className="editor-textarea editor-textarea--output" />
          )}
        </section>
      </div>

      {result.output ? (
        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Quality score</span>
              <strong>{result.output.score}/100</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Findings</span>
              <strong>{result.output.findings.length}</strong>
            </article>
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span className="editor-panel__heading-with-icon">
                <ScanSearch size={16} />
                Findings
              </span>
              <span>Severity-ranked checks</span>
            </div>
            <div className="insight-list">
              {result.output.findings.length > 0 ? (
                result.output.findings.map((finding) => (
                  <article key={`${finding.severity}-${finding.title}`} className={`insight-row insight-row--${finding.severity}`}>
                    <strong>{finding.title}</strong>
                    <p>{finding.detail}</p>
                  </article>
                ))
              ) : (
                <div className="empty-panel-copy">No obvious Dockerfile hygiene issues were detected.</div>
              )}
            </div>
          </section>
        </section>
      ) : null}
    </ToolFrame>
  );
}
