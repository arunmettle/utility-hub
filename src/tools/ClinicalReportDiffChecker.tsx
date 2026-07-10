import { useMemo, useState } from 'react';
import { Check, Copy, FileSearch, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { compareClinicalReports } from '../lib/medicalTools';

const leftSample = `Ward round note: patient reviewed by pediatrics at 08:30
Observation: oxygen requirement improved overnight
Plan: repeat bloods and monitor intake
Comment: discharge summary pending`;

const rightSample = `Ward round note: patient reviewed by pediatrics at 08:30
Observation: oxygen requirement improved overnight
Plan: repeat bloods, monitor intake, and review fluids
Comment: discharge summary pending
Action: update family after imaging`;

export default function ClinicalReportDiffChecker() {
  const [left, setLeft] = useState(leftSample);
  const [right, setRight] = useState(rightSample);
  const [copied, setCopied] = useState(false);
  const diff = useMemo(() => compareClinicalReports(left, right), [left, right]);

  const copySummary = async () => {
    const summary = [
      `Changed: ${diff.summary.changed}`,
      `Added: ${diff.summary.added}`,
      `Removed: ${diff.summary.removed}`,
      `Unchanged: ${diff.summary.unchanged}`,
      ...diff.numberChanges,
    ].join('\n');
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Medical"
      title="Clinical Report Diff Checker"
      description="Compare pasted report text, ward notes, or extracted summaries and isolate changed lines before a handover or review."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={copySummary}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy summary'}
          </button>
          <button type="button" className="action-button" onClick={() => { setLeft(leftSample); setRight(rightSample); }}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Clinical review scope',
        body: 'This surface is designed for pasted text from reports or notes. It helps reviewers see changes quickly without needing a heavier document comparison tool.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Report A</span>
            <span>Earlier note or summary</span>
          </div>
          <textarea className="editor-textarea" value={left} onChange={(event) => setLeft(event.target.value)} />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Report B</span>
            <span>Updated note or summary</span>
          </div>
          <textarea className="editor-textarea" value={right} onChange={(event) => setRight(event.target.value)} />
        </section>
      </div>

      <section className="editor-panel">
        <div className="editor-panel__head">
          <span className="editor-panel__heading-with-icon">
            <FileSearch size={16} />
            Review summary
          </span>
          <span>{diff.rows.length} rows</span>
        </div>

        <div className="stat-grid">
          <article className="stat-card">
            <span className="stat-card__label">Changed</span>
            <strong>{diff.summary.changed}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-card__label">Added</span>
            <strong>{diff.summary.added}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-card__label">Removed</span>
            <strong>{diff.summary.removed}</strong>
          </article>
          <article className="stat-card">
            <span className="stat-card__label">Numeric changes</span>
            <strong>{diff.numberChanges.length}</strong>
          </article>
        </div>

        {diff.numberChanges.length > 0 ? (
          <div className="tool-note">
            <h2>Numeric changes detected</h2>
            <ul className="tool-bullet-list">
              {diff.numberChanges.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="docs-plain-list">
          {diff.rows.map((row, index) => (
            <article key={`${row.kind}-${index}`} className="docs-plain-item">
              <p>
                <strong>{row.kind.toUpperCase()}</strong> {row.leftLineNumber ? `L${row.leftLineNumber}` : ''}{' '}
                {row.rightLineNumber ? `R${row.rightLineNumber}` : ''}
              </p>
              <p>{row.leftValue || ' '}</p>
              {row.kind !== 'unchanged' ? <p>{row.rightValue || ' '}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </ToolFrame>
  );
}
