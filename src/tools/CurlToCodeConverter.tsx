import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Terminal } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertCurlToCode } from '../lib/privacyTools';

const sampleCurl = `curl https://api.utilityhub.dev/tools \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  --data '{"name":"Cobalt","mode":"preview"}'`;

export default function CurlToCodeConverter() {
  const [input, setInput] = useState(sampleCurl);
  const [copied, setCopied] = useState<'fetch' | 'axios' | 'python' | null>(null);
  const result = useMemo(() => convertCurlToCode(input), [input]);

  const handleCopy = async (value: string, target: 'fetch' | 'axios' | 'python') => {
    await navigator.clipboard.writeText(value);
    setCopied(target);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="cURL to Code Converter"
      description="Turn a pasted cURL request into fetch, axios, and Python requests snippets without sending request details anywhere."
      actions={
        <button type="button" className="action-button" onClick={() => setInput(sampleCurl)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Best with raw cURL',
        body: 'Paste the exact cURL command from your terminal or API docs. Headers and body payloads stay in the browser while the tool generates starter snippets.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>cURL input</span>
            <span>Paste a request command</span>
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
                <article className="stat-card">
                  <span className="stat-card__label">Method</span>
                  <strong>{result.output.method}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Headers</span>
                  <strong>{result.output.headers.length}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Body</span>
                  <strong>{result.output.body ? 'Included' : 'None'}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <Terminal size={16} />
                    Fetch output
                  </span>
                  <button
                    type="button"
                    className="action-button action-button--icon"
                    aria-label="Copy fetch snippet"
                    onClick={() => handleCopy(result.output!.fetchSnippet, 'fetch')}
                  >
                    {copied === 'fetch' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <textarea readOnly value={result.output.fetchSnippet} className="editor-textarea editor-textarea--compact editor-textarea--output" />
              </section>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Axios output</span>
                  <button
                    type="button"
                    className="action-button action-button--icon"
                    aria-label="Copy axios snippet"
                    onClick={() => handleCopy(result.output!.axiosSnippet, 'axios')}
                  >
                    {copied === 'axios' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <textarea readOnly value={result.output.axiosSnippet} className="editor-textarea editor-textarea--compact editor-textarea--output" />
              </section>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Python requests output</span>
                  <button
                    type="button"
                    className="action-button action-button--icon"
                    aria-label="Copy python snippet"
                    onClick={() => handleCopy(result.output!.pythonSnippet, 'python')}
                  >
                    {copied === 'python' ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <textarea readOnly value={result.output.pythonSnippet} className="editor-textarea editor-textarea--compact editor-textarea--output" />
              </section>

              {result.output.warnings.length > 0 ? (
                <section className="editor-panel">
                  <div className="editor-panel__head">
                    <span>Review notes</span>
                    <span>{result.output.warnings.length} warnings</span>
                  </div>
                  <div className="insight-list">
                    {result.output.warnings.map((warning) => (
                      <article key={warning} className="insight-row insight-row--medium">
                        <strong>Check before sharing</strong>
                        <p>{warning}</p>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
