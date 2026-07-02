import { useMemo, useState } from 'react';
import { CalendarRange, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { calculateDateDifference } from '../lib/privacyTools';

const sampleStart = '1718625600';
const sampleEnd = '1718712000';

export default function DateDifferenceCalculator() {
  const [startValue, setStartValue] = useState(sampleStart);
  const [endValue, setEndValue] = useState(sampleEnd);
  const result = useMemo(() => calculateDateDifference(startValue, endValue), [startValue, endValue]);

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Date Difference Calculator"
      description="Compare two timestamps or date strings and see the exact gap in seconds, hours, days, and weeks."
      actions={
        <button
          type="button"
          className="action-button"
          onClick={() => {
            setStartValue(sampleStart);
            setEndValue(sampleEnd);
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
              <CalendarRange size={16} />
              Compare two values
            </span>
            <span>Unix timestamps or date strings</span>
          </div>
          <div className="stack-grid">
            <div>
              <div className="editor-panel__head editor-panel__head--spaced">
                <span>Start</span>
                <span>Earlier value</span>
              </div>
              <input
                className="tool-input"
                aria-label="Start date input"
                value={startValue}
                onChange={(event) => setStartValue(event.target.value)}
                placeholder="1718625600 or 2026-07-01T09:00:00Z"
              />
            </div>
            <div>
              <div className="editor-panel__head editor-panel__head--spaced">
                <span>End</span>
                <span>Later value</span>
              </div>
              <input
                className="tool-input"
                aria-label="End date input"
                value={endValue}
                onChange={(event) => setEndValue(event.target.value)}
                placeholder="1718712000 or 2026-07-02T09:00:00Z"
              />
            </div>
          </div>
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Date difference issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Direction</span>
                  <strong>
                    {result.output.direction === 'forward'
                      ? 'End is later'
                      : result.output.direction === 'backward'
                        ? 'End is earlier'
                        : 'Same instant'}
                  </strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Human gap</span>
                  <strong>{result.output.human}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Hours</span>
                  <strong>{result.output.hours}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Days</span>
                  <strong>{result.output.days}</strong>
                </article>
              </div>
              <div className="timestamp-output">
                <div className="timestamp-output__item">
                  <strong>Start</strong>
                  <span>{result.output.startLocal}</span>
                  <p>{result.output.startIso}</p>
                </div>
                <div className="timestamp-output__item">
                  <strong>End</strong>
                  <span>{result.output.endLocal}</span>
                  <p>{result.output.endIso}</p>
                </div>
                <div className="timestamp-output__item">
                  <strong>Milliseconds</strong>
                  <span>{result.output.milliseconds}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>Seconds</strong>
                  <span>{result.output.seconds}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>Minutes</strong>
                  <span>{result.output.minutes}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>Weeks</strong>
                  <span>{result.output.weeks}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-panel-copy">Enter a start and end value to compare the gap.</div>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
