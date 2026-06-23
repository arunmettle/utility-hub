import { useMemo, useState } from 'react';
import { ArrowLeftRight, RotateCcw, Table2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertDelimitedText } from '../lib/privacyTools';

export default function DelimiterConverter() {
  const [input, setInput] = useState('name,role\nUtility Hub,platform');
  const [sourceDelimiter, setSourceDelimiter] = useState(',');
  const [targetDelimiter, setTargetDelimiter] = useState('tab');
  const output = useMemo(() => convertDelimitedText(input, sourceDelimiter, targetDelimiter), [input, sourceDelimiter, targetDelimiter]);

  return (
    <ToolFrame eyebrow="Converter" title="Delimiter Converter" description="Convert rows between comma, tab, pipe, or semicolon-delimited formats locally." actions={<><button type="button" className="action-button action-button--primary" onClick={() => { const current = sourceDelimiter; setSourceDelimiter(targetDelimiter); setTargetDelimiter(current); }}><ArrowLeftRight size={16} />Swap delimiters</button><button type="button" className="action-button" onClick={() => { setInput('name,role\nUtility Hub,platform'); setSourceDelimiter(','); setTargetDelimiter('tab'); }}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Table2 size={16} />Input</span></div><div className="stack-grid"><input className="tool-input" value={sourceDelimiter} onChange={(event) => setSourceDelimiter(event.target.value)} /><input className="tool-input" value={targetDelimiter} onChange={(event) => setTargetDelimiter(event.target.value)} /><textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} /></div></section>
        <section className="editor-panel"><div className="editor-panel__head"><span>Output</span></div><textarea className="editor-textarea editor-textarea--output" readOnly value={output.output} /></section>
      </div>
    </ToolFrame>
  );
}
