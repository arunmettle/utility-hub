import { useMemo, useState } from 'react';
import { RotateCcw, Table2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { formatIniDocument } from '../lib/privacyTools';

export default function IniFormatter() {
  const [input, setInput] = useState('[app]\nname=utility-hub\nmode: local');
  const output = useMemo(() => formatIniDocument(input), [input]);

  return (
    <ToolFrame eyebrow="Formatter" title="INI Formatter" description="Normalize INI and .env-like key/value text into a consistent readable shape." actions={<button type="button" className="action-button" onClick={() => setInput('[app]\nname=utility-hub\nmode: local')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Table2 size={16} />Input</span></div><textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span>Formatted output</span></div><textarea className="editor-textarea editor-textarea--output" readOnly value={output.output} /></section>
      </div>
    </ToolFrame>
  );
}
