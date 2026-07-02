import { useEffect, useState } from 'react';
import { CalendarClock, Check, Copy, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { parseTimestamp } from '../lib/privacyTools';

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const currentUnixSeconds = Math.floor(currentTime / 1000);
  const currentUnixMilliseconds = currentTime;
  const currentUnixMicroseconds = `${BigInt(currentTime) * 1_000n}`;
  const currentUnixNanoseconds = `${BigInt(currentTime) * 1_000_000n}`;
  const parsed = parseTimestamp(timestamp);

  const copyOutput = async () => {
    if (!parsed.output) return;
    await navigator.clipboard.writeText(parsed.output.iso);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Timestamp Converter"
      description="Inspect Unix timestamps in seconds, milliseconds, microseconds, or nanoseconds and convert them into practical date formats."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={() => setTimestamp(String(currentUnixSeconds))}>
            Use current time
          </button>
          <button type="button" className="action-button" onClick={() => setTimestamp('')}>
            <Trash2 size={16} />
            Clear
          </button>
        </>
      }
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <CalendarClock size={16} />
              Current time
            </span>
            <span>Live</span>
          </div>

          <div className="timestamp-card-list">
            <div className="timestamp-card">
              <strong>Unix seconds</strong>
              <span>{currentUnixSeconds}</span>
            </div>
            <div className="timestamp-card">
              <strong>Unix milliseconds</strong>
              <span>{currentUnixMilliseconds}</span>
            </div>
            <div className="timestamp-card">
              <strong>Unix microseconds</strong>
              <span>{currentUnixMicroseconds}</span>
            </div>
            <div className="timestamp-card">
              <strong>Unix nanoseconds</strong>
              <span>{currentUnixNanoseconds}</span>
            </div>
          </div>

          <div className="editor-panel__head editor-panel__head--spaced">
            <span>Input timestamp</span>
            <span>Seconds, milliseconds, microseconds, or nanoseconds</span>
          </div>
          <input
            type="text"
            value={timestamp}
            onChange={(event) => setTimestamp(event.target.value)}
            className="tool-input"
            aria-label="Timestamp input"
            placeholder="1640000000, 1640000000000, 1640000000000000, or 1640000000000000000"
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Output</span>
            <button
              type="button"
              className="action-button action-button--icon"
              onClick={copyOutput}
              disabled={!parsed.output}
              aria-label="Copy ISO timestamp"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {parsed.error ? (
            <div className="editor-error">
              <strong>Invalid timestamp</strong>
              <p>{parsed.error}</p>
            </div>
          ) : parsed.output ? (
            <div className="stack-grid">
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Detected unit</span>
                  <strong>{parsed.output.detectedUnit}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Relative</span>
                  <strong>{parsed.output.relative}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Unix microseconds</span>
                  <strong>{parsed.output.unixMicroseconds}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Unix nanoseconds</span>
                  <strong>{parsed.output.unixNanoseconds}</strong>
                </article>
              </div>
              {parsed.output.precisionNote ? (
                <article className="insight-row insight-row--low">
                  <strong>Precision note</strong>
                  <p>{parsed.output.precisionNote}</p>
                </article>
              ) : null}
              <div className="timestamp-output">
                <div className="timestamp-output__item">
                  <strong>Local</strong>
                  <span>{parsed.output.local}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>UTC</strong>
                  <span>{parsed.output.utc}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>ISO 8601 / RFC 3339</strong>
                  <span>{parsed.output.iso}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>RFC 2822</strong>
                  <span>{parsed.output.rfc2822}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>Unix seconds</strong>
                  <span>{parsed.output.unixSeconds}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>Unix milliseconds</strong>
                  <span>{parsed.output.unixMilliseconds}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-panel-copy">Enter a timestamp to convert the value.</div>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
