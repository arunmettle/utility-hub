import { useMemo, useState } from 'react';
import { RotateCcw, Shield } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectCspPolicy } from '../lib/privacyTools';

const samplePolicy = `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self'; img-src 'self' data:`;

export default function CspPolicyInspector() {
  const [input, setInput] = useState(samplePolicy);
  const result = useMemo(() => inspectCspPolicy(input), [input]);

  return (
    <ToolFrame eyebrow="Security" title="CSP Policy Inspector" description="Inspect a Content Security Policy string for missing directives and risky allowances like unsafe-inline." actions={<button type="button" className="action-button" onClick={() => setInput(samplePolicy)}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span>CSP policy</span><span>Directive string</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea editor-textarea--compact" /></section><section className="stack-grid">{result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Directives</span><strong>{result.output.directives.length}</strong></article><article className="stat-card"><span className="stat-card__label">Findings</span><strong>{result.output.findings.length}</strong></article></div><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Shield size={16} />Findings</span><span>CSP review</span></div><div className="insight-list">{result.output.findings.map((finding) => <article key={finding.title} className={`insight-row insight-row--${finding.severity}`}><strong>{finding.title}</strong><p>{finding.detail}</p></article>)}</div></section></> : null}</section></div>
    </ToolFrame>
  );
}
