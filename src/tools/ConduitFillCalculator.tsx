import { useMemo, useState } from 'react';
import { RotateCcw, Table2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { calculateConduitFill, type FillRule } from '../lib/electricalTools';

const sampleRows = `cableSizeMm2,quantity,description
2.5,6,Lighting radial
4,3,Power radial
6,1,Control feeder
10,1,Spare`;

const fillOptions: FillRule[] = ['Single cable (53%)', 'Two conductors (31%)', 'Multiple conductors (40%)'];

export default function ConduitFillCalculator() {
  const [rows, setRows] = useState(sampleRows);
  const [conduitSizeMm, setConduitSizeMm] = useState('32');
  const [fillRule, setFillRule] = useState<FillRule>('Multiple conductors (40%)');

  const result = useMemo(
    () => calculateConduitFill(rows, Number(conduitSizeMm), fillRule),
    [conduitSizeMm, fillRule, rows],
  );

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Conduit Fill Calculator"
      description="Check a quick conduit fill estimate from a browser-local cable list so routing decisions stay lightweight before they turn into a spreadsheet exercise."
      actions={
        <button type="button" className="action-button" onClick={() => { setRows(sampleRows); setConduitSizeMm('32'); setFillRule('Multiple conductors (40%)'); }}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Fill-check scope',
        body: 'This screen uses an approximate effective-area model for quick planning only. It helps with early conduit decisions, but it should not replace the final code reference or manufacturer data.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Table2 size={16} />
              Cable rows
            </span>
            <span>CSV: cableSizeMm2, quantity, description</span>
          </div>

          <textarea className="editor-textarea editor-textarea--compact" value={rows} onChange={(event) => setRows(event.target.value)} />

          <div className="form-grid-two" style={{ marginTop: 16 }}>
            <label className="tool-field">
              <span>Conduit size (mm)</span>
              <select className="tool-input tool-input--select" value={conduitSizeMm} onChange={(event) => setConduitSizeMm(event.target.value)}>
                {['20', '25', '32', '40', '50', '63', '80'].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            <label className="tool-field">
              <span>Fill rule</span>
              <select className="tool-input tool-input--select" value={fillRule} onChange={(event) => setFillRule(event.target.value as FillRule)}>
                {fillOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Conduit fill issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Fill</span>
                  <strong>{result.output.fillPercent.toFixed(1)}%</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Allowed</span>
                  <strong>{result.output.limitPercent.toFixed(0)}%</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Total area</span>
                  <strong>{result.output.totalAreaMm2.toFixed(1)} mm2</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Status</span>
                  <strong>{result.output.status}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Row breakdown</span>
                  <span>{result.output.rows.length} conductors tracked</span>
                </div>
                <div className="docs-plain-list">
                  {result.output.rows.map((row) => (
                    <article key={`${row.cableSizeMm2}-${row.description}`} className="docs-plain-item">
                      <p>
                        <strong>{row.cableSizeMm2} mm2</strong> x {row.quantity}
                      </p>
                      <p>
                        Area {row.effectiveAreaMm2.toFixed(1)} mm2 each, line area {row.lineAreaMm2.toFixed(1)} mm2
                      </p>
                      {row.description ? <p>{row.description}</p> : null}
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
