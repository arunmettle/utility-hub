import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Sparkles } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { formatHtml } from '../lib/privacyTools';

const sampleHtml = '<section><h1>Utility Hub</h1><p>Format browser markup</p></section>';

export default function HtmlFormatter() {
  const [input, setInput] = useState(sampleHtml);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => formatHtml(input), [input]);

  return (
    <ToolFrame eyebrow="Formatter" title="HTML Formatter" description="Turn dense HTML into readable markup for debugging, reviews, and snippets." actions={<><button type="button" className="action-button action-button--primary" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button><button type="button" className="action-button" onClick={() => setInput(sampleHtml)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>HTML input</span><span>Paste markup</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Sparkles size={16} />Formatted output</span><span>Pretty HTML</span></div>{result.error ? <div className="editor-error"><strong>HTML issue</strong><p>{result.error}</p></div> : <textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" />}</section>
      </div>
    </ToolFrame>
  );
}
