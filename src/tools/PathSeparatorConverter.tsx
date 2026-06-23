import { useMemo, useState } from 'react';
import { ArrowLeftRight, RotateCcw, Terminal } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertPathSeparators } from '../lib/privacyTools';

export default function PathSeparatorConverter() {
  const [target, setTarget] = useState<'windows' | 'posix'>('posix');
  const [input, setInput] = useState('src\\tools\\JsonFormatter.tsx');
  const output = useMemo(() => convertPathSeparators(input, target), [input, target]);

  return (
    <ToolFrame eyebrow="Converter" title="Path Separator Converter" description="Convert file paths between Windows and POSIX separators when moving across shells, docs, and scripts." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setTarget(target === 'windows' ? 'posix' : 'windows')}><ArrowLeftRight size={16} />Switch to {target === 'windows' ? 'POSIX' : 'Windows'}</button><button type="button" className="action-button" onClick={() => setInput(target === 'windows' ? 'src/tools/JsonFormatter.tsx' : 'src\\tools\\JsonFormatter.tsx')}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Terminal size={16} />Input path</span></div><textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span>Converted path</span></div><textarea className="editor-textarea editor-textarea--output" readOnly value={output.output} /></section>
      </div>
    </ToolFrame>
  );
}
