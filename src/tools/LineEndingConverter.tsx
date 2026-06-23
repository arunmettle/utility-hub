import { useMemo, useState } from 'react';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertLineEndings, type LineEndingMode } from '../lib/privacyTools';

const sampleText = 'line one\r\nline two';

export default function LineEndingConverter() {
  const [mode, setMode] = useState<LineEndingMode>('lf');
  const [input, setInput] = useState(sampleText);
  const result = useMemo(() => convertLineEndings(input, mode), [input, mode]);

  return (
    <ToolFrame eyebrow="Converter" title="Line Ending Converter" description="Convert text between LF and CRLF endings when cleaning pasted config, scripts, or docs." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'lf' ? 'crlf' : 'lf')}><ArrowLeftRight size={16} />Switch to {mode === 'lf' ? 'CRLF' : 'LF'}</button><button type="button" className="action-button" onClick={() => setInput(sampleText)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span>Input text</span><span>Paste content to normalize</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section><section className="editor-panel"><div className="editor-panel__head"><span>Output</span><span>{mode.toUpperCase()} ending mode</span></div><textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" /></section></div>
    </ToolFrame>
  );
}
