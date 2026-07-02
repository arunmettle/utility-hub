import { useMemo, useState } from 'react';
import { Clock3, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { calculateTimestampOffset, type DurationUnit } from '../lib/privacyTools';

const durationUnits: DurationUnit[] = ['seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'];

export default function ExpiryTimeCalculator() {
  const [baseValue, setBaseValue] = useState('1718625600');
  const [amount, setAmount] = useState('90');
  const [unit, setUnit] = useState<DurationUnit>('minutes');
  const [direction, setDirection] = useState<'add' | 'subtract'>('add');
  const result = useMemo(() => calculateTimestampOffset(baseValue, amount, unit, direction), [baseValue, amount, unit, direction]);

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Expiry Time Calculator"
      description="Add or subtract a duration from a timestamp or date and get the resulting expiry instant in practical formats."
      actions={
        <button
          type="button"
          className="action-button"
          onClick={() => {
            setBaseValue('1718625600');
            setAmount('90');
            setUnit('minutes');
            setDirection('add');
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
              <Clock3 size={16} />
              Base time
            </span>
            <span>Timestamp or date string</span>
          </div>
          <input
            className="tool-input"
            aria-label="Base time input"
            value={baseValue}
            onChange={(event) => setBaseValue(event.target.value)}
            placeholder="1718625600 or 2026-07-02T09:00:00Z"
          />
          <div className="editor-panel__head editor-panel__head--spaced">
            <span>Offset</span>
            <span>Add or subtract a duration</span>
          </div>
          <div className="stack-grid">
            <div className="mode-toggle" role="tablist" aria-label="Expiry calculator direction">
              {(['add', 'subtract'] as const).map((option) => (
                <button key={option} type="button" className={direction === option ? 'is-active' : ''} onClick={() => setDirection(option)}>
                  {option}
                </button>
              ))}
            </div>
            <input
              className="tool-input"
              aria-label="Offset amount input"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="90"
            />
            <div className="mode-toggle" role="tablist" aria-label="Expiry calculator unit">
              {durationUnits.map((item) => (
                <button key={item} type="button" className={unit === item ? 'is-active' : ''} onClick={() => setUnit(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Expiry calculation issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Operation</span>
                  <strong>
                    {result.output.direction} {result.output.amount} {result.output.unit}
                  </strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Delta</span>
                  <strong>{result.output.deltaHuman}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Unix seconds</span>
                  <strong>{result.output.unixSeconds}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Unix milliseconds</span>
                  <strong>{result.output.unixMilliseconds}</strong>
                </article>
              </div>
              <div className="timestamp-output">
                <div className="timestamp-output__item">
                  <strong>Base time</strong>
                  <span>{result.output.baseLocal}</span>
                  <p>{result.output.baseIso}</p>
                </div>
                <div className="timestamp-output__item">
                  <strong>Result time</strong>
                  <span>{result.output.resultLocal}</span>
                  <p>{result.output.resultIso}</p>
                </div>
                <div className="timestamp-output__item">
                  <strong>Unix microseconds</strong>
                  <span>{result.output.unixMicroseconds}</span>
                </div>
                <div className="timestamp-output__item">
                  <strong>Unix nanoseconds</strong>
                  <span>{result.output.unixNanoseconds}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-panel-copy">Enter a base time and offset to calculate an expiry instant.</div>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
