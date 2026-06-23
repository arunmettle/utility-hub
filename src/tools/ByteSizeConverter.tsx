import { useMemo, useState } from 'react';
import { BarChart3, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertByteSize } from '../lib/privacyTools';

export default function ByteSizeConverter() {
  const [unit, setUnit] = useState<'bytes' | 'kb' | 'mb' | 'gb'>('bytes');
  const [input, setInput] = useState('1048576');
  const result = useMemo(() => convertByteSize(input, unit), [input, unit]);

  return (
    <ToolFrame eyebrow="Converter" title="Byte Size Converter" description="Convert file sizes and payload sizes across bytes, KB, MB, and GB." actions={<button type="button" className="action-button" onClick={() => { setUnit('bytes'); setInput('1048576'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><BarChart3 size={16} />Input</span><span>Select source unit</span></div><div className="mode-toggle" role="tablist" aria-label="Byte size input unit">{(['bytes', 'kb', 'mb', 'gb'] as const).map((item) => <button key={item} type="button" className={unit === item ? 'is-active' : ''} onClick={() => setUnit(item)}>{item.toUpperCase()}</button>)}</div><input className="tool-input" value={input} onChange={(event) => setInput(event.target.value)} /></section><section className="stack-grid">{result.error ? <div className="editor-error"><strong>Size issue</strong><p>{result.error}</p></div> : result.output ? <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Bytes</span><strong>{result.output.bytes}</strong></article><article className="stat-card"><span className="stat-card__label">KB</span><strong>{result.output.kilobytes}</strong></article><article className="stat-card"><span className="stat-card__label">MB</span><strong>{result.output.megabytes}</strong></article><article className="stat-card"><span className="stat-card__label">GB</span><strong>{result.output.gigabytes}</strong></article></div> : null}</section></div>
    </ToolFrame>
  );
}
