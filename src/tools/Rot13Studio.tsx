import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Shield } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformRot13 } from '../lib/privacyTools';

const sampleText = 'Utility Hub keeps prompt work local.';

export default function Rot13Studio() {
  const [input, setInput] = useState(sampleText);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => transformRot13(input), [input]);

  return (
    <ToolFrame eyebrow="Encoder" title="ROT13 Studio" description="Apply the reversible ROT13 transform locally for lightweight obfuscation and old-school text puzzles." actions={<><button type="button" className="action-button action-button--primary" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button><button type="button" className="action-button" onClick={() => setInput(sampleText)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>Input</span><span>Plain or ROT13 text</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Shield size={16} />Transformed output</span><span>Reversible</span></div><textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" /></section>
      </div>
    </ToolFrame>
  );
}
