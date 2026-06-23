import { useMemo, useState } from 'react';
import { Check, Copy, ListChecks, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { buildMarkdownChecklist } from '../lib/privacyTools';

const sampleChecklist = `ship markdown studio
[x] fix ai studio labels
- validate playwright route coverage
write deploy notes`;

export default function MarkdownChecklistBuilder() {
  const [input, setInput] = useState(sampleChecklist);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => buildMarkdownChecklist(input), [input]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Markdown Checklist Builder"
      description="Turn rough bullets, numbered notes, or mixed todo text into markdown task lists that are ready for PR descriptions, issues, and release checklists."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" disabled={!result.output} onClick={async () => {
            await navigator.clipboard.writeText(result.output?.markdown ?? '');
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy checklist'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleChecklist)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Source notes</span>
            <span>Bullets, mixed lines, or tasks</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>
        <section className="stack-grid">
          {result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card"><span className="stat-card__label">Items</span><strong>{result.output.itemCount}</strong></article>
                <article className="stat-card"><span className="stat-card__label">Checked</span><strong>{result.output.checkedCount}</strong></article>
              </div>
              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <ListChecks size={16} />
                    Markdown checklist
                  </span>
                  <span>Ready to paste</span>
                </div>
                <textarea readOnly value={result.output.markdown} className="editor-textarea editor-textarea--output" />
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
