import { useMemo, useState } from 'react';
import { RotateCcw, Terminal } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { formatHttpRequest } from '../lib/privacyTools';

export default function HttpRequestFormatter() {
  const [input, setInput] = useState('post https://api.example.com/tools\ncontent-type: application/json\nauthorization: Bearer demo\n\n{"tool":"markdown"}');
  const output = useMemo(() => formatHttpRequest(input), [input]);

  return (
    <ToolFrame eyebrow="Formatter" title="HTTP Request Formatter" description="Normalize copied request blocks so methods, headers, and JSON bodies are easier to read." actions={<button type="button" className="action-button" onClick={() => setInput('post https://api.example.com/tools\ncontent-type: application/json\nauthorization: Bearer demo\n\n{\"tool\":\"markdown\"}')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Terminal size={16} />Raw request</span></div><textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span>Formatted request</span></div><textarea className="editor-textarea editor-textarea--output" readOnly value={output.output} /></section>
      </div>
    </ToolFrame>
  );
}
