import { useMemo, useState } from 'react';
import { Check, RotateCcw, Zap } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { estimateCableSize } from '../lib/electricalTools';

const sampleState = {
  loadAmps: '58',
  systemVoltage: '400',
  lengthMeters: '72',
  phase: 'Three-phase' as const,
  conductorMaterial: 'Copper' as const,
  insulation: 'XLPE 90C' as const,
  installMethod: 'Conduit' as const,
  ambientC: '34',
  groupingCount: '3',
  continuousLoad: true,
  targetDropPercent: '3',
};

export default function CableSizingAssistant() {
  const [values, setValues] = useState(sampleState);

  const result = useMemo(
    () =>
      estimateCableSize({
        loadAmps: Number(values.loadAmps),
        systemVoltage: Number(values.systemVoltage),
        lengthMeters: Number(values.lengthMeters),
        phase: values.phase,
        conductorMaterial: values.conductorMaterial,
        insulation: values.insulation,
        installMethod: values.installMethod,
        ambientC: Number(values.ambientC),
        groupingCount: Number(values.groupingCount),
        continuousLoad: values.continuousLoad,
        targetDropPercent: Number(values.targetDropPercent),
      }),
    [values],
  );

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Cable Sizing Assistant"
      description="Shortlist a practical conductor size from load, length, environment, and installation method so the first-pass sizing work stays local and readable."
      actions={
        <button type="button" className="action-button" onClick={() => setValues(sampleState)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Sizing scope',
        body: 'This assistant is a quick shortlist for early engineering review. It applies simple derating factors and voltage-drop screening, but it is not a final code table or certification tool.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Zap size={16} />
              Sizing inputs
            </span>
            <span>Load, installation, and environment</span>
          </div>

          <div className="form-grid-two">
            {[
              ['Load current (A)', 'loadAmps'],
              ['System voltage (V)', 'systemVoltage'],
              ['Run length (m)', 'lengthMeters'],
              ['Ambient temp (C)', 'ambientC'],
              ['Grouping count', 'groupingCount'],
              ['Target drop (%)', 'targetDropPercent'],
            ].map(([label, key]) => (
              <label key={key} className="tool-field">
                <span>{label}</span>
                <input
                  className="tool-input"
                  type="number"
                  step="any"
                  value={String(values[key as keyof typeof values])}
                  onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                />
              </label>
            ))}

            <label className="tool-field">
              <span>Phase</span>
              <select
                className="tool-input tool-input--select"
                value={values.phase}
                onChange={(event) => setValues((current) => ({ ...current, phase: event.target.value as typeof values.phase }))}
              >
                <option value="Single-phase">Single-phase</option>
                <option value="Three-phase">Three-phase</option>
              </select>
            </label>

            <label className="tool-field">
              <span>Conductor material</span>
              <select
                className="tool-input tool-input--select"
                value={values.conductorMaterial}
                onChange={(event) =>
                  setValues((current) => ({ ...current, conductorMaterial: event.target.value as typeof values.conductorMaterial }))
                }
              >
                <option value="Copper">Copper</option>
                <option value="Aluminum">Aluminum</option>
              </select>
            </label>

            <label className="tool-field">
              <span>Insulation</span>
              <select
                className="tool-input tool-input--select"
                value={values.insulation}
                onChange={(event) => setValues((current) => ({ ...current, insulation: event.target.value as typeof values.insulation }))}
              >
                <option value="PVC 75C">PVC 75C</option>
                <option value="XLPE 90C">XLPE 90C</option>
              </select>
            </label>

            <label className="tool-field">
              <span>Install method</span>
              <select
                className="tool-input tool-input--select"
                value={values.installMethod}
                onChange={(event) =>
                  setValues((current) => ({ ...current, installMethod: event.target.value as typeof values.installMethod }))
                }
              >
                <option value="Conduit">Conduit</option>
                <option value="Cable tray">Cable tray</option>
                <option value="Free air">Free air</option>
              </select>
            </label>

            <label className="tool-field">
              <span>Continuous load</span>
              <select
                className="tool-input tool-input--select"
                value={values.continuousLoad ? 'yes' : 'no'}
                onChange={(event) => setValues((current) => ({ ...current, continuousLoad: event.target.value === 'yes' }))}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </label>
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Required current</span>
              <strong>{result.requiredCurrent.toFixed(1)} A</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Ambient factor</span>
              <strong>{result.ambientFactor.toFixed(2)}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Grouping factor</span>
              <strong>{result.groupingFactor.toFixed(2)}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Method factor</span>
              <strong>{result.methodFactor.toFixed(2)}</strong>
            </article>
          </div>

          <div className="tool-note">
            <h2 className="editor-panel__heading-with-icon">
              <Check size={16} />
              Recommended size
            </h2>
            {result.recommended ? (
              <div className="timestamp-output">
                <div className="timestamp-output__item">
                  <strong>{result.recommended.sizeMm2} mm2</strong>
                  <span>{result.recommended.adjustedAmpacity.toFixed(1)} A adjusted ampacity</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>Margin</strong>
                  <span>{result.recommended.marginAmps.toFixed(1)} A</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>Voltage drop</strong>
                  <span>{result.recommended.dropPercent.toFixed(2)}%</span>
                </div>
              </div>
            ) : (
              <p>{result.warning}</p>
            )}
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span>Candidate shortlist</span>
              <span>Smallest workable size is listed first</span>
            </div>
            <div className="docs-plain-list">
              {result.candidates.slice(0, 5).map((candidate) => (
                <article key={candidate.sizeMm2} className="docs-plain-item">
                  <p>
                    <strong>{candidate.sizeMm2} mm2</strong> <span className="chip chip--muted">{candidate.passes ? 'Pass' : 'Fail'}</span>
                  </p>
                  <p>
                    Base {candidate.baseAmpacity.toFixed(1)} A, adjusted {candidate.adjustedAmpacity.toFixed(1)} A, drop {candidate.dropPercent.toFixed(2)}%
                  </p>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </ToolFrame>
  );
}
