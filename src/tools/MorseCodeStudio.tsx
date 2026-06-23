import { useMemo, useState } from 'react';
import { ArrowLeftRight, Check, Copy, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformMorseCode, type MorseCodeMode } from '../lib/privacyTools';

const sampleMorseText = 'utility hub';

export default function MorseCodeStudio() {
  const [mode, setMode] = useState<MorseCodeMode>('encode');
  const [input, setInput] = useState(sampleMorseText);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => transformMorseCode(input, mode), [input, mode]);

  return (
    <ToolFrame eyebrow="Encoder" title="Morse Code Studio" description="Encode text into Morse code or decode Morse back into readable text directly in the browser." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}><ArrowLeftRight size={16} />Switch to {mode === 'encode' ? 'Decode' : 'Encode'}</button><button type="button" className="action-button" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button><button type="button" className="action-button" onClick={() => setInput(sampleMorseText)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span>Input</span><span>{mode === 'encode' ? 'Plain text' : 'Dots and dashes'}</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section><section className="editor-panel"><div className="editor-panel__head"><span>Output</span><span>{mode === 'encode' ? 'Morse code' : 'Decoded text'}</span></div><textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" /></section></div>
    </ToolFrame>
  );
}
