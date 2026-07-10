import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Shield } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { deidentifyClinicalText } from '../lib/medicalTools';

const sampleText = `Patient Name: Jordan Smith
MRN: 184293
DOB: 12/04/1984
Phone: +61 412 555 019
Email: jordan.smith@example.com
Ward note: patient reviewed after imaging and discharge plan discussed with family.`;

export default function ClinicalDeIdentifier() {
  const [input, setInput] = useState(sampleText);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => deidentifyClinicalText(input), [input]);

  const copyRedacted = async () => {
    await navigator.clipboard.writeText(result.redacted);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Medical"
      title="Clinical De-Identifier"
      description="Remove obvious patient identifiers from pasted clinical notes, reports, and handoff text before broader sharing."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={copyRedacted}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy redacted text'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleText)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'De-identification scope',
        body: 'This tool focuses on obvious identifiers such as names, IDs, dates, email addresses, and phone-like strings. It is a practical first pass, not a legal de-identification guarantee.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Shield size={16} />
              Input text
            </span>
            <span>Paste clinical notes or reports</span>
          </div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Replacements</span>
              <strong>{result.replacements}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Input chars</span>
              <strong>{input.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Output chars</span>
              <strong>{result.redacted.length}</strong>
            </article>
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span>Redacted output</span>
              <span>Safe to review locally</span>
            </div>
            <textarea className="editor-textarea editor-textarea--output" readOnly value={result.redacted} />
          </section>
        </section>
      </div>
    </ToolFrame>
  );
}
