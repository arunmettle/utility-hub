import { useState } from 'react';
import { Check, Copy, Fingerprint, RefreshCw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateUuidList } from '../lib/privacyTools';

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [values, setValues] = useState<string[]>(() => generateUuidList(5));
  const [copied, setCopied] = useState<number | 'all' | null>(null);

  const regenerate = () => {
    setValues(generateUuidList(count));
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
      title="UUID Generator"
      description="Generate RFC 4122 UUIDs locally in the browser for identifiers, fixtures, or testing data."
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
        title: 'Privacy note',
        body: 'UUIDs are generated with browser-native randomness and never leave the device.',
      }}
    >
      <div className="stack-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Batch size</span>
            <span>{count} UUIDs</span>
          </div>
          <input
            id="uuid-count"
            type="range"
            min="1"
            max="20"
            value={count}
            onChange={(event) => {
              const nextCount = Number(event.target.value);
              setCount(nextCount);
              setValues(generateUuidList(nextCount));
              setCopied(null);
            }}
            className="field-range"
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Fingerprint size={16} />
              Generated UUIDs
            </span>
            <span>Version 4</span>
          </div>
          <div className="output-list">
            {values.map((value, index) => (
              <div key={value} className="output-row">
                <span className="output-row__value">{value}</span>
                <button
                  type="button"
                  className="action-button action-button--icon"
                  onClick={() => copyValue(value, index)}
                  aria-label={`Copy UUID ${index + 1}`}
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
