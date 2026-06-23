import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectJwtExpiry } from '../lib/privacyTools';

const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dGlsaXR5LWh1YiIsImlhdCI6MTcxODYyMjAwMCwiZXhwIjoyMDMyNjIyMDAwfQ.signature';

export default function JwtExpiryChecker() {
  const [input, setInput] = useState(sampleToken);
  const result = useMemo(() => inspectJwtExpiry(input), [input]);

  return (
    <ToolFrame eyebrow="Security" title="JWT Expiry Checker" description="Inspect JWT issued-at and expiry timestamps quickly when you only need token lifetime metadata." actions={<button type="button" className="action-button" onClick={() => setInput(sampleToken)}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span>JWT token</span><span>Header.Payload.Signature</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea editor-textarea--compact" /></section><section className="stack-grid">{result.error ? <div className="editor-error"><strong>JWT issue</strong><p>{result.error}</p></div> : result.output ? <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Status</span><strong>{result.output.status}</strong></article><article className="stat-card"><span className="stat-card__label">Issued at</span><strong>{result.output.issuedAt}</strong></article><article className="stat-card"><span className="stat-card__label">Expires at</span><strong>{result.output.expiresAt}</strong></article></div> : null}</section></div>
    </ToolFrame>
  );
}
