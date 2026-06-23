import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Workflow } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { formatApiError } from '../lib/privacyTools';

const sampleError = `{"status":422,"message":"Validation failed","field":"email","reason":"already exists"}`;

export default function ApiErrorFormatter() {
  const [input, setInput] = useState(sampleError);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => formatApiError(input), [input]);

  return (
    <ToolFrame eyebrow="Developer" title="API Error Formatter" description="Turn raw JSON error payloads into markdown summaries that are easier to paste into PRs, incidents, and support notes." actions={<><button type="button" className="action-button action-button--primary" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output?.markdown ?? ''); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy markdown'}</button><button type="button" className="action-button" onClick={() => setInput(sampleError)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>Error payload</span><span>JSON response body</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="stack-grid">{result.error ? <div className="editor-error"><strong>Error formatting issue</strong><p>{result.error}</p></div> : result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Status</span><strong>{result.output.statusCode}</strong></article><article className="stat-card"><span className="stat-card__label">Details</span><strong>{result.output.detailCount}</strong></article></div><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Workflow size={16} />Markdown summary</span><span>{result.output.title}</span></div><textarea readOnly value={result.output.markdown} className="editor-textarea editor-textarea--output" /></section></> : null}</section>
      </div>
    </ToolFrame>
  );
}
