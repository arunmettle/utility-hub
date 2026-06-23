import { useMemo, useState } from 'react';
import { Braces, RotateCcw, ScanSearch } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { exploreJsonPath } from '../lib/privacyTools';

const sampleJson = `{
  "event": {
    "type": "deployment.finished",
    "actor": {
      "name": "Arun"
    }
  },
  "meta": {
    "duration": 17
  }
}`;

export default function JsonPathExplorer() {
  const [input, setInput] = useState(sampleJson);
  const [path, setPath] = useState('event.actor.name');
  const result = useMemo(() => exploreJsonPath(input, path), [input, path]);

  return (
    <ToolFrame eyebrow="Developer" title="JSON Path Explorer" description="Inspect pasted JSON with simple dot-path lookups so nested payloads are easier to review locally." actions={<button type="button" className="action-button" onClick={() => { setInput(sampleJson); setPath('event.actor.name'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span>JSON payload</span><span>Paste structured data</span></div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>
        <section className="stack-grid">
          <section className="editor-panel">
            <div className="editor-panel__head"><span>Path</span><span>Dot notation</span></div>
            <input className="tool-input" value={path} onChange={(event) => setPath(event.target.value)} />
          </section>
          {result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card"><span className="stat-card__label">Found</span><strong>{result.output.found ? 'Yes' : 'No'}</strong></article>
                <article className="stat-card"><span className="stat-card__label">Type</span><strong>{result.output.valueType}</strong></article>
              </div>
              <section className="editor-panel">
                <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Braces size={16} />Value</span><span>{result.output.path}</span></div>
                <textarea readOnly value={result.output.value} className="editor-textarea editor-textarea--output" />
              </section>
              <section className="editor-panel">
                <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><ScanSearch size={16} />Available keys</span><span>{result.output.availableKeys.length}</span></div>
                <div className="chip-list">{result.output.availableKeys.map((key) => <span key={key} className="chip">{key}</span>)}</div>
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
