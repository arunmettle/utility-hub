import { useMemo, useState } from 'react';
import { ArrowLeftRight, Link2, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformDataUrl, type DataUrlMode } from '../lib/privacyTools';

export default function DataUrlStudio() {
  const [mode, setMode] = useState<DataUrlMode>('text-to-data-url');
  const [input, setInput] = useState('Utility Hub keeps pasted text local.');
  const result = useMemo(() => transformDataUrl(input, mode), [input, mode]);

  return (
    <ToolFrame eyebrow="Encoder" title="Data URL Studio" description="Turn text into data URLs or decode data URLs back into their original text payloads locally." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'text-to-data-url' ? 'data-url-to-text' : 'text-to-data-url')}><ArrowLeftRight size={16} />{mode === 'text-to-data-url' ? 'Decode' : 'Encode'}</button><button type="button" className="action-button" onClick={() => setInput(mode === 'text-to-data-url' ? 'Utility Hub keeps pasted text local.' : 'data:text/plain;charset=utf-8;base64,VXRpbGl0eSBIdWIga2VlcHMgcGFzdGVkIHRleHQgbG9jYWwu')}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Link2 size={16} />Input</span><span>{mode === 'text-to-data-url' ? 'Text payload' : 'Data URL'}</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="editor-panel">
          <div className="editor-panel__head"><span>Output</span><span>{mode === 'text-to-data-url' ? 'Data URL' : 'Decoded text'}</span></div>
          {result.error ? <div className="editor-error"><strong>Data URL issue</strong><p>{result.error}</p></div> : <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output} />}
        </section>
      </div>
    </ToolFrame>
  );
}
