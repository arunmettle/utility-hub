import { useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import ToolFrame from './ToolFrame';
import type { AuditResult } from '../lib/workspaceWedgeTools';

interface CompareAuditToolProps {
  eyebrow: string;
  title: string;
  description: string;
  note: { title: string; body: string };
  leftLabel: string;
  rightLabel: string;
  leftHint: string;
  rightHint: string;
  leftSample: string;
  rightSample: string;
  analyze: (left: string, right: string) => AuditResult;
}

export default function CompareAuditTool({
  eyebrow,
  title,
  description,
  note,
  leftLabel,
  rightLabel,
  leftHint,
  rightHint,
  leftSample,
  rightSample,
  analyze,
}: CompareAuditToolProps) {
  const [left, setLeft] = useState(leftSample);
  const [right, setRight] = useState(rightSample);
  const [copied, setCopied] = useState(false);
  const result = analyze(left, right);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy summary'}
          </button>
          <button
            type="button"
            className="action-button"
            onClick={() => {
              setLeft(leftSample);
              setRight(rightSample);
            }}
          >
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={note}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>{leftLabel}</span>
            <span>{leftHint}</span>
          </div>
          <textarea value={left} onChange={(event) => setLeft(event.target.value)} className="editor-textarea" />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>{rightLabel}</span>
            <span>{rightHint}</span>
          </div>
          <textarea value={right} onChange={(event) => setRight(event.target.value)} className="editor-textarea" />
        </section>
      </div>

      <div className="stack-grid">
        <div className="stat-grid">
          {result.stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <span className="stat-card__label">{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Findings</span>
            <span>{result.findings.length} flagged items</span>
          </div>
          <div className="insight-list">
            {result.findings.length > 0 ? (
              result.findings.map((finding, index) => (
                <article key={`${finding.title}-${index}`} className={`insight-row insight-row--${finding.severity}`}>
                  <strong>{finding.title}</strong>
                  <p>{finding.detail}</p>
                </article>
              ))
            ) : (
              <article className="insight-row insight-row--low">
                <strong>No obvious issues detected</strong>
                <p>The compared samples did not produce any rule-based flags.</p>
              </article>
            )}
          </div>
        </section>

        {result.sections?.length ? (
          <section className="editor-panel">
            <div className="editor-panel__head">
              <span>Supporting sections</span>
              <span>Checklist or grouped notes</span>
            </div>
            <div className="docs-plain-list">
              {result.sections.map((section) => (
                <article key={section.title} className="docs-plain-item">
                  <p>
                    <strong>{section.title}</strong>
                  </p>
                  {section.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </ToolFrame>
  );
}
