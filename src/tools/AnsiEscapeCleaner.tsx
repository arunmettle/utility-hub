import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Terminal } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { cleanAnsiOutput } from '../lib/privacyTools';

const sampleAnsi = '\u001b[32mSUCCESS\u001b[0m build completed\n\u001b[31mERROR\u001b[0m retry deploy';

export default function AnsiEscapeCleaner() {
  const [input, setInput] = useState(sampleAnsi);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => cleanAnsiOutput(input), [input]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="ANSI Escape Cleaner"
      description="Strip terminal color codes and escape sequences from pasted console output so logs are readable in markdown, tickets, and docs."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" disabled={!result.output?.cleaned} onClick={async () => {
            await navigator.clipboard.writeText(result.output?.cleaned ?? '');
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy cleaned text'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleAnsi)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Terminal size={16} />
              Raw terminal output
            </span>
            <span>ANSI or copied console logs</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>
        <section className="stack-grid">
          {result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card"><span className="stat-card__label">Removed sequences</span><strong>{result.output.removedSequences}</strong></article>
                <article className="stat-card"><span className="stat-card__label">Lines</span><strong>{result.output.lineCount}</strong></article>
              </div>
              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Cleaned output</span>
                  <span>Markdown-friendly</span>
                </div>
                <textarea readOnly value={result.output.cleaned} className="editor-textarea editor-textarea--output" />
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
