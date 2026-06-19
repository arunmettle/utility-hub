import { useState } from 'react';
import { Check, Copy, Minimize2, Sparkles, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformJson } from '../lib/privacyTools';

const sampleJson = `{
  "service": "cobalt",
  "environment": "browser",
  "features": [
    "format",
    "validate",
    "minify"
  ],
  "privacyFirst": true
}`;

export default function JsonFormatter() {
  const initialState = transformJson(sampleJson, 2);
  const [input, setInput] = useState(sampleJson);
  const [output, setOutput] = useState(initialState.output);
  const [error, setError] = useState(initialState.error);
  const [copied, setCopied] = useState(false);

  const updateOutput = (value: string, spacing: number) => {
    setInput(value);
    const nextState = transformJson(value, spacing);
    setOutput(nextState.output);
    setError(nextState.error);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Formatter"
      title="JSON Formatter"
      description="Validate, prettify, and minify JSON in the browser with immediate structure feedback."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={() => updateOutput(input, 2)}>
            <Sparkles size={16} />
            Prettify
          </button>
          <button type="button" className="action-button" onClick={() => updateOutput(input, 0)}>
            <Minimize2 size={16} />
            Minify
          </button>
          <button type="button" className="action-button" onClick={handleCopy} disabled={!output}>
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
        title: 'Quick tip',
        body: 'Malformed payloads surface immediately in the output pane, so you can validate before copying or minifying.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Input</span>
            <span>Paste raw JSON</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => updateOutput(event.target.value, 2)}
            className="editor-textarea"
            placeholder='{"tool":"cobalt"}'
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Output</span>
            <span>Structured result</span>
          </div>
          {error ? (
            <div className="editor-error">
              <strong>Invalid JSON</strong>
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
