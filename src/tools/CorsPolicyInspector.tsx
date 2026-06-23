import { useMemo, useState } from 'react';
import { Globe, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectCorsPolicy } from '../lib/privacyTools';

export default function CorsPolicyInspector() {
  const [input, setInput] = useState('access-control-allow-origin: *\naccess-control-allow-credentials: true\naccess-control-allow-methods: GET, POST');
  const result = useMemo(() => inspectCorsPolicy(input), [input]);

  return (
    <ToolFrame eyebrow="Security" title="CORS Policy Inspector" description="Review raw CORS response headers locally and flag risky combinations like wildcard origins with credentials." actions={<button type="button" className="action-button" onClick={() => setInput('access-control-allow-origin: *\naccess-control-allow-credentials: true\naccess-control-allow-methods: GET, POST')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Globe size={16} />Raw response headers</span><span>One header per line</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="stack-grid">
          {result.output ? <>
            <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Origin</span><strong>{result.output.allowedOrigin || 'missing'}</strong></article><article className="stat-card"><span className="stat-card__label">Credentials</span><strong>{result.output.allowCredentials ? 'Allowed' : 'Not allowed'}</strong></article><article className="stat-card"><span className="stat-card__label">Risk</span><strong>{result.output.risk}</strong></article></div>
            <div className="chip-list">{result.output.allowMethods.map((value) => <span key={value} className="chip">{value}</span>)}</div>
            {result.output.findings.map((finding) => <article key={finding.title} className="insight-row"><strong>{finding.title}</strong><p>{finding.detail}</p></article>)}
          </> : null}
        </section>
      </div>
    </ToolFrame>
  );
}
