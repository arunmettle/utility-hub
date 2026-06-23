import { useMemo, useState } from 'react';
import { ArrowDownAZ, Check, Copy, RotateCcw, ScanSearch } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { deduplicateLines, type LineDeduplicationMode } from '../lib/privacyTools';

const sampleLines = `markdown
prompt
markdown
diff
prompt`;

export default function LineDeduplicator() {
  const [mode, setMode] = useState<LineDeduplicationMode>('preserve-order');
  const [input, setInput] = useState(sampleLines);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => deduplicateLines(input, mode), [input, mode]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Line Deduplicator"
      description="Remove repeated lines from pasted text, package names, logs, or lists while preserving order or sorting the final result."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'preserve-order' ? 'sort-ascending' : 'preserve-order')}>
            <ArrowDownAZ size={16} />
            {mode === 'preserve-order' ? 'Sort unique lines' : 'Preserve original order'}
          </button>
          <button type="button" className="action-button" disabled={!result.output} onClick={async () => {
            await navigator.clipboard.writeText(result.output?.output ?? '');
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleLines)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Input lines</span>
            <span>One item per line</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>
        <section className="stack-grid">
          {result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card"><span className="stat-card__label">Unique lines</span><strong>{result.output.uniqueCount}</strong></article>
                <article className="stat-card"><span className="stat-card__label">Removed duplicates</span><strong>{result.output.removedCount}</strong></article>
              </div>
              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <ScanSearch size={16} />
                    Deduplicated output
                  </span>
                  <span>{mode === 'preserve-order' ? 'Original order kept' : 'Sorted unique output'}</span>
                </div>
                <textarea readOnly value={result.output.output} className="editor-textarea editor-textarea--output" />
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
