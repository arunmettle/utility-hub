import { useMemo, useState } from 'react';
import { ArrowLeftRight, Binary, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformCharacterCodes, type CharacterCodeMode } from '../lib/privacyTools';

export default function CharacterCodeStudio() {
  const [mode, setMode] = useState<CharacterCodeMode>('encode');
  const [input, setInput] = useState('Utility');
  const result = useMemo(() => transformCharacterCodes(input, mode), [input, mode]);

  return (
    <ToolFrame eyebrow="Encoder" title="Character Code Studio" description="Convert text into decimal character codes or decode numeric code points back into readable text." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'encode' ? 'decode' : 'encode')}><ArrowLeftRight size={16} />{mode === 'encode' ? 'Decode' : 'Encode'}</button><button type="button" className="action-button" onClick={() => setInput(mode === 'encode' ? 'Utility' : '85 116 105 108 105 116 121')}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Binary size={16} />Input</span><span>{mode === 'encode' ? 'Text' : 'Decimal code points'}</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="editor-panel">
          <div className="editor-panel__head"><span>Output</span><span>{mode === 'encode' ? 'Numeric codes' : 'Decoded text'}</span></div>
          {result.error ? <div className="editor-error"><strong>Code issue</strong><p>{result.error}</p></div> : <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output} />}
        </section>
      </div>
    </ToolFrame>
  );
}
