import { useMemo, useState } from 'react';
import { ShieldCheck, Workflow } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { validateGitHubActions } from '../lib/privacyTools';

const sampleWorkflow = `name: CI

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm test`;

export default function GitHubActionsValidator() {
  const [input, setInput] = useState(sampleWorkflow);
  const result = useMemo(() => validateGitHubActions(input), [input]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="GitHub Actions Validator"
      description="Review workflow YAML for missing triggers, job wiring, checkout steps, and safety signals before the pipeline hits CI."
      note={{
        title: 'What it checks',
        body: 'This validator focuses on structure and common workflow gaps. It is not a full YAML parser, but it catches the mistakes that most often break local review and pull request confidence.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Workflow YAML</span>
            <span>Paste a GitHub Actions workflow</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Validation issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Triggers</span>
                  <strong>{result.output.triggers.length}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Jobs</span>
                  <strong>{result.output.jobs.length}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Findings</span>
                  <strong>{result.output.findings.length}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <Workflow size={16} />
                    Workflow summary
                  </span>
                  <span>{result.output.triggers.join(', ') || 'No triggers found'}</span>
                </div>
                <div className="insight-list">
                  {result.output.jobs.map((job) => (
                    <article key={job.name} className="insight-row">
                      <strong>{job.name}</strong>
                      <p>
                        Runner: {job.hasRunsOn ? 'configured' : 'missing'} • Steps: {job.stepCount}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <ShieldCheck size={16} />
                    Findings
                  </span>
                  <span>CI review checks</span>
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
                    <div className="empty-panel-copy">The workflow passed the current structural checks.</div>
                  )}
                </div>
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
