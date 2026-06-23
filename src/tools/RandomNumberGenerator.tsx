import { useMemo, useState } from 'react';
import { RotateCcw, ScanSearch } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateRandomNumbers } from '../lib/privacyTools';

export default function RandomNumberGenerator() {
  const [count, setCount] = useState(5);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const result = useMemo(() => generateRandomNumbers(count, min, max), [count, min, max]);

  return (
    <ToolFrame eyebrow="Generator" title="Random Number Generator" description="Generate random integers locally for fixtures, sampling, and quick testing workflows." actions={<button type="button" className="action-button" onClick={() => { setCount(5); setMin(1); setMax(100); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><ScanSearch size={16} />Range</span><span>Count, min, max</span></div><div className="stack-grid"><input className="tool-input" type="number" value={count} onChange={(event) => setCount(Number(event.target.value))} /><input className="tool-input" type="number" value={min} onChange={(event) => setMin(Number(event.target.value))} /><input className="tool-input" type="number" value={max} onChange={(event) => setMax(Number(event.target.value))} /></div></section><section className="editor-panel"><div className="editor-panel__head"><span>Generated values</span><span>{result.output?.values.length ?? 0} numbers</span></div>{result.error ? <div className="editor-error"><strong>Number issue</strong><p>{result.error}</p></div> : <div className="chip-list">{result.output?.values.map((value, index) => <span key={`${value}-${index}`} className="chip">{value}</span>)}</div>}</section></div>
    </ToolFrame>
  );
}
