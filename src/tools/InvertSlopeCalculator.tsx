import { Check, Copy, Gauge, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import ToolFrame from '../components/ToolFrame';
import { calculateInvertSlope, type InvertSlopeInput } from '../lib/civilTools';

const sampleState: InvertSlopeInput = {
  upstreamInvertMm: 14520,
  downstreamInvertMm: 14390,
  lengthMeters: 42,
};

export default function InvertSlopeCalculator() {
  const [values, setValues] = useState(sampleState);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => calculateInvertSlope(values), [values]);

  const copyReport = async () => {
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Planner"
      title="Invert & Slope Calculator"
      description="Check a drainage or pipe-run fall, slope, and midpoint invert quickly without leaving the browser."
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
        title: 'Slope scope',
        body: 'This is a quick level-check tool for civil drainage and pipe runs. It makes the slope visible but does not replace a full design model.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Gauge size={16} />
              Inputs
            </span>
            <span>Levels and length</span>
          </div>

          <div className="stack-grid">
            <label className="tool-field">
              <span>Upstream invert (mm)</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.upstreamInvertMm}
                onChange={(event) => setValues((current) => ({ ...current, upstreamInvertMm: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Downstream invert (mm)</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.downstreamInvertMm}
                onChange={(event) => setValues((current) => ({ ...current, downstreamInvertMm: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Length (m)</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.lengthMeters}
                onChange={(event) => setValues((current) => ({ ...current, lengthMeters: Number(event.target.value) }))}
              />
            </label>
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Fall</span>
              <strong>{result.fallMm.toFixed(1)} mm</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Slope</span>
              <strong>{result.slopePercent.toFixed(3)}%</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">1 in N</span>
              <strong>{result.slope1InN ? result.slope1InN.toFixed(1) : 'Flat'}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Midpoint invert</span>
              <strong>{result.midpointInvertMm.toFixed(1)} mm</strong>
            </article>
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span className="editor-panel__heading-with-icon">
                <Gauge size={16} />
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
