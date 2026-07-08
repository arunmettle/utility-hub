import { Check, Copy, RotateCcw, Workflow } from 'lucide-react';
import { useMemo, useState } from 'react';
import ToolFrame from '../components/ToolFrame';
import { calculateBeltDrive, type BeltDriveInput } from '../lib/mechanicalTools';

const sampleState: BeltDriveInput = {
  driverDiameterMm: 120,
  drivenDiameterMm: 300,
  driverRpm: 1450,
  centerDistanceMm: 820,
};

export default function BeltDriveCalculator() {
  const [values, setValues] = useState(sampleState);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => calculateBeltDrive(values), [values]);

  const copyReport = async () => {
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Belt Drive Calculator"
      description="Check a quick pulley speed ratio, belt speed, and approximate belt length without opening a spreadsheet."
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
        title: 'Belt scope',
        body: 'This calculator assumes a simple open-belt drive and a first-pass approximate length. It is intended for layout screening, not full belt selection.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Workflow size={16} />
              Inputs
            </span>
            <span>Drive layout</span>
          </div>

          <div className="stack-grid">
            <label className="tool-field">
              <span>Driver pulley diameter (mm)</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.driverDiameterMm}
                onChange={(event) => setValues((current) => ({ ...current, driverDiameterMm: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Driven pulley diameter (mm)</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.drivenDiameterMm}
                onChange={(event) => setValues((current) => ({ ...current, drivenDiameterMm: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Driver speed (rpm)</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.driverRpm}
                onChange={(event) => setValues((current) => ({ ...current, driverRpm: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Center distance (mm)</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.centerDistanceMm}
                onChange={(event) => setValues((current) => ({ ...current, centerDistanceMm: Number(event.target.value) }))}
              />
            </label>
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Speed ratio</span>
              <strong>{result.speedRatio.toFixed(3)}:1</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Driven speed</span>
              <strong>{result.drivenRpm.toFixed(1)} rpm</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Belt speed</span>
              <strong>{result.beltSpeedMs.toFixed(2)} m/s</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Belt length</span>
              <strong>{result.beltLengthMm.toFixed(1)} mm</strong>
            </article>
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span className="editor-panel__heading-with-icon">
                <Workflow size={16} />
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
