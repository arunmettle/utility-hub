import { useMemo, useState } from 'react';
import { Braces, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { testJsonPointer } from '../lib/privacyTools';

export default function JsonPointerTester() {
  const [json, setJson] = useState('{"event":{"actor":{"name":"Arun"}}}');
  const [pointer, setPointer] = useState('/event/actor/name');
  const result = useMemo(() => testJsonPointer(json, pointer), [json, pointer]);

  return (
    <ToolFrame eyebrow="Tester" title="JSON Pointer Tester" description="Evaluate JSON Pointer paths locally against payloads to confirm exact target locations." actions={<button type="button" className="action-button" onClick={() => { setJson('{"event":{"actor":{"name":"Arun"}}}'); setPointer('/event/actor/name'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Braces size={16} />Input JSON</span></div><textarea className="editor-textarea" value={json} onChange={(event) => setJson(event.target.value)} /><input className="tool-input" value={pointer} onChange={(event) => setPointer(event.target.value)} /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span>Pointer result</span></div>{result.error ? <div className="editor-error"><strong>Pointer issue</strong><p>{result.error}</p></div> : <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output?.found ? result.output.value : 'No match found'} />}</section>
      </div>
    </ToolFrame>
  );
}
