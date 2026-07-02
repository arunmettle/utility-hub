import { useMemo, useState } from 'react';
import { Globe, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertTimeZones } from '../lib/privacyTools';

const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
const defaultZones = Array.from(
  new Set([localTimeZone, 'UTC', 'America/Los_Angeles', 'America/New_York', 'Europe/London', 'Asia/Kolkata', 'Australia/Brisbane']),
);

function isSupportedTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

export default function TimeZoneConverter() {
  const [input, setInput] = useState('2026-07-02T09:00:00Z');
  const [customZone, setCustomZone] = useState('');
  const [selectedZones, setSelectedZones] = useState(defaultZones);
  const [zoneError, setZoneError] = useState('');
  const result = useMemo(() => convertTimeZones(input, selectedZones), [input, selectedZones]);

  function addZone() {
    const normalizedZone = customZone.trim().replaceAll(' ', '_');
    if (!normalizedZone) {
      setZoneError('');
      return;
    }

    if (!isSupportedTimeZone(normalizedZone)) {
      setZoneError('Enter a valid IANA time zone like Europe/Berlin or Asia/Singapore.');
      return;
    }

    setSelectedZones((current) => (current.includes(normalizedZone) ? current : [...current, normalizedZone]));
    setCustomZone('');
    setZoneError('');
  }

  function removeZone(zone: string) {
    if (defaultZones.includes(zone)) {
      return;
    }

    setSelectedZones((current) => current.filter((item) => item !== zone));
  }

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Time Zone Converter"
      description="Turn one timestamp or date into a compact cross-time-zone view for handoffs, meetings, and release coordination."
      actions={
        <button
          type="button"
          className="action-button"
          onClick={() => {
            setInput('2026-07-02T09:00:00Z');
            setCustomZone('');
            setSelectedZones(defaultZones);
            setZoneError('');
          }}
        >
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Globe size={16} />
              Source time
            </span>
            <span>Timestamp or date string</span>
          </div>
          <input
            className="tool-input"
            aria-label="Time zone converter input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="2026-07-02T09:00:00Z or 1782982800"
          />
          <div className="editor-panel__head editor-panel__head--spaced">
            <span>Preset zones</span>
            <span>{selectedZones.length} selected views</span>
          </div>
          <div className="chip-list">
            {selectedZones.map((zone) => (
              <span key={zone} className="chip">
                {zone}
                {!defaultZones.includes(zone) ? (
                  <button
                    type="button"
                    className="chip__remove"
                    onClick={() => removeZone(zone)}
                    aria-label={`Remove ${zone}`}
                  >
                    Remove
                  </button>
                ) : null}
              </span>
            ))}
          </div>
          <div className="time-zone-converter__custom-row">
            <input
              className="tool-input"
              aria-label="Custom time zone"
              value={customZone}
              onChange={(event) => {
                setCustomZone(event.target.value);
                if (zoneError) {
                  setZoneError('');
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addZone();
                }
              }}
              placeholder="Add custom zone, for example Asia/Singapore"
            />
            <button type="button" className="action-button" onClick={addZone}>
              Add zone
            </button>
          </div>
          {zoneError ? <p className="field-hint field-hint--error">{zoneError}</p> : null}
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Time zone conversion issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="timestamp-output">
                <div className="timestamp-output__item">
                  <strong>Source local</strong>
                  <span>{result.output.sourceLocal}</span>
                  <p>{result.output.sourceIso}</p>
                </div>
              </div>
              <div className="timestamp-output">
                {result.output.rows.map((row) => (
                  <div key={row.timeZone} className="timestamp-output__item">
                    <strong>
                      {row.label} <small>{row.dayPeriod}</small>
                    </strong>
                    <span>{row.formatted}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-panel-copy">Enter a time to render it across common zones.</div>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
