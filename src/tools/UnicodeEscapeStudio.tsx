import { useState } from 'react';
import { ArrowLeftRight, Check, Copy, Languages, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformUnicodeEscapes, type QueryMode } from '../lib/privacyTools';

const sampleText = 'Utility ✓';
const sampleEscaped = transformUnicodeEscapes(sampleText, 'encode').output;

export default function UnicodeEscapeStudio() {
  const [mode, setMode] = useState<QueryMode>('encode');
  const initialState = transformUnicodeEscapes(sampleText, 'encode');
  const [input, setInput] = useState(sampleText);
  const [output, setOutput] = useState(initialState.output);
  const [copied, setCopied] = useState(false);

  const transform = (value: string, nextMode = mode) => {
    setInput(value);
    const nextState = transformUnicodeEscapes(value, nextMode);
    setOutput(nextState.output);
  };

  const changeMode = (nextMode: QueryMode) => {
    if (nextMode === mode) return;

    setMode(nextMode);

    if (!input) {
      setOutput('');
      return;
    }

    if ((mode === 'encode' && input === sampleText) || (mode === 'decode' && input === sampleEscaped)) {
      transform(nextMode === 'encode' ? sampleText : sampleEscaped, nextMode);
      return;
    }

    transform(output || input, nextMode);
  };

  return (
    <ToolFrame
      eyebrow="Encoder"
      title="Unicode Escape Studio"
      description="Encode readable text into unicode escape sequences or decode escaped strings back into characters."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={() => changeMode(mode === 'encode' ? 'decode' : 'encode')}>
            <ArrowLeftRight size={16} />
            Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
          </button>
          <button
            type="button"
            className="action-button"
            onClick={async () => {
              if (!output) return;
              await navigator.clipboard.writeText(output);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
            disabled={!output}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            className="action-button"
            onClick={() => {
              setInput('');
              setOutput('');
            }}
          >
            <Trash2 size={16} />
            Clear
          </button>
        </>
      }
    >
      <div className="mode-toggle" role="tablist" aria-label="Unicode mode">
        <button type="button" className={mode === 'encode' ? 'is-active' : ''} onClick={() => changeMode('encode')}>
          Encode
        </button>
        <button type="button" className={mode === 'decode' ? 'is-active' : ''} onClick={() => changeMode('decode')}>
          Decode
        </button>
      </div>

      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Languages size={16} />
              Input
            </span>
            <span>{mode === 'encode' ? 'Readable text' : 'Escaped string'}</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => transform(event.target.value)}
            className="editor-textarea"
            placeholder={mode === 'encode' ? 'Enter text with unicode characters' : '\\u0055\\u0074\\u0069\\u006c\\u0069\\u0074\\u0079'}
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Output</span>
            <span>{mode === 'encode' ? 'Escaped output' : 'Decoded text'}</span>
          </div>
          <textarea value={output} readOnly className="editor-textarea editor-textarea--output" />
        </section>
      </div>
    </ToolFrame>
  );
}
