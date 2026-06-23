import { useMemo, useState } from 'react';
import { RotateCcw, Workflow } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { summarizeHarRequests } from '../lib/privacyTools';

const sampleHar = `{"log":{"entries":[{"request":{"method":"GET","url":"https://api.utilityhub.dev/tools"},"response":{"status":200}},{"request":{"method":"POST","url":"https://api.utilityhub.dev/reports"},"response":{"status":201}}]}}`;

export default function HarRequestExtractor() {
  const [input, setInput] = useState(sampleHar);
  const result = useMemo(() => summarizeHarRequests(input), [input]);

  return (
    <ToolFrame eyebrow="Developer" title="HAR Request Extractor" description="Summarize requests from a pasted HAR file so domains, methods, and statuses are easier to inspect locally." actions={<button type="button" className="action-button" onClick={() => setInput(sampleHar)}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>HAR JSON</span><span>Paste a HAR payload</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="stack-grid">
          {result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card"><span className="stat-card__label">Requests</span><strong>{result.output.requestCount}</strong></article>
                <article className="stat-card"><span className="stat-card__label">Domains</span><strong>{result.output.domainCount}</strong></article>
              </div>
              <section className="editor-panel">
                <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Workflow size={16} />Requests</span><span>{Object.entries(result.output.methods).map(([method, count]) => `${method} ${count}`).join(' • ')}</span></div>
                <div className="insight-list">{result.output.requests.map((request, index) => <article key={`${request.method}-${request.url}-${index}`} className="insight-row"><strong>{request.method} {request.status}</strong><p>{request.url}</p><p>{request.domain}</p></article>)}</div>
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
