import { useMemo, useState } from 'react';
import { GitCompareArrows, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { compareJsonValues } from '../lib/privacyTools';

const leftSample = '{"name":"utility-hub","flags":{"ai":true,"beta":false}}';
const rightSample = '{"name":"utility-hub","flags":{"ai":true,"beta":true},"region":"au"}';

export default function JsonValueComparator() {
  const [left, setLeft] = useState(leftSample);
  const [right, setRight] = useState(rightSample);
  const result = useMemo(() => compareJsonValues(left, right), [left, right]);

  return (
    <ToolFrame eyebrow="Tester" title="JSON Value Comparator" description="Compare two JSON payloads by path so added, removed, and changed values are easier to review." actions={<button type="button" className="action-button" onClick={() => { setLeft(leftSample); setRight(rightSample); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span>JSON A</span><span>Baseline</span></div><textarea value={left} onChange={(event) => setLeft(event.target.value)} className="editor-textarea" /></section><section className="editor-panel"><div className="editor-panel__head"><span>JSON B</span><span>Candidate</span></div><textarea value={right} onChange={(event) => setRight(event.target.value)} className="editor-textarea" /></section></div>
      {result.error ? <div className="editor-error"><strong>JSON issue</strong><p>{result.error}</p></div> : result.output ? <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><GitCompareArrows size={16} />Added</span><span>{result.output.added.length}</span></div><div className="chip-list">{result.output.added.map((item) => <span key={item} className="chip">{item}</span>)}</div></section><section className="editor-panel"><div className="editor-panel__head"><span>Removed</span><span>{result.output.removed.length}</span></div><div className="chip-list">{result.output.removed.map((item) => <span key={item} className="chip">{item}</span>)}</div></section><section className="editor-panel"><div className="editor-panel__head"><span>Changed</span><span>{result.output.changed.length}</span></div><div className="chip-list">{result.output.changed.map((item) => <span key={item} className="chip">{item}</span>)}</div></section></div> : null}
    </ToolFrame>
  );
}
