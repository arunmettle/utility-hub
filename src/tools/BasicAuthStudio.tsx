import { useMemo, useState } from 'react';
import { ArrowLeftRight, KeyRound, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformBasicAuth, type CredentialMode } from '../lib/privacyTools';

export default function BasicAuthStudio() {
  const [mode, setMode] = useState<CredentialMode>('encode');
  const [input, setInput] = useState('demo:local-only-secret');
  const result = useMemo(() => transformBasicAuth(input, mode), [input, mode]);

  return (
    <ToolFrame eyebrow="Encoder" title="Basic Auth Studio" description="Encode credentials into an Authorization header or decode a Basic Auth header back into its raw pair." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}><ArrowLeftRight size={16} />{mode === 'encode' ? 'Decode' : 'Encode'}</button><button type="button" className="action-button" onClick={() => setInput(mode === 'encode' ? 'demo:local-only-secret' : 'Basic ZGVtbzpsb2NhbC1vbmx5LXNlY3JldA==')}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><KeyRound size={16} />Input</span><span>{mode === 'encode' ? 'username:password' : 'Basic header'}</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="editor-panel">
          <div className="editor-panel__head"><span>Output</span><span>{mode === 'encode' ? 'Authorization header' : 'Decoded credentials'}</span></div>
          {result.error ? <div className="editor-error"><strong>Credential issue</strong><p>{result.error}</p></div> : <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output} />}
        </section>
      </div>
    </ToolFrame>
  );
}
