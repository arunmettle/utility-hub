import { useMemo, useState } from 'react';
import { Palette, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateColorPalette } from '../lib/privacyTools';

export default function ColorPaletteGenerator() {
  const [input, setInput] = useState('#177E89');
  const result = useMemo(() => generateColorPalette(input), [input]);

  return (
    <ToolFrame eyebrow="Generator" title="Color Palette Generator" description="Generate a small palette from a base color for UI exploration, docs, and quick theme sketches." actions={<button type="button" className="action-button" onClick={() => setInput('#177E89')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Palette size={16} />Base color</span></div><input className="tool-input" value={input} onChange={(event) => setInput(event.target.value)} /></section>
        <section className="stack-grid">{result.error ? <div className="editor-error"><strong>Palette issue</strong><p>{result.error}</p></div> : <div className="chip-list">{result.output?.values.map((item) => <span key={item.label} className="chip">{item.label}: {item.hex}</span>)}</div>}</section>
      </div>
    </ToolFrame>
  );
}
