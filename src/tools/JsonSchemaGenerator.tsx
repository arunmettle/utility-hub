import { useMemo, useState } from 'react';
import { Braces, Check, Copy, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateJsonSchema } from '../lib/privacyTools';

const sampleJson = `{
  "id": 1,
  "name": "UtilityHub",
  "active": true,
  "tags": ["privacy", "browser"],
  "owner": {
    "team": "engineering"
  }
}`;

export default function JsonSchemaGenerator() {
  const [input, setInput] = useState(sampleJson);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => generateJsonSchema(input), [input]);

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output.schema);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="JSON Schema Generator"
      description="Infer a draft JSON Schema from a representative JSON sample so contracts, fixtures, and validation rules are easier to bootstrap."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy} disabled={!result.output}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy schema'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleJson)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Bootstrapping aid',
        body: 'The inferred schema is a starting point, not a final contract. Review optional fields, array item behavior, and any nullable cases before production use.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>JSON sample</span>
            <span>Representative payload</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Schema issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Root type</span>
                  <strong>{result.output.rootType}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Properties</span>
                  <strong>{result.output.propertyCount}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <Braces size={16} />
                    Generated schema
                  </span>
                  <span>Draft 2020-12</span>
                </div>
                <textarea readOnly value={result.output.schema} className="editor-textarea editor-textarea--output" />
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
