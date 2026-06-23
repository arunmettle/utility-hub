import { useMemo, useState } from 'react';
import { RotateCcw, Workflow } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertDurationUnits } from '../lib/privacyTools';

export default function DurationConverter() {
  const [value, setValue] = useState('90');
  const [unit, setUnit] = useState<'milliseconds' | 'seconds' | 'minutes' | 'hours'>('seconds');
  const result = useMemo(() => convertDurationUnits(value, unit), [value, unit]);

  return (
    <ToolFrame eyebrow="Converter" title="Duration Converter" description="Convert milliseconds, seconds, minutes, and hours across common engineering time units." actions={<button type="button" className="action-button" onClick={() => { setValue('90'); setUnit('seconds'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Workflow size={16} />Input duration</span></div><div className="mode-toggle" role="tablist" aria-label="Duration unit">{(['milliseconds', 'seconds', 'minutes', 'hours'] as const).map((item) => <button key={item} type="button" className={unit === item ? 'is-active' : ''} onClick={() => setUnit(item)}>{item}</button>)}</div><input className="tool-input" value={value} onChange={(event) => setValue(event.target.value)} /></section>
        <section className="stack-grid">{result.error ? <div className="editor-error"><strong>Duration issue</strong><p>{result.error}</p></div> : result.output ? <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Milliseconds</span><strong>{result.output.milliseconds}</strong></article><article className="stat-card"><span className="stat-card__label">Seconds</span><strong>{result.output.seconds}</strong></article><article className="stat-card"><span className="stat-card__label">Minutes</span><strong>{result.output.minutes}</strong></article><article className="stat-card"><span className="stat-card__label">Hours</span><strong>{result.output.hours}</strong></article></div> : null}</section>
      </div>
    </ToolFrame>
  );
}
