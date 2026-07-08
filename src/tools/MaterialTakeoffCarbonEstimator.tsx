import { useMemo, useState } from 'react';
import { BarChart3, Check, ClipboardList, Copy, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { estimateMaterialTakeoffCarbon } from '../lib/industryTools';

const sampleTakeoff = `item,quantity,unit,carbonFactorKgCo2e,description
Concrete C32/40,12,m3,320,Footing and slab concrete
Rebar N16,1.8,tonne,1850,Reinforcement steel
Road base,24,tonne,45,Subbase layer
Asphalt,8,tonne,95,Carriageway surfacing`;

export default function MaterialTakeoffCarbonEstimator() {
  const [input, setInput] = useState(sampleTakeoff);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => estimateMaterialTakeoffCarbon(input), [input]);

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Material Takeoff + Carbon Estimator"
      description="Estimate embodied carbon from a simple takeoff table so early civil comparisons stay local, transparent, and quick enough for tender or concept-stage review."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy} disabled={!result.output}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy summary'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleTakeoff)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Takeoff scope',
        body: 'This MVP assumes a simple CSV with item, quantity, unit, and carbon factor columns. It is meant for fast quantity comparison, not a live environmental database or a full estimating platform.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <ClipboardList size={16} />
              Takeoff rows
            </span>
            <span>CSV: item, quantity, unit, carbonFactorKgCo2e, description</span>
          </div>
          <textarea
            className="editor-textarea editor-textarea--compact"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="item,quantity,unit,carbonFactorKgCo2e,description"
          />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Takeoff issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Rows</span>
                  <strong>{result.output.rows.length}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Quantity</span>
                  <strong>{result.output.totalQuantity.toFixed(2)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Carbon</span>
                  <strong>{result.output.totalCarbonKgCo2e.toFixed(2)} kgCO2e</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Avg factor</span>
                  <strong>{result.output.averageCarbonFactor.toFixed(2)}</strong>
                </article>
              </div>

              <div className="tool-note">
                <h2 className="editor-panel__heading-with-icon">
                  <BarChart3 size={16} />
                  Carbon breakdown
                </h2>
                <div className="docs-plain-list">
                  {result.output.rows.map((row) => (
                    <article key={`${row.item}-${row.unit}`} className="docs-plain-item">
                      <p>
                        <strong>{row.item}</strong>
                      </p>
                      <p>
                        {row.quantity.toFixed(2)} {row.unit} at {row.carbonFactor.toFixed(2)} kgCO2e per unit = {row.lineCarbon.toFixed(2)} kgCO2e
                      </p>
                      {row.description ? <p>{row.description}</p> : null}
                    </article>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
