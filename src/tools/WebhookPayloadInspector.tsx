import { useMemo, useState } from 'react';
import { RotateCcw, Shield } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectWebhookPayload } from '../lib/privacyTools';

const samplePayload = `{"type":"deployment.finished","id":"evt_123","data":{"project":"utility-hub","duration":17},"attempts":[1,2]}`;

export default function WebhookPayloadInspector() {
  const [input, setInput] = useState(samplePayload);
  const result = useMemo(() => inspectWebhookPayload(input), [input]);

  return (
    <ToolFrame eyebrow="Developer" title="Webhook Payload Inspector" description="Inspect top-level keys, event naming, and nested structure in pasted webhook payloads without sending them anywhere." actions={<button type="button" className="action-button" onClick={() => setInput(samplePayload)}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>Webhook JSON</span><span>Paste event payload</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="stack-grid">
          {result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card"><span className="stat-card__label">Event</span><strong>{result.output.eventName}</strong></article>
                <article className="stat-card"><span className="stat-card__label">Nested objects</span><strong>{result.output.nestedObjectCount}</strong></article>
                <article className="stat-card"><span className="stat-card__label">Arrays</span><strong>{result.output.arrayCount}</strong></article>
              </div>
              <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Shield size={16} />Top-level keys</span><span>{result.output.topLevelKeys.length}</span></div><div className="chip-list">{result.output.topLevelKeys.map((entry) => <span key={entry.key} className="chip">{entry.key}<small>{entry.type}</small></span>)}</div></section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
