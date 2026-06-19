import { useState } from 'react';
import { ArrowLeftRight, Check, Copy, Braces, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformHtmlEntities, type QueryMode } from '../lib/privacyTools';

const sampleHtml = '<button class="primary">Utility & Hub</button>';
const sampleEncoded = transformHtmlEntities(sampleHtml, 'encode').output;

export default function HtmlEntityStudio() {
  const [mode, setMode] = useState<QueryMode>('encode');
  const initialState = transformHtmlEntities(sampleHtml, 'encode');
  const [input, setInput] = useState(sampleHtml);
  const [output, setOutput] = useState(initialState.output);
  const [copied, setCopied] = useState(false);

  const transform = (value: string, nextMode = mode) => {
    setInput(value);
    const nextState = transformHtmlEntities(value, nextMode);
    setOutput(nextState.output);
  };

  const changeMode = (nextMode: QueryMode) => {
    if (nextMode === mode) return;

    setMode(nextMode);

    const usingEncodeStarter = mode === 'encode' && input === sampleHtml;
    const usingDecodeStarter = mode === 'decode' && input === sampleEncoded;
    if (usingEncodeStarter || usingDecodeStarter) {
      transform(nextMode === 'encode' ? sampleHtml : sampleEncoded, nextMode);
      return;
    }

    transform(output || input, nextMode);
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
      title="HTML Entity Studio"
      description="Encode or decode HTML entities locally when moving text between templates, docs, and user interfaces."
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
            }}
          >
            <Trash2 size={16} />
            Clear
          </button>
        </>
      }
    >
      <div className="mode-toggle" role="tablist" aria-label="HTML entity mode">
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
              <Braces size={16} />
              Input
            </span>
            <span>{mode === 'encode' ? 'HTML text' : 'HTML entities'}</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => transform(event.target.value)}
            className="editor-textarea"
            placeholder={mode === 'encode' ? '<button>Example</button>' : '&lt;button&gt;Example&lt;/button&gt;'}
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Output</span>
            <span>{mode === 'encode' ? 'Encoded entities' : 'Decoded text'}</span>
          </div>
          <textarea value={output} readOnly className="editor-textarea editor-textarea--output" />
        </section>
      </div>
    </ToolFrame>
  );
}
