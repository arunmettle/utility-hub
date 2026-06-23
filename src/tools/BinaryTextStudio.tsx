import { useMemo, useState } from 'react';
import { ArrowLeftRight, Binary, Check, Copy, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformBinaryText, type BinaryTextMode } from '../lib/privacyTools';

const sampleText = 'utility';

export default function BinaryTextStudio() {
  const [mode, setMode] = useState<BinaryTextMode>('encode');
  const [input, setInput] = useState(sampleText);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => transformBinaryText(input, mode), [input, mode]);

  return (
    <ToolFrame eyebrow="Encoder" title="Binary Text Studio" description="Encode text into 8-bit binary groups or decode binary bytes back into readable text." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}><ArrowLeftRight size={16} />Switch to {mode === 'encode' ? 'Decode' : 'Encode'}</button><button type="button" className="action-button" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button><button type="button" className="action-button" onClick={() => setInput(mode === 'encode' ? sampleText : '01110101 01110100 01101001 01101100 01101001 01110100 01111001')}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Binary size={16} />Input</span><span>{mode === 'encode' ? 'Plain text' : '8-bit binary groups'}</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section><section className="editor-panel"><div className="editor-panel__head"><span>Output</span><span>{mode === 'encode' ? 'Binary' : 'Decoded text'}</span></div>{result.error ? <div className="editor-error"><strong>Binary issue</strong><p>{result.error}</p></div> : <textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" />}</section></div>
    </ToolFrame>
  );
}
