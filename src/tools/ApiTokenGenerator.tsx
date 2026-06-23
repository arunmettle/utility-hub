import { useMemo, useState } from 'react';
import { KeyRound, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateApiTokens } from '../lib/privacyTools';

export default function ApiTokenGenerator() {
  const [count, setCount] = useState(3);
  const [length, setLength] = useState(24);
  const [prefix, setPrefix] = useState('uh');
  const result = useMemo(() => generateApiTokens(count, length, prefix), [count, length, prefix]);

  return (
    <ToolFrame eyebrow="Generator" title="API Token Generator" description="Generate random token-like strings locally for development, mocks, and test fixtures." actions={<button type="button" className="action-button" onClick={() => { setCount(3); setLength(24); setPrefix('uh'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><KeyRound size={16} />Settings</span><span>Count, length, prefix</span></div><div className="stack-grid"><input className="tool-input" type="number" value={count} onChange={(event) => setCount(Number(event.target.value))} /><input className="tool-input" type="number" value={length} onChange={(event) => setLength(Number(event.target.value))} /><input className="tool-input" value={prefix} onChange={(event) => setPrefix(event.target.value)} /></div></section><section className="editor-panel"><div className="editor-panel__head"><span>Generated tokens</span><span>{result.output?.values.length ?? 0} values</span></div>{result.error ? <div className="editor-error"><strong>Token issue</strong><p>{result.error}</p></div> : <div className="chip-list">{result.output?.values.map((value) => <span key={value} className="chip">{value}</span>)}</div>}</section></div>
    </ToolFrame>
  );
}
