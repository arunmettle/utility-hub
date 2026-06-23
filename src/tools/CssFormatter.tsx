import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Sparkles } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { formatCssStylesheet } from '../lib/privacyTools';

const sampleCss = '.panel{display:grid;gap:12px;color:#177e89}.panel strong{font-weight:700}';

export default function CssFormatter() {
  const [input, setInput] = useState(sampleCss);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => formatCssStylesheet(input), [input]);

  return (
    <ToolFrame eyebrow="Formatter" title="CSS Formatter" description="Format compact CSS into a cleaner block layout for review and copy-paste work." actions={<><button type="button" className="action-button action-button--primary" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button><button type="button" className="action-button" onClick={() => setInput(sampleCss)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>CSS input</span><span>Paste stylesheet</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Sparkles size={16} />Formatted output</span><span>Pretty CSS</span></div><textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" /></section>
      </div>
    </ToolFrame>
  );
}
