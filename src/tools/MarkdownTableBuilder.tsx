import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Table2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { buildMarkdownTable } from '../lib/privacyTools';

const sampleRows = `name,category,local
JSON Formatter,formatters,true
Base64 Studio,encoders,true`;

export default function MarkdownTableBuilder() {
  const [input, setInput] = useState(sampleRows);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => buildMarkdownTable(input), [input]);

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output.markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Markdown Table Builder"
      description="Convert CSV rows or JSON arrays into a markdown table that is ready for docs, PR comments, or release notes."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy} disabled={!result.output}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy markdown table'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleRows)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Accepted input',
        body: 'Paste either CSV with a header row or a JSON array of objects. The table is generated locally and stays editable after you copy it into docs.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Rows</span>
            <span>CSV or JSON array</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Table issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Rows</span>
                  <strong>{result.output.rowCount}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Columns</span>
                  <strong>{result.output.columnCount}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <Table2 size={16} />
                    Markdown output
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
