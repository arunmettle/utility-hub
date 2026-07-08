import { Check, Cog, Copy, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import ToolFrame from '../components/ToolFrame';
import { calculateBearingLife, type BearingLifeInput } from '../lib/mechanicalTools';

const sampleState: BearingLifeInput = {
  bearingType: 'ball',
  dynamicLoadRatingKn: 42,
  equivalentLoadKn: 12,
  serviceFactor: 1.15,
  speedRpm: 1450,
};

export default function BearingLifeCalculator() {
  const [values, setValues] = useState(sampleState);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => calculateBearingLife(values), [values]);

  const copyReport = async () => {
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Bearing Life Calculator"
      description="Estimate L10 bearing life from load, rating, speed, and bearing type with visible browser-local assumptions."
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
        title: 'Bearing scope',
        body: 'This is a first-pass bearing life screen. It uses a simplified L10 life relation and visible load assumptions, not a catalog-driven selection tool.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Cog size={16} />
              Inputs
            </span>
            <span>Life screening</span>
          </div>

          <div className="stack-grid">
            <label className="tool-field">
              <span>Bearing type</span>
              <select
                className="tool-input tool-input--select"
                value={values.bearingType}
                onChange={(event) => setValues((current) => ({ ...current, bearingType: event.target.value as BearingLifeInput['bearingType'] }))}
              >
                <option value="ball">Ball bearing</option>
                <option value="roller">Roller bearing</option>
              </select>
            </label>
            <label className="tool-field">
              <span>Dynamic load rating (kN)</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.dynamicLoadRatingKn}
                onChange={(event) => setValues((current) => ({ ...current, dynamicLoadRatingKn: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Equivalent radial load (kN)</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.equivalentLoadKn}
                onChange={(event) => setValues((current) => ({ ...current, equivalentLoadKn: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Service factor</span>
              <input
                className="tool-input"
                type="number"
                step="0.05"
                value={values.serviceFactor}
                onChange={(event) => setValues((current) => ({ ...current, serviceFactor: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Speed (rpm)</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.speedRpm}
                onChange={(event) => setValues((current) => ({ ...current, speedRpm: Number(event.target.value) }))}
              />
            </label>
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Life</span>
              <strong>{result.lifeMillionRevs.toFixed(2)} M revs</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Hours</span>
              <strong>{result.lifeHours.toFixed(1)} h</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Load ratio</span>
              <strong>{result.loadRatio.toFixed(2)}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Exponent</span>
              <strong>{result.exponent.toFixed(3)}</strong>
            </article>
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span className="editor-panel__heading-with-icon">
                <Cog size={16} />
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
