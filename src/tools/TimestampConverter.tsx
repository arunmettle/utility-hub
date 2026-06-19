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
      description="Convert Unix timestamps in seconds or milliseconds into human-readable date formats instantly."
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
          </div>

          <div className="editor-panel__head editor-panel__head--spaced">
            <span>Input timestamp</span>
            <span>Seconds or milliseconds</span>
          </div>
          <input
            type="text"
            value={timestamp}
            onChange={(event) => setTimestamp(event.target.value)}
            className="tool-input"
            placeholder="1640000000 or 1640000000000"
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Output</span>
            <button type="button" className="action-button action-button--icon" onClick={copyOutput} disabled={!parsed.output}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {parsed.error ? (
            <div className="editor-error">
              <strong>Invalid timestamp</strong>
              <p>{parsed.error}</p>
            </div>
          ) : parsed.output ? (
            <div className="timestamp-output">
              <div className="timestamp-output__item">
                <strong>Local</strong>
                <span>{parsed.output.local}</span>
              </div>
              <div className="timestamp-output__item">
                <strong>ISO</strong>
                <span>{parsed.output.iso}</span>
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
          ) : (
            <div className="empty-panel-copy">Enter a timestamp to convert the value.</div>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
