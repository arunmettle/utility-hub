import { useMemo, useState } from 'react';
import { Fingerprint, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateNanoIds } from '../lib/privacyTools';

export default function NanoIdGenerator() {
  const [count, setCount] = useState(5);
  const [length, setLength] = useState(12);
  const result = useMemo(() => generateNanoIds(count, length), [count, length]);

  return (
    <ToolFrame eyebrow="Generator" title="Nano ID Generator" description="Generate compact random IDs locally for fixtures, client-side keys, and demo data." actions={<button type="button" className="action-button" onClick={() => { setCount(5); setLength(12); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Fingerprint size={16} />Settings</span><span>Count and length</span></div><div className="stack-grid"><input className="tool-input" type="number" value={count} onChange={(event) => setCount(Number(event.target.value))} /><input className="tool-input" type="number" value={length} onChange={(event) => setLength(Number(event.target.value))} /></div></section><section className="editor-panel"><div className="editor-panel__head"><span>Generated IDs</span><span>{result.output?.values.length ?? 0} values</span></div>{result.error ? <div className="editor-error"><strong>ID issue</strong><p>{result.error}</p></div> : <div className="chip-list">{result.output?.values.map((value) => <span key={value} className="chip">{value}</span>)}</div>}</section></div>
    </ToolFrame>
  );
}
