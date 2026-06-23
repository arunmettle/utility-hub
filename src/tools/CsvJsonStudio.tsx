import { useState } from 'react';
import { ArrowLeftRight, Check, Copy, Table2, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformCsvJson, type CsvJsonMode } from '../lib/privacyTools';

const sampleCsv = 'name,role\nUtilityHub,platform\nOpenAI,partner';
const sampleJson = transformCsvJson(sampleCsv, 'csv-to-json').output;

export default function CsvJsonStudio() {
  const [mode, setMode] = useState<CsvJsonMode>('csv-to-json');
  const initialState = transformCsvJson(sampleCsv, 'csv-to-json');
  const [input, setInput] = useState(sampleCsv);
  const [output, setOutput] = useState(initialState.output);
  const [error, setError] = useState(initialState.error);
  const [copied, setCopied] = useState(false);

  const transform = (value: string, nextMode = mode) => {
    setInput(value);
    const nextState = transformCsvJson(value, nextMode);
    setOutput(nextState.output);
    setError(nextState.error);
  };

  const changeMode = (nextMode: CsvJsonMode) => {
    if (nextMode === mode) return;

    setMode(nextMode);

    if (!input) {
      setOutput('');
      setError('');
      return;
    }

    if ((mode === 'csv-to-json' && input === sampleCsv) || (mode === 'json-to-csv' && input === sampleJson)) {
      transform(nextMode === 'csv-to-json' ? sampleCsv : sampleJson, nextMode);
      return;
    }

    transform(output || input, nextMode);
  };

  return (
    <ToolFrame
      eyebrow="Converter"
      title="CSV JSON Studio"
      description="Round-trip tabular CSV content and JSON arrays locally when shaping imports, exports, or fixtures."
      actions={
        <>
          <button
            type="button"
            className="action-button action-button--primary"
            onClick={() => changeMode(mode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json')}
          >
            <ArrowLeftRight size={16} />
            Switch to {mode === 'csv-to-json' ? 'JSON to CSV' : 'CSV to JSON'}
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
      <div className="mode-toggle" role="tablist" aria-label="CSV JSON mode">
        <button type="button" className={mode === 'csv-to-json' ? 'is-active' : ''} onClick={() => changeMode('csv-to-json')}>
          CSV to JSON
        </button>
        <button type="button" className={mode === 'json-to-csv' ? 'is-active' : ''} onClick={() => changeMode('json-to-csv')}>
          JSON to CSV
        </button>
      </div>

      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Table2 size={16} />
              Input
            </span>
            <span>{mode === 'csv-to-json' ? 'CSV text' : 'JSON array'}</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => transform(event.target.value)}
            className="editor-textarea"
            placeholder={mode === 'csv-to-json' ? 'name,role' : '[{\"name\":\"UtilityHub\"}]'}
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Output</span>
            <span>{mode === 'csv-to-json' ? 'JSON result' : 'CSV result'}</span>
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
