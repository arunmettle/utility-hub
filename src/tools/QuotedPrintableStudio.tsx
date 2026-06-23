import { useMemo, useState } from 'react';
import { ArrowLeftRight, Binary, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformQuotedPrintable, type Base64Mode } from '../lib/privacyTools';

export default function QuotedPrintableStudio() {
  const [mode, setMode] = useState<Base64Mode>('encode');
  const [input, setInput] = useState('Olé utility hub');
  const result = useMemo(() => transformQuotedPrintable(input, mode), [input, mode]);

  return (
    <ToolFrame eyebrow="Encoder" title="Quoted Printable Studio" description="Encode or decode quoted-printable text for mail bodies, legacy payloads, and copied message fragments." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}><ArrowLeftRight size={16} />{mode === 'encode' ? 'Decode' : 'Encode'}</button><button type="button" className="action-button" onClick={() => setInput(mode === 'encode' ? 'Olé utility hub' : 'Ol=C3=A9=20utility=20hub')}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Binary size={16} />Input</span><span>{mode === 'encode' ? 'Text' : 'Quoted-printable payload'}</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="editor-panel">
          <div className="editor-panel__head"><span>Output</span><span>{mode === 'encode' ? 'Quoted-printable' : 'Decoded text'}</span></div>
          {result.error ? <div className="editor-error"><strong>Conversion issue</strong><p>{result.error}</p></div> : <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output} />}
        </section>
      </div>
    </ToolFrame>
  );
}
