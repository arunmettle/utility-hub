import { Check, Copy, Gauge, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import ToolFrame from '../components/ToolFrame';
import { calculateMotorStarting, type MotorStartingInput } from '../lib/electricalTools';

const sampleState: MotorStartingInput = {
  fullLoadAmps: 32,
  startMultiplier: 6.2,
  voltageV: 415,
  phase: 'three',
  sourceFaultCurrentA: 220,
};

export default function MotorStartingCurrentCalculator() {
  const [values, setValues] = useState(sampleState);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => calculateMotorStarting(values), [values]);

  const copyReport = async () => {
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Planner"
      title="Motor Starting Current Calculator"
      description="Estimate inrush current, starting kVA, and a rough dip preview for simple motor-start planning."
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
        title: 'Starting scope',
        body: 'This is a simple start-current screen for early planning. It does not replace a detailed motor-start or protection study.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Gauge size={16} />
              Inputs
            </span>
            <span>Motor start planning</span>
          </div>

          <div className="stack-grid">
            <label className="tool-field">
              <span>Full-load amps</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.fullLoadAmps}
                onChange={(event) => setValues((current) => ({ ...current, fullLoadAmps: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Start multiplier</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.startMultiplier}
                onChange={(event) => setValues((current) => ({ ...current, startMultiplier: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Voltage (V)</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.voltageV}
                onChange={(event) => setValues((current) => ({ ...current, voltageV: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Phase</span>
              <select
                className="tool-input tool-input--select"
                value={values.phase}
                onChange={(event) => setValues((current) => ({ ...current, phase: event.target.value as MotorStartingInput['phase'] }))}
              >
                <option value="single">Single-phase</option>
                <option value="three">Three-phase</option>
              </select>
            </label>
            <label className="tool-field">
              <span>Source fault current (A)</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.sourceFaultCurrentA}
                onChange={(event) => setValues((current) => ({ ...current, sourceFaultCurrentA: Number(event.target.value) }))}
              />
            </label>
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Starting current</span>
              <strong>{result.startingCurrentA.toFixed(1)} A</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Starting kVA</span>
              <strong>{result.apparentPowerKVA.toFixed(2)} kVA</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Voltage dip</span>
              <strong>{result.voltageDipPercent === null ? 'n/a' : `${result.voltageDipPercent.toFixed(1)}%`}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Phase</span>
              <strong>{values.phase === 'three' ? 'Three-phase' : 'Single-phase'}</strong>
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
