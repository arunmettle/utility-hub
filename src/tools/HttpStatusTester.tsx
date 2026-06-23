import { useMemo, useState } from 'react';
import { RotateCcw, Shield } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { testHttpStatusRule } from '../lib/privacyTools';

export default function HttpStatusTester() {
  const [statusCode, setStatusCode] = useState('204');
  const [rule, setRule] = useState('2xx');
  const result = useMemo(() => testHttpStatusRule(statusCode, rule), [statusCode, rule]);

  return (
    <ToolFrame eyebrow="Tester" title="HTTP Status Tester" description="Check whether a status code matches a family, exact code, or numeric response range." actions={<button type="button" className="action-button" onClick={() => { setStatusCode('204'); setRule('2xx'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Shield size={16} />Status and rule</span></div><div className="stack-grid"><input className="tool-input" value={statusCode} onChange={(event) => setStatusCode(event.target.value)} /><input className="tool-input" value={rule} onChange={(event) => setRule(event.target.value)} /></div></section>
        <section className="stack-grid">{result.error ? <div className="editor-error"><strong>Status rule issue</strong><p>{result.error}</p></div> : result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Match</span><strong>{result.output.isMatch ? 'Yes' : 'No'}</strong></article></div>{result.output.reasons.map((reason) => <article key={reason} className="insight-row"><strong>{reason}</strong></article>)}</> : null}</section>
      </div>
    </ToolFrame>
  );
}
