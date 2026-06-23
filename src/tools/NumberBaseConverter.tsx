import { useMemo, useState } from 'react';
import { Binary, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertNumberBases } from '../lib/privacyTools';

export default function NumberBaseConverter() {
  const [base, setBase] = useState<2 | 8 | 10 | 16>(10);
  const [input, setInput] = useState('255');
  const result = useMemo(() => convertNumberBases(input, base), [input, base]);

  return (
    <ToolFrame eyebrow="Converter" title="Number Base Converter" description="Convert integers across binary, octal, decimal, and hexadecimal representations." actions={<button type="button" className="action-button" onClick={() => { setBase(10); setInput('255'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Binary size={16} />Input</span><span>Choose the source base</span></div><div className="mode-toggle" role="tablist" aria-label="Number base mode">{([2, 8, 10, 16] as const).map((item) => <button key={item} type="button" className={base === item ? 'is-active' : ''} onClick={() => setBase(item)}>{item}</button>)}</div><input className="tool-input" value={input} onChange={(event) => setInput(event.target.value)} /></section><section className="stack-grid">{result.error ? <div className="editor-error"><strong>Base issue</strong><p>{result.error}</p></div> : result.output ? <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Binary</span><strong>{result.output.binary}</strong></article><article className="stat-card"><span className="stat-card__label">Octal</span><strong>{result.output.octal}</strong></article><article className="stat-card"><span className="stat-card__label">Decimal</span><strong>{result.output.decimal}</strong></article><article className="stat-card"><span className="stat-card__label">Hex</span><strong>{result.output.hexadecimal}</strong></article></div> : null}</section></div>
    </ToolFrame>
  );
}
