import { useMemo, useState } from 'react';
import { FileText, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateReleaseNotes } from '../lib/privacyTools';

export default function ReleaseNoteGenerator() {
  const [input, setInput] = useState('- Added Base58 Studio\n- Improved security inspection tools\n- Fixed sidebar interactions');
  const result = useMemo(() => generateReleaseNotes(input), [input]);

  return (
    <ToolFrame eyebrow="Generator" title="Release Note Generator" description="Turn rough bullet points into a tidy release-note block for changelogs and deployment summaries." actions={<button type="button" className="action-button" onClick={() => setInput('- Added Base58 Studio\n- Improved security inspection tools\n- Fixed sidebar interactions')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><FileText size={16} />Change bullets</span></div><textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span>Release notes</span><span>{result.output?.bulletCount ?? 0} bullets</span></div>{result.error ? <div className="editor-error"><strong>Release-note issue</strong><p>{result.error}</p></div> : <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output?.markdown ?? ''} />}</section>
      </div>
    </ToolFrame>
  );
}
