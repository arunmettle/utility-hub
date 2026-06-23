import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Shield } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { redactSecrets } from '../lib/privacyTools';

const sampleSecrets = `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQXJ1biJ9.signaturevalue
OPENAI_API_KEY=sk-test-secret-token
Contact: arun@example.com`;

export default function SecretRedactor() {
  const [input, setInput] = useState(sampleSecrets);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => redactSecrets(input), [input]);

  return (
    <ToolFrame eyebrow="Security" title="Secret Redactor" description="Mask likely tokens, email addresses, and credential-like strings before you paste logs into tickets, chat, or AI tools." actions={<><button type="button" className="action-button action-button--primary" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output?.redacted ?? ''); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy redacted text'}</button><button type="button" className="action-button" onClick={() => setInput(sampleSecrets)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>Raw text</span><span>Paste logs or notes</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="stack-grid">{result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Replacements</span><strong>{result.output.replacements}</strong></article></div><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Shield size={16} />Redacted output</span><span>Safe to share</span></div><textarea readOnly value={result.output.redacted} className="editor-textarea editor-textarea--output" /></section></> : null}</section>
      </div>
    </ToolFrame>
  );
}
