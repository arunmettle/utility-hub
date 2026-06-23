import { useMemo, useState } from 'react';
import { ArrowLeftRight, Binary, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformBase64Url, type Base64Mode } from '../lib/privacyTools';

export default function Base64UrlStudio() {
  const [mode, setMode] = useState<Base64Mode>('encode');
  const [input, setInput] = useState('client-side utilities');
  const result = useMemo(() => transformBase64Url(input, mode), [input, mode]);

  return (
    <ToolFrame eyebrow="Encoder" title="Base64 URL Studio" description="Work with URL-safe Base64 strings for JWT-style segments, opaque IDs, and query-safe payloads." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}><ArrowLeftRight size={16} />{mode === 'encode' ? 'Decode' : 'Encode'}</button><button type="button" className="action-button" onClick={() => setInput(mode === 'encode' ? 'client-side utilities' : 'Y2xpZW50LXNpZGUgdXRpbGl0aWVz')}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Binary size={16} />Input</span><span>{mode === 'encode' ? 'Text' : 'Base64 URL payload'}</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="editor-panel">
          <div className="editor-panel__head"><span>Output</span><span>{mode === 'encode' ? 'URL-safe Base64' : 'Decoded text'}</span></div>
          {result.error ? <div className="editor-error"><strong>Conversion issue</strong><p>{result.error}</p></div> : <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output} />}
        </section>
      </div>
    </ToolFrame>
  );
}
