import { useState } from 'react';
import { ArrowLeftRight, Check, Copy, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformBase64, type Base64Mode } from '../lib/privacyTools';

const sampleText = 'Cobalt keeps Base64 workflows readable.';
const samplePayload = transformBase64(sampleText, 'encode').output;

export default function Base64Studio() {
  const [mode, setMode] = useState<Base64Mode>('encode');
  const initialState = transformBase64(sampleText, 'encode');
  const [input, setInput] = useState(sampleText);
  const [output, setOutput] = useState(initialState.output);
  const [error, setError] = useState(initialState.error);
  const [copied, setCopied] = useState(false);

  const transform = (value: string, nextMode = mode) => {
    setInput(value);
    const nextState = transformBase64(value, nextMode);
    setOutput(nextState.output);
    setError(nextState.error);
  };

  const changeMode = (nextMode: Base64Mode) => {
    if (nextMode === mode) return;

    setMode(nextMode);

    const usingEncodeStarter = mode === 'encode' && input === sampleText;
    const usingDecodeStarter = mode === 'decode' && input === samplePayload;
    const isUsingStarterContent = usingEncodeStarter || usingDecodeStarter;

    if (!input) {
      setOutput('');
      setError('');
      return;
    }

    if (isUsingStarterContent) {
      const nextInput = nextMode === 'encode' ? sampleText : samplePayload;
      transform(nextInput, nextMode);
      return;
    }

    if (output) {
      transform(output, nextMode);
      return;
    }

    transform(input, nextMode);
  };

  const switchMode = () => {
    changeMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Encoder"
      title="Base64 Studio"
      description="Encode plain text or decode Base64 payloads with a single switchable workspace."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={switchMode}>
            <ArrowLeftRight size={16} />
            Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
          </button>
          <button type="button" className="action-button" onClick={copyOutput} disabled={!output}>
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
      <div className="mode-toggle" role="tablist" aria-label="Base64 mode">
        <button
          type="button"
          className={mode === 'encode' ? 'is-active' : ''}
          onClick={() => changeMode('encode')}
        >
          Encode
        </button>
        <button
          type="button"
          className={mode === 'decode' ? 'is-active' : ''}
          onClick={() => changeMode('decode')}
        >
          Decode
        </button>
      </div>

      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Input</span>
            <span>{mode === 'encode' ? 'Plain text' : 'Base64 payload'}</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => transform(event.target.value)}
            className="editor-textarea"
            placeholder={mode === 'encode' ? 'Type text to encode' : 'Paste Base64 to decode'}
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Output</span>
            <span>{mode === 'encode' ? 'Encoded result' : 'Decoded text'}</span>
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
