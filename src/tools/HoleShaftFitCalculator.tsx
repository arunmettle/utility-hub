import { useMemo, useState } from 'react';
import { Gauge, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { calculateHoleShaftFit } from '../lib/industryTools';

const defaults = {
  holeNominal: '25',
  holePlusTol: '0.021',
  holeMinusTol: '0',
  shaftNominal: '25',
  shaftPlusTol: '0',
  shaftMinusTol: '0.013',
};

export default function HoleShaftFitCalculator() {
  const [values, setValues] = useState(defaults);
  const result = useMemo(
    () =>
      calculateHoleShaftFit({
        holeNominal: Number(values.holeNominal),
        holePlusTol: Number(values.holePlusTol),
        holeMinusTol: Number(values.holeMinusTol),
        shaftNominal: Number(values.shaftNominal),
        shaftPlusTol: Number(values.shaftPlusTol),
        shaftMinusTol: Number(values.shaftMinusTol),
      }),
    [values],
  );

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Hole/Shaft Fit Calculator"
      description="Calculate the min and max clearance or interference between a hole and shaft pair so fit decisions are faster than flipping between handbook tables and ad hoc spreadsheets."
      actions={
        <button type="button" className="action-button" onClick={() => setValues(defaults)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Fit note',
        body: 'This tool classifies the result as clearance, interference, or transition based on your numeric limits. It does not yet infer ISO fit classes from shorthand callouts like H7/h6.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Hole values</span>
            <span>Nominal and tolerances</span>
          </div>
          <div className="form-grid-two">
            {[
              ['Hole nominal', 'holeNominal'],
              ['Hole +tol', 'holePlusTol'],
              ['Hole -tol', 'holeMinusTol'],
              ['Shaft nominal', 'shaftNominal'],
              ['Shaft +tol', 'shaftPlusTol'],
              ['Shaft -tol', 'shaftMinusTol'],
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
              <span className="stat-card__label">Fit class</span>
              <strong>{result.fitType}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Min clearance</span>
              <strong>{result.minClearance.toFixed(3)}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Max clearance</span>
              <strong>{result.maxClearance.toFixed(3)}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Window</span>
              <strong>{result.windowMicrons.toFixed(1)} um</strong>
            </article>
          </div>

          <div className="tool-note">
            <h2 className="editor-panel__heading-with-icon">
              <Gauge size={16} />
              Limits
            </h2>
            <div className="timestamp-output">
              <div className="timestamp-output__item">
                <strong>Hole min/max</strong>
                <span>
                  {result.holeMin.toFixed(3)} / {result.holeMax.toFixed(3)}
                </span>
              </div>
              <div className="timestamp-output__item">
                <strong>Shaft min/max</strong>
                <span>
                  {result.shaftMin.toFixed(3)} / {result.shaftMax.toFixed(3)}
                </span>
              </div>
              <div className="timestamp-output__item">
                <strong>Interpretation</strong>
                <span>{result.interpretation}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ToolFrame>
  );
}
