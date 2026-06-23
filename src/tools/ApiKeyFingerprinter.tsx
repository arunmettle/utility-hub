import { useMemo, useState } from 'react';
import { Fingerprint, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectApiKeyFingerprint } from '../lib/privacyTools';

export default function ApiKeyFingerprinter() {
  const [input, setInput] = useState('sk-test-demo-secret-key-value');
  const result = useMemo(() => inspectApiKeyFingerprint(input), [input]);

  return (
    <ToolFrame eyebrow="Security" title="API Key Fingerprinter" description="Mask sensitive tokens and generate a short fingerprint so teams can compare keys safely in screenshots or notes." actions={<button type="button" className="action-button" onClick={() => setInput('sk-test-demo-secret-key-value')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Fingerprint size={16} />Secret input</span><span>Paste one token locally</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="stack-grid">
          {result.output ? <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Masked</span><strong>{result.output.masked}</strong></article><article className="stat-card"><span className="stat-card__label">Fingerprint</span><strong>{result.output.fingerprint}</strong></article><article className="stat-card"><span className="stat-card__label">Length</span><strong>{result.output.length}</strong></article><article className="stat-card"><span className="stat-card__label">Likely provider</span><strong>{result.output.likelyProvider}</strong></article></div> : null}
        </section>
      </div>
    </ToolFrame>
  );
}
