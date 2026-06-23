import { useState } from 'react';
import { ArrowLeftRight, Binary, Check, Copy, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformHex, type QueryMode } from '../lib/privacyTools';

const sampleText = 'UtilityHub';
const sampleHex = transformHex(sampleText, 'encode').output;

export default function HexStudio() {
  const [mode, setMode] = useState<QueryMode>('encode');
  const initialState = transformHex(sampleText, 'encode');
  const [input, setInput] = useState(sampleText);
  const [output, setOutput] = useState(initialState.output);
  const [error, setError] = useState(initialState.error);
  const [copied, setCopied] = useState(false);

  const transform = (value: string, nextMode = mode) => {
    setInput(value);
    const nextState = transformHex(value, nextMode);
    setOutput(nextState.output);
    setError(nextState.error);
  };

  const changeMode = (nextMode: QueryMode) => {
    if (nextMode === mode) return;

    setMode(nextMode);

    if (!input) {
      setOutput('');
      setError('');
      return;
    }

    if ((mode === 'encode' && input === sampleText) || (mode === 'decode' && input === sampleHex)) {
      transform(nextMode === 'encode' ? sampleText : sampleHex, nextMode);
      return;
    }

    transform(output || input, nextMode);
  };

  return (
    <ToolFrame
      eyebrow="Encoder"
      title="Hex Studio"
      description="Encode text into hexadecimal bytes or decode hex back into readable text without leaving the browser."
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
              setError('');
            }}
          >
            <Trash2 size={16} />
            Clear
          </button>
        </>
      }
    >
      <div className="mode-toggle" role="tablist" aria-label="Hex mode">
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
              <Binary size={16} />
              Input
            </span>
            <span>{mode === 'encode' ? 'Plain text' : 'Hex bytes'}</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => transform(event.target.value)}
            className="editor-textarea"
            placeholder={mode === 'encode' ? 'Enter text to encode' : '55 74 69 6c 69 74 79'}
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Output</span>
            <span>{mode === 'encode' ? 'Hex result' : 'Decoded text'}</span>
          </div>
          {error ? (
            <div className="editor-error">
              <strong>Conversion error</strong>
              <p>{error}</p>
            </div>
          ) : (
            <textarea value={output} readOnly className="editor-textarea editor-textarea--output" />
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
