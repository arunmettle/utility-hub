import { useState } from 'react';
import { ArrowLeftRight, Check, Copy, Link2, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformQueryParams, type QueryMode } from '../lib/privacyTools';

const sampleJson = '{\n  "source": "utility hub",\n  "tags": ["privacy", "local"],\n  "page": "1"\n}';
const sampleQuery = transformQueryParams(sampleJson, 'encode').output;

export default function QueryStringStudio() {
  const [mode, setMode] = useState<QueryMode>('encode');
  const initialState = transformQueryParams(sampleJson, 'encode');
  const [input, setInput] = useState(sampleJson);
  const [output, setOutput] = useState(initialState.output);
  const [error, setError] = useState(initialState.error);
  const [copied, setCopied] = useState(false);

  const transform = (value: string, nextMode = mode) => {
    setInput(value);
    const nextState = transformQueryParams(value, nextMode);
    setOutput(nextState.output);
    setError(nextState.error);
  };

  const changeMode = (nextMode: QueryMode) => {
    if (nextMode === mode) return;

    setMode(nextMode);

    const usingEncodeStarter = mode === 'encode' && input === sampleJson;
    const usingDecodeStarter = mode === 'decode' && input === sampleQuery;
    const isUsingStarterContent = usingEncodeStarter || usingDecodeStarter;

    if (!input) {
      setOutput('');
      setError('');
      return;
    }

    if (isUsingStarterContent) {
      const nextInput = nextMode === 'encode' ? sampleJson : sampleQuery;
      transform(nextInput, nextMode);
      return;
    }

    if (output) {
      transform(output, nextMode);
      return;
    }

    transform(input, nextMode);
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Query String Studio"
      description="Switch between JSON parameter objects and URL query strings with local-only conversion."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={() => changeMode(mode === 'encode' ? 'decode' : 'encode')}>
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
      note={{
        title: 'Input format',
        body: 'Encode mode expects a JSON object. Repeated query parameters decode back into arrays so you can round-trip list values.',
      }}
    >
      <div className="mode-toggle" role="tablist" aria-label="Query string mode">
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
              <Link2 size={16} />
              Input
            </span>
            <span>{mode === 'encode' ? 'JSON object' : 'Query string'}</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => transform(event.target.value)}
            className="editor-textarea"
            placeholder={mode === 'encode' ? '{"foo":"bar"}' : 'foo=bar&tags=one&tags=two'}
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Output</span>
            <span>{mode === 'encode' ? 'Query string' : 'JSON result'}</span>
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
