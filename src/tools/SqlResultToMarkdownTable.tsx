import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Table2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertSqlResultToMarkdown } from '../lib/privacyTools';

const sampleSql = `name    category    local
Markdown Studio    Developer    true
Prompt Studio    AI    true`;

export default function SqlResultToMarkdownTable() {
  const [input, setInput] = useState(sampleSql);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => convertSqlResultToMarkdown(input), [input]);

  return (
    <ToolFrame eyebrow="Developer" title="SQL Result to Markdown Table" description="Convert aligned SQL results or tab-separated query output into a markdown table for PRs, docs, and tickets." actions={<><button type="button" className="action-button action-button--primary" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output?.markdown ?? ''); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy markdown'}</button><button type="button" className="action-button" onClick={() => setInput(sampleSql)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>Query result</span><span>Aligned rows or tabs</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="stack-grid">
          {result.error ? <div className="editor-error"><strong>Table issue</strong><p>{result.error}</p></div> : result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Rows</span><strong>{result.output.rowCount}</strong></article><article className="stat-card"><span className="stat-card__label">Columns</span><strong>{result.output.columnCount}</strong></article></div><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Table2 size={16} />Markdown output</span><span>Ready to paste</span></div><textarea readOnly value={result.output.markdown} className="editor-textarea editor-textarea--output" /></section></> : null}
        </section>
      </div>
    </ToolFrame>
  );
}
