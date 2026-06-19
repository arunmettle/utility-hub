import { useMemo, useState } from 'react';
import { Boxes, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { analyzeDockerCompose } from '../lib/privacyTools';

const sampleCompose = `services:
  api:
    image: node:latest
    ports:
      - "3000:3000"
  redis:
    image: redis:7
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]`;

export default function DockerComposeAuditor() {
  const [input, setInput] = useState(sampleCompose);
  const result = useMemo(() => analyzeDockerCompose(input), [input]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Docker Compose Auditor"
      description="Inspect a docker-compose services block for image hygiene, health checks, restart coverage, and obvious runtime risk signals."
      actions={
        <button type="button" className="action-button" onClick={() => setInput(sampleCompose)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Local compose review',
        body: 'This is a lightweight browser-side audit for service definitions. It is especially helpful when reviewing compose files in tickets, runbooks, or pull requests.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>docker-compose.yml</span>
            <span>Paste service definitions</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Compose issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Score</span>
                  <strong>{result.output.score}/100</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Services</span>
                  <strong>{result.output.serviceCount}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Findings</span>
                  <strong>{result.output.findings.length}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <Boxes size={16} />
                    Service summary
                  </span>
                  <span>Ports and health</span>
                </div>
                <div className="insight-list">
                  {result.output.services.map((service) => (
                    <article key={service.name} className="insight-row">
                      <strong>{service.name}</strong>
                      <p>
                        {service.image || 'build-only service'} • {service.portCount} published ports •{' '}
                        {service.hasHealthcheck ? 'healthcheck present' : 'no healthcheck'}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Findings</span>
                  <span>Review hotspots</span>
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
