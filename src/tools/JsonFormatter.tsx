import { useState } from 'react';
import { Braces, Check, Copy, Wand2 } from 'lucide-react';
import ToolPage from '../components/ToolPage';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = (value: string) => {
    setInput(value);

    if (!value.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(value);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (formatError) {
      setError(formatError instanceof Error ? formatError.message : 'Invalid JSON.');
      setOutput('');
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (formatError) {
      setError(formatError instanceof Error ? formatError.message : 'Invalid JSON.');
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPage
      title="JSON Formatter"
      description="Validate, format, and minify JSON with immediate feedback and a balanced editor layout."
      category="Formatters"
      icon={Braces}
      actions={
        <>
          <button type="button" onClick={minifyJson} className="button-primary" disabled={!input.trim()}>
            <Wand2 size={16} />
            Minify
          </button>
          <button
            type="button"
            onClick={() => {
              setInput('');
              setOutput('');
              setError('');
            }}
            className="button-secondary"
          >
            Clear
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-gutter xl:grid-cols-2">
        <section className="app-panel p-6">
          <label className="field-label">Input JSON</label>
          <textarea
            value={input}
            onChange={(event) => formatJson(event.target.value)}
            placeholder='{"service": "utility-hub", "status": "ready"}'
            className="field-textarea min-h-[420px] font-mono"
          />
        </section>

        <section className="app-panel p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <label className="field-label mb-0">Formatted Output</label>
            <button type="button" onClick={copyToClipboard} className="button-ghost" disabled={!output}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {error ? (
            <div className="notice-error">
              <p className="font-semibold">Invalid JSON</p>
              <p className="mt-1">{error}</p>
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Formatted output appears here…"
              className="field-textarea min-h-[420px] bg-background font-mono"
            />
          )}
        </section>
      </div>
    </ToolPage>
  );
}
