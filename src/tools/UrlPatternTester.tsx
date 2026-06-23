import { useMemo, useState } from 'react';
import { Link2, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { testUrlPattern } from '../lib/privacyTools';

export default function UrlPatternTester() {
  const [pattern, setPattern] = useState('/tools/:toolId/run');
  const [candidate, setCandidate] = useState('/tools/json-formatter/run');
  const result = useMemo(() => testUrlPattern(pattern, candidate), [pattern, candidate]);

  return (
    <ToolFrame eyebrow="Tester" title="URL Pattern Tester" description="Check route-like URL patterns against candidate paths and inspect extracted parameter values." actions={<button type="button" className="action-button" onClick={() => { setPattern('/tools/:toolId/run'); setCandidate('/tools/json-formatter/run'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Link2 size={16} />Pattern and candidate</span></div><div className="stack-grid"><input className="tool-input" value={pattern} onChange={(event) => setPattern(event.target.value)} /><input className="tool-input" value={candidate} onChange={(event) => setCandidate(event.target.value)} /></div></section>
        <section className="stack-grid">{result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Matched</span><strong>{result.output.matched ? 'Yes' : 'No'}</strong></article><article className="stat-card"><span className="stat-card__label">Params</span><strong>{result.output.parameters.length}</strong></article></div><div className="chip-list">{result.output.parameters.map((item) => <span key={item.key} className="chip">{item.key}: {item.value}</span>)}</div></> : null}</section>
      </div>
    </ToolFrame>
  );
}
