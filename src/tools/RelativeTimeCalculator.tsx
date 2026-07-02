import { useEffect, useMemo, useState } from 'react';
import { Hourglass, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { calculateRelativeTime } from '../lib/privacyTools';

export default function RelativeTimeCalculator() {
  const [input, setInput] = useState('2026-07-10T17:00:00Z');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const handle = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(handle);
  }, []);

  const result = useMemo(() => calculateRelativeTime(input, now), [input, now]);

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Relative Time Calculator"
      description="See how far away a deadline or past event is in human terms, plus the exact gap in seconds, hours, days, and weeks."
      actions={
        <button type="button" className="action-button" onClick={() => setInput('2026-07-10T17:00:00Z')}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Hourglass size={16} />
              Target time
            </span>
            <span>Timestamp or date string</span>
          </div>
          <input
            className="tool-input"
            aria-label="Relative time input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="2026-07-10T17:00:00Z or 1783702800"
          />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Relative time issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Relative</span>
                  <strong>{result.output.relative}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Direction</span>
                  <strong>{result.output.direction}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Human gap</span>
                  <strong>{result.output.human}</strong>
                </article>
              </div>
              <div className="timestamp-output">
                <div className="timestamp-output__item">
                  <strong>Target time</strong>
                  <span>{result.output.targetLocal}</span>
                  <p>{result.output.targetIso}</p>
                </div>
                <div className="timestamp-output__item">
                  <strong>Seconds</strong>
                  <span>{result.output.seconds}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>Hours</strong>
                  <span>{result.output.hours}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>Days</strong>
                  <span>{result.output.days}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>Weeks</strong>
                  <span>{result.output.weeks}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-panel-copy">Enter a target time to see how far away it is.</div>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
