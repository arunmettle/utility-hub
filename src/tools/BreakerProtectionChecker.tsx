import { Check, Copy, RotateCcw, Shield } from 'lucide-react';
import { useMemo, useState } from 'react';
import ToolFrame from '../components/ToolFrame';
import { checkBreakerProtection, type BreakerProtectionInput } from '../lib/electricalTools';

const breakerOptions = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500];

const sampleState: BreakerProtectionInput = {
  loadCurrentA: 38,
  continuousFactor: 1.25,
  deratingFactor: 0.94,
  selectedBreakerA: 63,
};

export default function BreakerProtectionChecker() {
  const [values, setValues] = useState(sampleState);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => checkBreakerProtection(values), [values]);

  const copyReport = async () => {
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Planner"
      title="Breaker Protection Checker"
      description="Screen a breaker choice against load, continuous duty, and derating so early protection checks stay visible."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={copyReport}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy report'}
          </button>
          <button type="button" className="action-button" onClick={() => setValues(sampleState)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Protection scope',
        body: 'This is a quick screening check for breaker selection. It does not replace a full coordination study or code-based final review.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Shield size={16} />
              Inputs
            </span>
            <span>Load and breaker</span>
          </div>

          <div className="stack-grid">
            <label className="tool-field">
              <span>Load current (A)</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.loadCurrentA}
                onChange={(event) => setValues((current) => ({ ...current, loadCurrentA: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Continuous factor</span>
              <input
                className="tool-input"
                type="number"
                step="0.01"
                value={values.continuousFactor}
                onChange={(event) => setValues((current) => ({ ...current, continuousFactor: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Derating factor</span>
              <input
                className="tool-input"
                type="number"
                step="0.01"
                value={values.deratingFactor}
                onChange={(event) => setValues((current) => ({ ...current, deratingFactor: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Selected breaker</span>
              <select
                className="tool-input tool-input--select"
                value={values.selectedBreakerA}
                onChange={(event) => setValues((current) => ({ ...current, selectedBreakerA: Number(event.target.value) }))}
              >
                {breakerOptions.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} A
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Required current</span>
              <strong>{result.requiredCurrentA.toFixed(1)} A</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Recommended</span>
              <strong>{result.recommendedStandardBreakerA} A</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Loading</span>
              <strong>{result.loadingPercent.toFixed(1)}%</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Status</span>
              <strong>{result.passes ? 'Passes' : 'Needs larger breaker'}</strong>
            </article>
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span className="editor-panel__heading-with-icon">
                <Shield size={16} />
                Report
              </span>
              <span>Copy-ready</span>
            </div>
            <textarea className="editor-textarea editor-textarea--output" readOnly value={result.report} />
          </section>
        </section>
      </div>
    </ToolFrame>
  );
}
