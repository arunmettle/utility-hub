import { useState } from 'react';
import { ArrowLeftRight, Check, Copy, Link2, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformUrl, type UrlMode } from '../lib/privacyTools';

const sampleUrlText = 'user@example.com?source=utility hub';

export default function UrlStudio() {
  const [mode, setMode] = useState<UrlMode>('encode');
  const initialState = transformUrl(sampleUrlText, 'encode');
  const [input, setInput] = useState(sampleUrlText);
  const [output, setOutput] = useState(initialState.output);
  const [error, setError] = useState(initialState.error);
  const [copied, setCopied] = useState(false);

  const transform = (value: string, nextMode = mode) => {
    setInput(value);
    const nextState = transformUrl(value, nextMode);
    setOutput(nextState.output);
    setError(nextState.error);
  };

  return (
    <ToolFrame
      eyebrow="Encoder"
      title="URL Studio"
      description="Encode plain text into URL-safe values or decode encoded strings without leaving the browser."
      actions={
        <>
          <button
            type="button"
            className="action-button action-button--primary"
            onClick={() => {
              const nextMode = mode === 'encode' ? 'decode' : 'encode';
              setMode(nextMode);
              transform(output || input, nextMode);
            }}
          >
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
      <div className="mode-toggle" role="tablist" aria-label="URL mode">
        <button type="button" className={mode === 'encode' ? 'is-active' : ''} onClick={() => { setMode('encode'); transform(input, 'encode'); }}>
          Encode
        </button>
        <button type="button" className={mode === 'decode' ? 'is-active' : ''} onClick={() => { setMode('decode'); transform(input, 'decode'); }}>
          Decode
        </button>
      </div>

      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Link2 size={16} />
              Input
            </span>
            <span>{mode === 'encode' ? 'Plain text' : 'Encoded value'}</span>
          </div>
          <textarea value={input} onChange={(event) => transform(event.target.value)} className="editor-textarea" />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Output</span>
            <span>{mode === 'encode' ? 'URL encoded' : 'Decoded text'}</span>
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
