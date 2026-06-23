import { useMemo, useState } from 'react';
import { GitCompareArrows, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { diffHeaders } from '../lib/privacyTools';

const leftSample = `content-type: application/json
cache-control: private, max-age=60
x-frame-options: DENY`;

const rightSample = `content-type: application/json; charset=utf-8
cache-control: public, max-age=300
content-security-policy: default-src 'self'`;

export default function HeaderDiffChecker() {
  const [left, setLeft] = useState(leftSample);
  const [right, setRight] = useState(rightSample);
  const result = useMemo(() => diffHeaders(left, right), [left, right]);

  return (
    <ToolFrame eyebrow="Developer" title="Header Diff Checker" description="Compare two raw header blocks to spot added, removed, and changed headers quickly." actions={<button type="button" className="action-button" onClick={() => { setLeft(leftSample); setRight(rightSample); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>Header block A</span><span>Baseline</span></div><textarea value={left} onChange={(event) => setLeft(event.target.value)} className="editor-textarea" /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span>Header block B</span><span>Candidate</span></div><textarea value={right} onChange={(event) => setRight(event.target.value)} className="editor-textarea" /></section>
      </div>
      {result.output ? (
        <div className="editor-grid">
          <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><GitCompareArrows size={16} />Added</span><span>{result.output.added.length}</span></div><div className="chip-list">{result.output.added.map((item) => <span key={item} className="chip">{item}</span>)}</div></section>
          <section className="editor-panel"><div className="editor-panel__head"><span>Removed</span><span>{result.output.removed.length}</span></div><div className="chip-list">{result.output.removed.map((item) => <span key={item} className="chip">{item}</span>)}</div></section>
          <section className="editor-panel"><div className="editor-panel__head"><span>Changed</span><span>{result.output.changed.length}</span></div><div className="insight-list">{result.output.changed.map((item) => <article key={item.key} className="insight-row"><strong>{item.key}</strong><p>A: {item.left}</p><p>B: {item.right}</p></article>)}</div></section>
        </div>
      ) : null}
    </ToolFrame>
  );
}
