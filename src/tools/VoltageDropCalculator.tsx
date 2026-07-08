import { useMemo, useState } from 'react';
import { Gauge, RotateCcw, Zap } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { calculateVoltageDrop } from '../lib/electricalTools';

const sampleState = {
  currentAmps: '42',
  lengthMeters: '85',
  systemVoltage: '400',
  phase: 'Three-phase' as const,
  conductorSizeMm2: '25',
  conductorMaterial: 'Copper' as const,
  targetDropPercent: '3',
};

export default function VoltageDropCalculator() {
  const [values, setValues] = useState(sampleState);

  const result = useMemo(
    () =>
      calculateVoltageDrop({
        currentAmps: Number(values.currentAmps),
        lengthMeters: Number(values.lengthMeters),
        systemVoltage: Number(values.systemVoltage),
        phase: values.phase,
        conductorSizeMm2: Number(values.conductorSizeMm2),
        conductorMaterial: values.conductorMaterial,
        targetDropPercent: Number(values.targetDropPercent),
      }),
    [values],
  );

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Voltage Drop Calculator"
      description="Estimate line drop, drop percent, and a practical maximum length for a selected cable size using a browser-local electrical check."
      actions={
        <button type="button" className="action-button" onClick={() => setValues(sampleState)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Voltage-drop scope',
        body: 'This is a quick engineering screen for single-phase or three-phase sanity checks. It uses a small local resistance table and is not a code-compliance engine.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Zap size={16} />
              Electrical inputs
            </span>
            <span>Current, distance, cable, and system voltage</span>
          </div>

          <div className="form-grid-two">
            {[
              ['Load current (A)', 'currentAmps'],
              ['Run length (m)', 'lengthMeters'],
              ['System voltage (V)', 'systemVoltage'],
              ['Cable size (mm2)', 'conductorSizeMm2'],
              ['Target drop (%)', 'targetDropPercent'],
            ].map(([label, key]) => (
              <label key={key} className="tool-field">
                <span>{label}</span>
                <input
                  className="tool-input"
                  type="number"
                  step="any"
                  value={values[key as keyof typeof values]}
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
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Drop</span>
              <strong>{result.dropVolts.toFixed(2)} V</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Drop percent</span>
              <strong>{result.dropPercent.toFixed(2)}%</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Resistance</span>
              <strong>{result.resistanceOhmPerKm.toFixed(3)} ohm/km</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Max length</span>
              <strong>{result.maxRecommendedLengthMeters.toFixed(1)} m</strong>
            </article>
          </div>

          <div className="tool-note">
            <h2 className="editor-panel__heading-with-icon">
              <Gauge size={16} />
              Limit check
            </h2>
            <div className="timestamp-output">
              <div className="timestamp-output__item">
                <strong>Status</strong>
                <span>{result.status}</span>
              </div>
              <div className="timestamp-output__item">
                <strong>Target drop</strong>
                <span>{result.targetDropPercent.toFixed(1)}%</span>
              </div>
              <div className="timestamp-output__item">
                <strong>Length tested</strong>
                <span>{Number(values.lengthMeters).toFixed(1)} m</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ToolFrame>
  );
}
