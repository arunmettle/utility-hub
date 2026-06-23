import { useMemo, useState } from 'react';
import { KeyRound, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectPasswordPolicy } from '../lib/privacyTools';

export default function PasswordPolicyInspector() {
  const [input, setInput] = useState('Passwords must be at least 12 characters long and include an uppercase letter, lowercase letter, number, and symbol. MFA is required.');
  const result = useMemo(() => inspectPasswordPolicy(input), [input]);

  return (
    <ToolFrame eyebrow="Security" title="Password Policy Inspector" description="Review human-readable password requirements locally and surface weak spots like short minimum lengths or forced rotation." actions={<button type="button" className="action-button" onClick={() => setInput('Passwords must be at least 12 characters long and include an uppercase letter, lowercase letter, number, and symbol. MFA is required.')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><KeyRound size={16} />Policy text</span><span>Paste prose from standards or docs</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="stack-grid">
          {result.output ? <>
            <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Minimum length</span><strong>{result.output.minimumLength ?? 'unknown'}</strong></article><article className="stat-card"><span className="stat-card__label">Requirements</span><strong>{result.output.requirements.length}</strong></article><article className="stat-card"><span className="stat-card__label">Score</span><strong>{result.output.score}</strong></article></div>
            <div className="chip-list">{result.output.requirements.map((item) => <span key={item} className="chip">{item}</span>)}</div>
            {result.output.findings.map((finding) => <article key={finding.title} className="insight-row"><strong>{finding.title}</strong><p>{finding.detail}</p></article>)}
          </> : null}
        </section>
      </div>
    </ToolFrame>
  );
}
