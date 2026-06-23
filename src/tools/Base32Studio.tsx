import { useMemo, useState } from 'react';
import { ArrowLeftRight, Check, Copy, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformBase32, type Base64Mode } from '../lib/privacyTools';

const sampleBase32Text = 'utility hub';

export default function Base32Studio() {
  const [mode, setMode] = useState<Base64Mode>('encode');
  const [input, setInput] = useState(sampleBase32Text);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => transformBase32(input, mode), [input, mode]);

  return (
    <ToolFrame eyebrow="Encoder" title="Base32 Studio" description="Encode plain text into Base32 or decode Base32 payloads locally for interoperability work." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}><ArrowLeftRight size={16} />Switch to {mode === 'encode' ? 'Decode' : 'Encode'}</button><button type="button" className="action-button" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button><button type="button" className="action-button" onClick={() => setInput(sampleBase32Text)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span>Input</span><span>{mode === 'encode' ? 'Plain text' : 'Base32 text'}</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section><section className="editor-panel"><div className="editor-panel__head"><span>Output</span><span>{mode === 'encode' ? 'Base32' : 'Decoded text'}</span></div>{result.error ? <div className="editor-error"><strong>Base32 issue</strong><p>{result.error}</p></div> : <textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" />}</section></div>
    </ToolFrame>
  );
}
