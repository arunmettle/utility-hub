import { BarChart3, Check, Copy, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import ToolFrame from '../components/ToolFrame';
import { calculateEarthworksBalance, type EarthworksBalanceInput } from '../lib/civilTools';

const sampleState: EarthworksBalanceInput = {
  cutVolumeM3: 2400,
  fillVolumeM3: 2100,
  swellPercent: 18,
  shrinkPercent: 8,
};

export default function EarthworksBalanceCalculator() {
  const [values, setValues] = useState(sampleState);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => calculateEarthworksBalance(values), [values]);

  const copyReport = async () => {
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Planner"
      title="Earthworks Balance Calculator"
      description="Screen cut, fill, swell, and shrink in one local pass so balance checks are easier to read during tender and design review."
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
        title: 'Earthworks scope',
        body: 'This tool is a lightweight balance screen. It keeps the math visible for early planning and does not replace a detailed haul or mass-haul model.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <BarChart3 size={16} />
              Inputs
            </span>
            <span>Volumes and factors</span>
          </div>

          <div className="stack-grid">
            <label className="tool-field">
              <span>Cut volume (m3)</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.cutVolumeM3}
                onChange={(event) => setValues((current) => ({ ...current, cutVolumeM3: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Fill volume (m3)</span>
              <input
                className="tool-input"
                type="number"
                step="1"
                value={values.fillVolumeM3}
                onChange={(event) => setValues((current) => ({ ...current, fillVolumeM3: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Swell factor (%)</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.swellPercent}
                onChange={(event) => setValues((current) => ({ ...current, swellPercent: Number(event.target.value) }))}
              />
            </label>
            <label className="tool-field">
              <span>Shrink factor (%)</span>
              <input
                className="tool-input"
                type="number"
                step="0.1"
                value={values.shrinkPercent}
                onChange={(event) => setValues((current) => ({ ...current, shrinkPercent: Number(event.target.value) }))}
              />
            </label>
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Loose cut</span>
              <strong>{result.looseCutVolumeM3.toFixed(1)} m3</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Fill need</span>
              <strong>{result.compactedFillRequirementM3.toFixed(1)} m3</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Net balance</span>
              <strong>{result.netLooseBalanceM3.toFixed(1)} m3</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Type</span>
              <strong>{result.balanceType}</strong>
            </article>
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span className="editor-panel__heading-with-icon">
                <BarChart3 size={16} />
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
