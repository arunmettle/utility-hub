import { useMemo, useState } from 'react';
import { Check, Copy, GitCompareArrows, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { diffBoqCsv } from '../lib/industryTools';

const leftSample = `item,qty,unit,description
C1,120,m,Kerb line
D1,18,ea,Drain pit lid
S1,4,ea,Signage post
T1,1,ls,Traffic staging`;

const rightSample = `item,qty,unit,description
C1,140,m,Kerb line
D1,18,ea,Drain pit lid
S1,6,ea,Signage post
T1,1,ls,Traffic staging revision B
R1,2,ea,Road barrier`;

export default function BoqDiffChecker() {
  const [left, setLeft] = useState(leftSample);
  const [right, setRight] = useState(rightSample);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => diffBoqCsv(left, right), [left, right]);

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Tester"
      title="BOQ / Quantity Diff Checker"
      description="Compare two BOQ or quantity-export tables locally to spot added items, removed items, quantity changes, and description changes without relying on a spreadsheet diff by hand."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy} disabled={!result.output}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy summary'}
          </button>
          <button type="button" className="action-button" onClick={() => setLeft(leftSample)}>
            <RotateCcw size={16} />
            Reset left
          </button>
          <button type="button" className="action-button" onClick={() => setRight(rightSample)}>
            <RotateCcw size={16} />
            Reset right
          </button>
        </>
      }
      note={{
        title: 'Quantity diff scope',
        body: 'This MVP assumes a simple CSV with item, quantity, unit, and description columns. It is meant for fast export-to-export review, not a full cost-control or estimating system.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>BOQ A</span>
            <span>Older export</span>
          </div>
          <textarea className="editor-textarea editor-textarea--compact" value={left} onChange={(event) => setLeft(event.target.value)} />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>BOQ B</span>
            <span>Updated export</span>
          </div>
          <textarea className="editor-textarea editor-textarea--compact" value={right} onChange={(event) => setRight(event.target.value)} />
        </section>
      </div>

      {result.error ? (
        <div className="editor-error">
          <strong>BOQ diff issue</strong>
          <p>{result.error}</p>
        </div>
      ) : result.output ? (
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <GitCompareArrows size={16} />
              Quantity change summary
            </span>
            <span>{result.output.totalItems} tracked items</span>
          </div>

          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Added</span>
              <strong>{result.output.added.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Removed</span>
              <strong>{result.output.removed.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Qty changed</span>
              <strong>{result.output.quantityChanged.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Description changed</span>
              <strong>{result.output.descriptionChanged.length}</strong>
            </article>
          </div>

          <div className="docs-plain-list">
            {result.output.highlights.map((item) => (
              <article key={item} className="docs-plain-item">
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </ToolFrame>
  );
}
