import { useMemo, useState } from 'react';
import { RotateCcw, ScanSearch } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { testSemverRange } from '../lib/privacyTools';

export default function SemverRangeTester() {
  const [version, setVersion] = useState('1.4.2');
  const [range, setRange] = useState('^1.2.3');
  const result = useMemo(() => testSemverRange(version, range), [version, range]);

  return (
    <ToolFrame eyebrow="Tester" title="Semver Range Tester" description="Check whether a semantic version satisfies an exact, caret, tilde, or comparison range." actions={<button type="button" className="action-button" onClick={() => { setVersion('1.4.2'); setRange('^1.2.3'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><ScanSearch size={16} />Version and range</span></div><div className="stack-grid"><input className="tool-input" value={version} onChange={(event) => setVersion(event.target.value)} /><input className="tool-input" value={range} onChange={(event) => setRange(event.target.value)} /></div></section>
        <section className="stack-grid">{result.error ? <div className="editor-error"><strong>Range issue</strong><p>{result.error}</p></div> : result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Match</span><strong>{result.output.isMatch ? 'Yes' : 'No'}</strong></article></div>{result.output.reasons.map((reason) => <article key={reason} className="insight-row"><strong>{reason}</strong></article>)}</> : null}</section>
      </div>
    </ToolFrame>
  );
}
