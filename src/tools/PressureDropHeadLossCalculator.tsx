import { useMemo, useState } from 'react';
import { Gauge, RotateCcw, Waves } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { calculatePressureDrop } from '../lib/industryTools';

const sampleState = {
  flowLitersPerSecond: '18',
  diameterMillimeters: '150',
  lengthMeters: '120',
  roughnessMillimeters: '0.15',
  fluidDensity: '998',
  dynamicViscosity: '0.001',
  fittingsK: '8',
  elevationChangeMeters: '4',
};

export default function PressureDropHeadLossCalculator() {
  const [values, setValues] = useState(sampleState);

  const result = useMemo(
    () =>
      calculatePressureDrop({
        flowLitersPerSecond: Number(values.flowLitersPerSecond),
        diameterMillimeters: Number(values.diameterMillimeters),
        lengthMeters: Number(values.lengthMeters),
        roughnessMillimeters: Number(values.roughnessMillimeters),
        fluidDensity: Number(values.fluidDensity),
        dynamicViscosity: Number(values.dynamicViscosity),
        fittingsK: Number(values.fittingsK),
        elevationChangeMeters: Number(values.elevationChangeMeters),
      }),
    [values],
  );

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Pressure Drop & Head Loss Calculator"
      description="Estimate velocity, Reynolds number, head loss, and total pressure drop for water-like pipe flows using a local browser-side Darcy-Weisbach workflow."
      actions={
        <button type="button" className="action-button" onClick={() => setValues(sampleState)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Engineering note',
        body: 'This MVP is aimed at quick sanity checks for water-like fluids in closed pipe runs. It is useful for civil, HVAC, mechanical, and mining workflows, but it does not replace detailed design software.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Waves size={16} />
              Inputs
            </span>
            <span>Pipe, fluid, and fittings</span>
          </div>
          <div className="form-grid-two">
            {[
              ['Flow (L/s)', 'flowLitersPerSecond'],
              ['Diameter (mm)', 'diameterMillimeters'],
              ['Length (m)', 'lengthMeters'],
              ['Roughness (mm)', 'roughnessMillimeters'],
              ['Density (kg/m3)', 'fluidDensity'],
              ['Viscosity (Pa.s)', 'dynamicViscosity'],
              ['Fittings K', 'fittingsK'],
              ['Elevation change (m)', 'elevationChangeMeters'],
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
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Velocity</span>
              <strong>{result.velocity.toFixed(2)} m/s</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Reynolds</span>
              <strong>{result.reynoldsNumber.toFixed(0)}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Friction factor</span>
              <strong>{result.frictionFactor.toFixed(4)}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Total drop</span>
              <strong>{result.totalPressureDropKPa.toFixed(2)} kPa</strong>
            </article>
          </div>

          <div className="tool-note">
            <h2 className="editor-panel__heading-with-icon">
              <Gauge size={16} />
              Head loss breakdown
            </h2>
            <div className="timestamp-output">
              <div className="timestamp-output__item">
                <strong>Friction head</strong>
                <span>{result.frictionHeadLoss.toFixed(2)} m</span>
              </div>
              <div className="timestamp-output__item">
                <strong>Minor loss</strong>
                <span>{result.minorHeadLoss.toFixed(2)} m</span>
              </div>
              <div className="timestamp-output__item">
                <strong>Static head</strong>
                <span>{result.staticHead.toFixed(2)} m</span>
              </div>
              <div className="timestamp-output__item">
                <strong>Total head loss</strong>
                <span>{result.totalHeadLoss.toFixed(2)} m</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ToolFrame>
  );
}

