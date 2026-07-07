import { useMemo, useState } from 'react';
import { Check, Copy, GitCompareArrows, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { diffBomCsv } from '../lib/industryTools';

const leftSample = `part,qty,description
100-001,2,Bracket
100-002,4,M6 bolt
100-003,1,Motor
100-004,2,Spacer`;

const rightSample = `part,qty,description
100-001,2,Bracket
100-002,6,M6 bolt
100-003,1,Motor rev B
100-005,1,Shim kit`;

export default function BomDiffChecker() {
  const [left, setLeft] = useState(leftSample);
  const [right, setRight] = useState(rightSample);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => diffBomCsv(left, right), [left, right]);

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Tester"
      title="BOM Diff Checker"
      description="Compare two BOM exports locally to see added parts, removed parts, quantity changes, and description changes without forcing the workflow into PLM first."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy} disabled={!result.output}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy summary'}
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
        title: 'BOM scope',
        body: 'This tool assumes a simple CSV with part number in the first column and quantity in the second column. It is built for fast export-to-export review, not full BOM lifecycle control.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Previous BOM</span>
            <span>Older export</span>
          </div>
          <textarea className="editor-textarea editor-textarea--compact" value={left} onChange={(event) => setLeft(event.target.value)} />
        </section>
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Updated BOM</span>
            <span>Newer export</span>
          </div>
          <textarea className="editor-textarea editor-textarea--compact" value={right} onChange={(event) => setRight(event.target.value)} />
        </section>
      </div>

      {result.error ? (
        <div className="editor-error">
          <strong>BOM diff issue</strong>
          <p>{result.error}</p>
        </div>
      ) : result.output ? (
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <GitCompareArrows size={16} />
              BOM change summary
            </span>
            <span>{result.output.totalParts} tracked parts</span>
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

