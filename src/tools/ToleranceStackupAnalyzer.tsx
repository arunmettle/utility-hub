import { useMemo, useState } from 'react';
import { Check, Copy, Sigma, Table2, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { analyzeToleranceStack } from '../lib/industryTools';

const sampleStack = `label,nominal,plusTol,minusTol,direction
Housing width,50,0.1,0.1,+
Spacer A,10,0.05,0.05,+
Bracket tab,8,0.08,0.04,+
Shaft shoulder,66,0.02,0.02,-`;

export default function ToleranceStackupAnalyzer() {
  const [input, setInput] = useState(sampleStack);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => analyzeToleranceStack(input), [input]);

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Tester"
      title="Tolerance Stack-Up Analyzer"
      description="Analyze worst-case and RSS stack-ups from a simple line-based tolerance table so engineers can review fit windows faster than they can with a fragile spreadsheet."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy} disabled={!result.output}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy report'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleStack)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Stack-up scope',
        body: 'This MVP focuses on 1D stack-ups with nominal values, bilateral or unilateral tolerances, and additive or subtractive directions. It is meant for fast review, not full GD&T semantic modeling.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Table2 size={16} />
              Stack rows
            </span>
            <span>CSV: label, nominal, plusTol, minusTol, direction</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="editor-textarea"
            placeholder="label,nominal,plusTol,minusTol,direction"
          />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Stack-up issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Nominal</span>
                  <strong>{result.output.totalNominal.toFixed(3)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Worst-case min</span>
                  <strong>{result.output.totalMin.toFixed(3)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Worst-case max</span>
                  <strong>{result.output.totalMax.toFixed(3)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Worst-case range</span>
                  <strong>{result.output.totalRange.toFixed(3)}</strong>
                </article>
              </div>

              <div className="tool-note">
                <h2 className="editor-panel__heading-with-icon">
                  <Sigma size={16} />
                  RSS estimate
                </h2>
                <div className="timestamp-output">
                  <div className="timestamp-output__item">
                    <strong>RSS min</strong>
                    <span>{result.output.rssMin.toFixed(3)}</span>
                  </div>
                  <div className="timestamp-output__item">
                    <strong>RSS max</strong>
                    <span>{result.output.rssMax.toFixed(3)}</span>
                  </div>
                  <div className="timestamp-output__item">
                    <strong>Row count</strong>
                    <span>{result.output.rows.length}</span>
                  </div>
                </div>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Row breakdown</span>
                  <span>Contribution by stack row</span>
                </div>
                <div className="docs-plain-list">
                  {result.output.rows.map((row) => (
                    <article key={row.label} className="docs-plain-item">
                      <p>
                        <strong>{row.label}</strong> ({row.direction})
                      </p>
                      <p>
                        nominal {row.nominal.toFixed(3)} | min contribution {row.contributionMin.toFixed(3)} | max contribution {row.contributionMax.toFixed(3)}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}

