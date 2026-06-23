import { useMemo, useState } from 'react';
import { Languages, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertRomanNumeral } from '../lib/privacyTools';

export default function RomanNumeralConverter() {
  const [input, setInput] = useState('42');
  const result = useMemo(() => convertRomanNumeral(input), [input]);

  return (
    <ToolFrame eyebrow="Converter" title="Roman Numeral Converter" description="Convert Arabic numbers to Roman numerals or decode Roman numerals back into integers." actions={<button type="button" className="action-button" onClick={() => setInput('42')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Languages size={16} />Input</span><span>Number or Roman numeral</span></div><input className="tool-input" value={input} onChange={(event) => setInput(event.target.value)} /></section><section className="editor-panel"><div className="editor-panel__head"><span>Output</span><span>Converted value</span></div>{result.error ? <div className="editor-error"><strong>Roman numeral issue</strong><p>{result.error}</p></div> : <textarea readOnly value={result.output} className="editor-textarea editor-textarea--output editor-textarea--compact" />}</section></div>
    </ToolFrame>
  );
}
