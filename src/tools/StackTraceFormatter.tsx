import { useMemo, useState } from 'react';
import { RotateCcw, Workflow } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { formatStackTrace } from '../lib/privacyTools';

export default function StackTraceFormatter() {
  const [input, setInput] = useState('Error: failed\n    at saveFile (app.ts:42:9)\n    at onSubmit (form.tsx:18:3)');
  const output = useMemo(() => formatStackTrace(input), [input]);

  return (
    <ToolFrame eyebrow="Formatter" title="Stack Trace Formatter" description="Clean up copied stack traces into a compact readable list for reviews and debugging notes." actions={<button type="button" className="action-button" onClick={() => setInput('Error: failed\n    at saveFile (app.ts:42:9)\n    at onSubmit (form.tsx:18:3)')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Workflow size={16} />Raw stack trace</span></div><textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span>Formatted trace</span></div><textarea className="editor-textarea editor-textarea--output" readOnly value={output.output} /></section>
      </div>
    </ToolFrame>
  );
}
