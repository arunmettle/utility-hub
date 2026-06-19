import { useState } from 'react';
import { Check, Copy, RefreshCw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateUlidList } from '../lib/privacyTools';

export default function UlidGenerator() {
  const [count, setCount] = useState(5);
  const [values, setValues] = useState<string[]>(() => generateUlidList(5));
  const [copied, setCopied] = useState<number | 'all' | null>(null);

  const regenerate = () => {
    setValues(generateUlidList(count));
    setCopied(null);
  };

  const copyValue = async (value: string, key: number | 'all') => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Generator"
      title="ULID Generator"
      description="Generate lexicographically sortable ULIDs locally for privacy-safe IDs and ordered datasets."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={regenerate}>
            <RefreshCw size={16} />
            Regenerate
          </button>
          <button
            type="button"
            className="action-button"
            onClick={() => copyValue(values.join('\n'), 'all')}
            disabled={values.length === 0}
          >
            {copied === 'all' ? <Check size={16} /> : <Copy size={16} />}
            {copied === 'all' ? 'Copied all' : 'Copy all'}
          </button>
        </>
      }
      note={{
        title: 'Format note',
        body: 'ULIDs keep timestamp ordering while remaining compact enough for front-end fixtures, links, and local indexing.',
      }}
    >
      <div className="stack-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Batch size</span>
            <span>{count} ULIDs</span>
          </div>
          <input
            id="ulid-count"
            type="range"
            min="1"
            max="20"
            value={count}
            onChange={(event) => {
              const nextCount = Number(event.target.value);
              setCount(nextCount);
              setValues(generateUlidList(nextCount));
              setCopied(null);
            }}
            className="field-range"
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Generated ULIDs</span>
            <span>26 chars</span>
          </div>
          <div className="output-list">
            {values.map((value, index) => (
              <div key={value} className="output-row">
                <span className="output-row__value">{value}</span>
                <button
                  type="button"
                  className="action-button action-button--icon"
                  onClick={() => copyValue(value, index)}
                  aria-label={`Copy ULID ${index + 1}`}
                >
                  {copied === index ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ToolFrame>
  );
}
