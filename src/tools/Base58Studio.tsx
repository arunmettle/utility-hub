import { useMemo, useState } from 'react';
import { ArrowLeftRight, Binary, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformBase58, type Base64Mode } from '../lib/privacyTools';

export default function Base58Studio() {
  const [mode, setMode] = useState<Base64Mode>('encode');
  const [input, setInput] = useState('UtilityHub keeps browser tooling local.');
  const result = useMemo(() => transformBase58(input, mode), [input, mode]);

  return (
    <ToolFrame eyebrow="Encoder" title="Base58 Studio" description="Encode plain text into Base58 or decode Base58 payloads without sending content anywhere." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}><ArrowLeftRight size={16} />{mode === 'encode' ? 'Decode' : 'Encode'}</button><button type="button" className="action-button" onClick={() => setInput(mode === 'encode' ? 'UtilityHub keeps browser tooling local.' : '8sN6mZ9yKcJtH5M2gP1XbL6QvRb3xkQjQsp9dR2agP6pWiX') }><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Binary size={16} />Input</span><span>{mode === 'encode' ? 'Plain text' : 'Base58 payload'}</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === 'encode' ? 'Paste text to encode' : 'Paste Base58 to decode'} />
        </section>
        <section className="editor-panel">
          <div className="editor-panel__head"><span>Output</span><span>{mode === 'encode' ? 'Base58' : 'Decoded text'}</span></div>
          {result.error ? <div className="editor-error"><strong>Conversion issue</strong><p>{result.error}</p></div> : <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output} />}
        </section>
      </div>
    </ToolFrame>
  );
}
