import { useMemo, useState } from 'react';
import { Check, ClipboardList, Copy, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { buildPanelSchedule, type PanelPhase, type PanelScheduleRowInput } from '../lib/electricalTools';

const sampleRows: PanelScheduleRowInput[] = [
  { circuit: '1', description: 'Lighting north wing', loadWatts: 1800, breakerAmps: 10, phase: 'A' },
  { circuit: '2', description: 'Socket circuit office', loadWatts: 2400, breakerAmps: 16, phase: 'B' },
  { circuit: '3', description: 'Air handler', loadWatts: 5200, breakerAmps: 20, phase: '3Φ' },
  { circuit: '4', description: 'Server room UPS', loadWatts: 3000, breakerAmps: 16, phase: 'C' },
];

function buildScheduleSheet(rows: PanelScheduleRowInput[]) {
  return rows
    .map((row) => `${row.circuit}, ${row.description}, ${row.loadWatts} W, ${row.breakerAmps} A, ${row.phase}`)
    .join('\n');
}

export default function PanelScheduleBuilder() {
  const [rows, setRows] = useState(sampleRows);
  const [panelWays, setPanelWays] = useState('12');
  const [systemVoltage, setSystemVoltage] = useState('400');
  const [powerFactor, setPowerFactor] = useState('0.95');
  const [copied, setCopied] = useState(false);

  const result = useMemo(
    () => buildPanelSchedule(rows, Number(panelWays), Number(systemVoltage), Number(powerFactor)),
    [panelWays, powerFactor, rows, systemVoltage],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(buildScheduleSheet(rows));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Generator"
      title="Panel Schedule Builder"
      description="Keep a panel schedule readable, editable, and local by turning a small circuit list into phase totals, spare ways, and a clean summary."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy schedule'}
          </button>
          <button type="button" className="action-button" onClick={() => setRows(sampleRows)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Schedule scope',
        body: 'This is a lightweight planning surface for connected load, phase balance, and spare ways. It helps with early review and handoff, not with final protection coordination.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <ClipboardList size={16} />
              Panel settings
            </span>
            <span>Voltage, power factor, and panel ways</span>
          </div>

          <div className="form-grid-two">
            <label className="tool-field">
              <span>Panel ways</span>
              <input className="tool-input" type="number" value={panelWays} onChange={(event) => setPanelWays(event.target.value)} />
            </label>
            <label className="tool-field">
              <span>System voltage (V)</span>
              <input className="tool-input" type="number" value={systemVoltage} onChange={(event) => setSystemVoltage(event.target.value)} />
            </label>
            <label className="tool-field">
              <span>Power factor</span>
              <input className="tool-input" type="number" step="0.01" value={powerFactor} onChange={(event) => setPowerFactor(event.target.value)} />
            </label>
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Total load</span>
              <strong>{(result.totalWatts / 1000).toFixed(2)} kW</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Demand current</span>
              <strong>{result.estimatedDemandAmps.toFixed(1)} A</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Imbalance</span>
              <strong>{result.imbalancePercent.toFixed(1)}%</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Spare ways</span>
              <strong>{result.spareWays}</strong>
            </article>
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span>Circuits</span>
              <span>{result.occupiedWays} occupied ways</span>
            </div>

            <div className="docs-plain-list">
              {rows.map((row, index) => (
                <article key={row.circuit} className="docs-plain-item">
                  <div className="form-grid-two">
                    <label className="tool-field">
                      <span>Circuit</span>
                      <input
                        className="tool-input"
                        value={row.circuit}
                        onChange={(event) =>
                          setRows((current) =>
                            current.map((entry, rowIndex) => (rowIndex === index ? { ...entry, circuit: event.target.value } : entry)),
                          )
                        }
                      />
                    </label>
                    <label className="tool-field">
                      <span>Phase</span>
                      <select
                        className="tool-input tool-input--select"
                        value={row.phase}
                        onChange={(event) =>
                          setRows((current) =>
                            current.map((entry, rowIndex) =>
                              rowIndex === index ? { ...entry, phase: event.target.value as PanelPhase } : entry,
                            ),
                          )
                        }
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="3Φ">3Φ</option>
                      </select>
                    </label>
                    <label className="tool-field">
                      <span>Description</span>
                      <input
                        className="tool-input"
                        value={row.description}
                        onChange={(event) =>
                          setRows((current) =>
                            current.map((entry, rowIndex) => (rowIndex === index ? { ...entry, description: event.target.value } : entry)),
                          )
                        }
                      />
                    </label>
                    <label className="tool-field">
                      <span>Load (W)</span>
                      <input
                        className="tool-input"
                        type="number"
                        value={row.loadWatts}
                        onChange={(event) =>
                          setRows((current) =>
                            current.map((entry, rowIndex) =>
                              rowIndex === index ? { ...entry, loadWatts: Number(event.target.value) } : entry,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="tool-field">
                      <span>Breaker (A)</span>
                      <input
                        className="tool-input"
                        type="number"
                        value={row.breakerAmps}
                        onChange={(event) =>
                          setRows((current) =>
                            current.map((entry, rowIndex) =>
                              rowIndex === index ? { ...entry, breakerAmps: Number(event.target.value) } : entry,
                            ),
                          )
                        }
                      />
                    </label>
                  </div>
                  <p>Estimated current: {result.rows[index].estimatedCurrentAmps.toFixed(1)} A</p>
                </article>
              ))}
            </div>
          </section>

          <div className="tool-note">
            <h2 className="editor-panel__heading-with-icon">
              <Check size={16} />
              Phase summary
            </h2>
            <div className="timestamp-output">
              <div className="timestamp-output__item">
                <strong>Phase A</strong>
                <span>{result.phaseWatts.A.toFixed(0)} W / {result.phaseLoadsAmps.A.toFixed(1)} A</span>
              </div>
              <div className="timestamp-output__item">
                <strong>Phase B</strong>
                <span>{result.phaseWatts.B.toFixed(0)} W / {result.phaseLoadsAmps.B.toFixed(1)} A</span>
              </div>
              <div className="timestamp-output__item">
                <strong>Phase C</strong>
                <span>{result.phaseWatts.C.toFixed(0)} W / {result.phaseLoadsAmps.C.toFixed(1)} A</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ToolFrame>
  );
}
