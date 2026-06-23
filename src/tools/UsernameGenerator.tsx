import { useMemo, useState } from 'react';
import { RotateCcw, UserRound } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateUsernames } from '../lib/privacyTools';

export default function UsernameGenerator() {
  const [seed, setSeed] = useState('utility hub');
  const [count, setCount] = useState(5);
  const result = useMemo(() => generateUsernames(seed, count), [seed, count]);

  return (
    <ToolFrame eyebrow="Generator" title="Username Generator" description="Generate consistent username ideas locally from a seed phrase or project name." actions={<button type="button" className="action-button" onClick={() => { setSeed('utility hub'); setCount(5); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><UserRound size={16} />Seed</span><span>Base phrase and count</span></div><div className="stack-grid"><input className="tool-input" value={seed} onChange={(event) => setSeed(event.target.value)} /><input className="tool-input" type="number" value={count} onChange={(event) => setCount(Number(event.target.value))} /></div></section><section className="editor-panel"><div className="editor-panel__head"><span>Generated usernames</span><span>{result.output?.values.length ?? 0} suggestions</span></div>{result.error ? <div className="editor-error"><strong>Username issue</strong><p>{result.error}</p></div> : <div className="chip-list">{result.output?.values.map((value) => <span key={value} className="chip">{value}</span>)}</div>}</section></div>
    </ToolFrame>
  );
}
