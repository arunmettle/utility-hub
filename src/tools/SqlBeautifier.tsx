import { useMemo, useState } from 'react';
import { Check, Copy, Database, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { formatSqlQuery } from '../lib/privacyTools';

const sampleSql =
  'select id, name, status from work_orders where status = \'open\' and priority = \'high\' order by created_at desc limit 25';

export default function SqlBeautifier() {
  const [input, setInput] = useState(sampleSql);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => formatSqlQuery(input), [input]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="SQL Beautifier"
      description="Format dense SQL into a more reviewable layout so query clauses and filters are easier to scan before you run them."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy} disabled={!result.output}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy formatted SQL'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleSql)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Formatting only',
        body: 'This tool does not validate SQL dialect correctness. It focuses on readability, especially for pasted one-line queries from logs, docs, or tickets.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Raw SQL</span>
            <span>Paste a query</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Database size={16} />
              Formatted SQL
            </span>
            <span>Review-friendly output</span>
          </div>
          <textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" />
        </section>
      </div>
    </ToolFrame>
  );
}
