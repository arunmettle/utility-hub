import { useMemo, useState } from 'react';
import { Link2, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectSignedUrl } from '../lib/privacyTools';

export default function SignedUrlInspector() {
  const [input, setInput] = useState('https://bucket.s3.amazonaws.com/report.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=86400&X-Amz-Signature=abc123');
  const result = useMemo(() => inspectSignedUrl(input), [input]);

  return (
    <ToolFrame eyebrow="Security" title="Signed URL Inspector" description="Inspect presigned or SAS-style URLs locally and review provider hints, expiry windows, and notable query parameters." actions={<button type="button" className="action-button" onClick={() => setInput('https://bucket.s3.amazonaws.com/report.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=86400&X-Amz-Signature=abc123')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Link2 size={16} />Signed URL</span><span>Paste the full URL</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="stack-grid">
          {result.error ? <div className="editor-error"><strong>Signed URL issue</strong><p>{result.error}</p></div> : result.output ? <>
            <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Provider</span><strong>{result.output.provider}</strong></article><article className="stat-card"><span className="stat-card__label">Expiry</span><strong>{result.output.expirySummary}</strong></article><article className="stat-card"><span className="stat-card__label">Params</span><strong>{result.output.parameters.length}</strong></article></div>
            <div className="chip-list">{result.output.parameters.map((item) => <span key={item} className="chip">{item}</span>)}</div>
            {result.output.findings.map((finding) => <article key={finding.title} className="insight-row"><strong>{finding.title}</strong><p>{finding.detail}</p></article>)}
          </> : null}
        </section>
      </div>
    </ToolFrame>
  );
}
