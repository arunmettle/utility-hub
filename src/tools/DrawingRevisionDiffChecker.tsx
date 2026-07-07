import { useMemo, useState } from 'react';
import { Check, Copy, EyeOff, GitCompareArrows, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { buildRevisionDiff } from '../lib/industryTools';

const leftSample = `A101 | Grid B4 | Door width 900 mm
M201 | Pump duty 18 L/s at 22 m head
E110 | Panel B feeder 125 A
Note: install guardrail before commissioning`;

const rightSample = `A101 | Grid B4 | Door width 1000 mm
M201 | Pump duty 20 L/s at 24 m head
E110 | Panel B feeder 160 A
Note: install guardrail and warning signage before commissioning
E111 | Add spare breaker for MCC tie-in`;

export default function DrawingRevisionDiffChecker() {
  const [left, setLeft] = useState(leftSample);
  const [right, setRight] = useState(rightSample);
  const [hideUnchanged, setHideUnchanged] = useState(true);
  const [copied, setCopied] = useState(false);
  const diff = useMemo(() => buildRevisionDiff(left, right), [left, right]);
  const visibleRows = hideUnchanged ? diff.rows.filter((row) => row.kind !== 'unchanged') : diff.rows;

  const copySummary = async () => {
    const summary = [
      `Changed: ${diff.summary.changed}`,
      `Added: ${diff.summary.added}`,
      `Removed: ${diff.summary.removed}`,
      ...diff.numberChanges,
    ].join('\n');
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Tester"
      title="Drawing Revision Diff Checker"
      description="Compare pasted drawing notes, schedules, callouts, or OCR text from two revisions and isolate changed lines, added lines, and numeric deltas."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={copySummary}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy summary'}
          </button>
          <button type="button" className="action-button" onClick={() => setHideUnchanged((current) => !current)}>
            <EyeOff size={16} />
            {hideUnchanged ? 'Show unchanged' : 'Hide unchanged'}
          </button>
          <button
            type="button"
            className="action-button"
            onClick={() => {
              setLeft(leftSample);
              setRight(rightSample);
            }}
          >
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Revision note',
        body: 'This first release focuses on pasted or extracted text from drawings, schedules, and markups. It is a lightweight review surface for revision spotting, not a full CAD or PDF renderer.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Revision A</span>
            <span>Older drawing notes</span>
          </div>
          <textarea className="editor-textarea editor-textarea--compact" value={left} onChange={(event) => setLeft(event.target.value)} />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Revision B</span>
            <span>Updated drawing notes</span>
          </div>
          <textarea className="editor-textarea editor-textarea--compact" value={right} onChange={(event) => setRight(event.target.value)} />
        </section>
      </div>

      <section className="editor-panel">
        <div className="editor-panel__head">
          <span className="editor-panel__heading-with-icon">
            <GitCompareArrows size={16} />
            Revision summary
          </span>
          <span>{visibleRows.length} visible rows</span>
        </div>
        <div className="diff-summary">
          <span className="diff-summary__pill diff-summary__pill--changed">Changed {diff.summary.changed}</span>
          <span className="diff-summary__pill diff-summary__pill--added">Added {diff.summary.added}</span>
          <span className="diff-summary__pill diff-summary__pill--removed">Removed {diff.summary.removed}</span>
          <span className="diff-summary__pill">Unchanged {diff.summary.unchanged}</span>
        </div>

        <div className="stack-grid">
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
            {visibleRows.map((row, index) => (
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
        </div>
      </section>
    </ToolFrame>
  );
}
