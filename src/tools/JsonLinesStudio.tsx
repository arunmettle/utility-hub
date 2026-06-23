import { useMemo, useState } from 'react';
import { ArrowLeftRight, Braces, Check, Copy, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformJsonLines, type JsonLinesMode } from '../lib/privacyTools';

const sampleJsonl = '{"tool":"markdown-studio","category":"Developer"}\n{"tool":"prompt-studio","category":"AI"}';
const sampleArray = `[
  {
    "tool": "markdown-studio",
    "category": "Developer"
  },
  {
    "tool": "prompt-studio",
    "category": "AI"
  }
]`;

export default function JsonLinesStudio() {
  const [mode, setMode] = useState<JsonLinesMode>('jsonl-to-array');
  const [input, setInput] = useState(sampleJsonl);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => transformJsonLines(input, mode), [input, mode]);

  const output = result.output ? (mode === 'jsonl-to-array' ? result.output.prettyJsonArray : result.output.normalizedJsonl) : '';

  const changeMode = (nextMode: JsonLinesMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);

    if (!input) return;
    if ((mode === 'jsonl-to-array' && input === sampleJsonl) || (mode === 'array-to-jsonl' && input === sampleArray)) {
      setInput(nextMode === 'jsonl-to-array' ? sampleJsonl : sampleArray);
      return;
    }

    if (result.output) {
      setInput(nextMode === 'jsonl-to-array' ? result.output.normalizedJsonl : result.output.prettyJsonArray);
    }
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="JSON Lines Studio"
      description="Convert JSONL and JSON arrays back and forth locally when shaping logs, eval fixtures, and batch inputs."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={() => changeMode(mode === 'jsonl-to-array' ? 'array-to-jsonl' : 'jsonl-to-array')}>
            <ArrowLeftRight size={16} />
            Switch to {mode === 'jsonl-to-array' ? 'Array to JSONL' : 'JSONL to Array'}
          </button>
          <button type="button" className="action-button" disabled={!output} onClick={async () => {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
          }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(mode === 'jsonl-to-array' ? sampleJsonl : sampleArray)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
    >
      <div className="mode-toggle" role="tablist" aria-label="JSON Lines mode">
        <button type="button" className={mode === 'jsonl-to-array' ? 'is-active' : ''} onClick={() => changeMode('jsonl-to-array')}>
          JSONL to Array
        </button>
        <button type="button" className={mode === 'array-to-jsonl' ? 'is-active' : ''} onClick={() => changeMode('array-to-jsonl')}>
          Array to JSONL
        </button>
      </div>

      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Braces size={16} />
              Input
            </span>
            <span>{mode === 'jsonl-to-array' ? 'One JSON object per line' : 'JSON array'}</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Conversion issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card"><span className="stat-card__label">Rows</span><strong>{result.output.rowCount}</strong></article>
                <article className="stat-card"><span className="stat-card__label">Keys</span><strong>{result.output.uniqueKeyCount}</strong></article>
              </div>
              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Output</span>
                  <span>{mode === 'jsonl-to-array' ? 'Pretty JSON array' : 'Normalized JSONL'}</span>
                </div>
                <textarea readOnly value={output} className="editor-textarea editor-textarea--output" />
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
