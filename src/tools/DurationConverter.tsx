import { useMemo, useState } from 'react';
import { RotateCcw, Workflow } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertDurationUnits, type DurationUnit } from '../lib/privacyTools';

const durationUnits: DurationUnit[] = ['milliseconds', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'months', 'years'];

const referenceRows = [
  ['1 hour', '3,600 seconds'],
  ['1 day', '86,400 seconds'],
  ['1 week', '604,800 seconds'],
  ['1 month', '2,592,000 seconds (30 days)'],
  ['1 year', '31,536,000 seconds (365 days)'],
];

export default function DurationConverter() {
  const [value, setValue] = useState('90');
  const [unit, setUnit] = useState<DurationUnit>('seconds');
  const result = useMemo(() => convertDurationUnits(value, unit), [value, unit]);

  return (
    <ToolFrame eyebrow="Converter" title="Duration Converter" description="Convert engineering durations across milliseconds, seconds, minutes, hours, days, weeks, months, and years." actions={<button type="button" className="action-button" onClick={() => { setValue('90'); setUnit('seconds'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Workflow size={16} />Input duration</span><span>Choose a source unit</span></div><div className="mode-toggle" role="tablist" aria-label="Duration unit">{durationUnits.map((item) => <button key={item} type="button" className={unit === item ? 'is-active' : ''} onClick={() => setUnit(item)}>{item}</button>)}</div><input className="tool-input" aria-label="Duration input" value={value} onChange={(event) => setValue(event.target.value)} /></section>
        <section className="stack-grid">{result.error ? <div className="editor-error"><strong>Duration issue</strong><p>{result.error}</p></div> : result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Milliseconds</span><strong>{result.output.milliseconds}</strong></article><article className="stat-card"><span className="stat-card__label">Seconds</span><strong>{result.output.seconds}</strong></article><article className="stat-card"><span className="stat-card__label">Minutes</span><strong>{result.output.minutes}</strong></article><article className="stat-card"><span className="stat-card__label">Hours</span><strong>{result.output.hours}</strong></article><article className="stat-card"><span className="stat-card__label">Days</span><strong>{result.output.days}</strong></article><article className="stat-card"><span className="stat-card__label">Weeks</span><strong>{result.output.weeks}</strong></article><article className="stat-card"><span className="stat-card__label">Months</span><strong>{result.output.months}</strong></article><article className="stat-card"><span className="stat-card__label">Years</span><strong>{result.output.years}</strong></article></div><section className="editor-panel"><div className="editor-panel__head"><span>Human-readable seconds</span><span>Quick reference</span></div><div className="timestamp-output">{referenceRows.map(([label, detail]) => <div key={label} className="timestamp-output__item"><strong>{label}</strong><span>{detail}</span></div>)}</div></section></> : null}</section>
      </div>
    </ToolFrame>
  );
}
