import { useMemo, useState } from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertColorFormats } from '../lib/privacyTools';

export default function ColorFormatConverter() {
  const [input, setInput] = useState('#177E89');
  const result = useMemo(() => convertColorFormats(input), [input]);

  return (
    <ToolFrame eyebrow="Converter" title="Color Format Converter" description="Convert hex, RGB, and HSL color values when moving between design specs, CSS, and code." actions={<button type="button" className="action-button" onClick={() => setInput('#177E89')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Palette size={16} />Input color</span><span>Hex, rgb(...), or hsl(...)</span></div><input className="tool-input" value={input} onChange={(event) => setInput(event.target.value)} /></section><section className="stack-grid">{result.error ? <div className="editor-error"><strong>Color issue</strong><p>{result.error}</p></div> : result.output ? <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">HEX</span><strong>{result.output.hex}</strong></article><article className="stat-card"><span className="stat-card__label">RGB</span><strong>{result.output.rgb}</strong></article><article className="stat-card"><span className="stat-card__label">HSL</span><strong>{result.output.hsl}</strong></article></div> : null}</section></div>
    </ToolFrame>
  );
}
