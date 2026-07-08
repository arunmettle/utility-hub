import { Check, Copy, RotateCcw, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import ToolFrame from '../components/ToolFrame';
import { calculateLightingLoad, type LightingLoadInput } from '../lib/electricalTools';

const sampleState: LightingLoadInput = {
  areaM2: 1250,
  densityWPerM2: 12,
  voltageV: 230,
  powerFactor: 0.95,
  fixtureWatts: 36,
};

export default function LightingLoadCalculator() {
  const [values, setValues] = useState(sampleState);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => calculateLightingLoad(values), [values]);

  const copyReport = async () => {
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Planner"
      title="Lighting Load Calculator"
      description="Estimate lighting power, current, and fixture count from area and density without resorting to a spreadsheet."
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
        title: 'Lighting scope',
        body: 'This tool gives a first-pass lighting load using an area density assumption. It is useful for quick planning, not final design certification.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Zap size={16} />
              Inputs
            </span>
            <span>Area and density</span>
          </div>

          <div className="stack-grid">
            <label className="tool-field">
              <span>Area (m2)</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.areaM2}
                onChange={(event) => setValues((current) => ({ ...current, areaM2: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Lighting density (W/m2)</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.densityWPerM2}
                onChange={(event) => setValues((current) => ({ ...current, densityWPerM2: Number(event.target.value) }))}
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
              <span>Power factor</span>
              <input
                className="tool-input"
                type="number"
                step="0.01"
                value={values.powerFactor}
                onChange={(event) => setValues((current) => ({ ...current, powerFactor: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Fixture watts</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.fixtureWatts}
                onChange={(event) => setValues((current) => ({ ...current, fixtureWatts: Number(event.target.value) }))}
              />
            </label>
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Total power</span>
              <strong>{result.totalPowerW.toFixed(1)} W</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Current</span>
              <strong>{result.currentA.toFixed(2)} A</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Fixtures</span>
              <strong>{result.estimatedFixtureCount}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Fixture wattage</span>
              <strong>{result.wattsPerFixture.toFixed(1)} W</strong>
            </article>
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span className="editor-panel__heading-with-icon">
                <Zap size={16} />
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
