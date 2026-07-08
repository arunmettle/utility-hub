import { Check, Copy, Gauge, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import ToolFrame from '../components/ToolFrame';
import { calculateGearRatio, type GearRatioInput } from '../lib/mechanicalTools';

const sampleState: GearRatioInput = {
  driverTeeth: 18,
  drivenTeeth: 54,
  inputRpm: 1450,
  inputTorqueNm: 24,
  efficiencyPercent: 96,
};

export default function GearRatioCalculator() {
  const [values, setValues] = useState(sampleState);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => calculateGearRatio(values), [values]);

  const copyReport = async () => {
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Gear Ratio & Torque Calculator"
      description="Turn tooth counts, speed, and torque into a quick gear ratio screen with visible power and efficiency assumptions."
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
        title: 'Ratio scope',
        body: 'This is a quick screening tool for simple gear trains. It keeps the math visible and does not try to replace detailed gear design software.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Gauge size={16} />
              Inputs
            </span>
            <span>Speed and torque</span>
          </div>

          <div className="stack-grid">
            <label className="tool-field">
              <span>Driver teeth</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.driverTeeth}
                onChange={(event) => setValues((current) => ({ ...current, driverTeeth: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Driven teeth</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.drivenTeeth}
                onChange={(event) => setValues((current) => ({ ...current, drivenTeeth: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Input speed (rpm)</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.inputRpm}
                onChange={(event) => setValues((current) => ({ ...current, inputRpm: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Input torque (Nm)</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.inputTorqueNm}
                onChange={(event) => setValues((current) => ({ ...current, inputTorqueNm: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Efficiency (%)</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.efficiencyPercent}
                onChange={(event) => setValues((current) => ({ ...current, efficiencyPercent: Number(event.target.value) }))}
              />
            </label>
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Ratio</span>
              <strong>{result.ratio.toFixed(3)}:1</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Output speed</span>
              <strong>{result.outputRpm.toFixed(1)} rpm</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Output torque</span>
              <strong>{result.outputTorqueNm.toFixed(2)} Nm</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Power loss</span>
              <strong>{result.powerLossW.toFixed(1)} W</strong>
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
