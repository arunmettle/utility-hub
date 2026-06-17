import { useState } from 'react';
import { ArrowLeftRight, Check, Copy, Link2 } from 'lucide-react';
import ToolPage from '../components/ToolPage';

export default function URLEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const processInput = (value: string, newMode?: 'encode' | 'decode') => {
    setInput(value);
    const currentMode = newMode ?? mode;
    setError('');

    if (!value) {
      setOutput('');
      return;
    }

    try {
      setOutput(currentMode === 'encode' ? encodeURIComponent(value) : decodeURIComponent(value));
    } catch {
      setError(currentMode === 'decode' ? 'Invalid URL-encoded string.' : 'Unable to encode the provided text.');
      setOutput('');
    }
  };

  const switchMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);

    if (output) {
      setInput(output);
      processInput(output, newMode);
      return;
    }

    processInput(input, newMode);
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPage
      title="URL Encoder / Decoder"
      description="Transform plain text into URL-safe strings or decode encoded values while keeping examples nearby."
      category="Encoders/Decoders"
      icon={Link2}
      actions={
        <>
          <button type="button" onClick={switchMode} className="button-primary">
            <ArrowLeftRight size={16} />
            Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
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
          <label className="field-label">Input / {mode === 'encode' ? 'PLAIN TEXT' : 'URL ENCODED'}</label>
          <textarea
            value={input}
            onChange={(event) => processInput(event.target.value)}
            placeholder={mode === 'encode' ? 'Paste text to encode…' : 'Paste an encoded URL segment…'}
            className="field-textarea min-h-[320px] font-mono"
          />
        </section>

        <section className="space-y-6">
          <div className="app-panel p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <label className="field-label mb-0">Output / {mode === 'encode' ? 'URL ENCODED' : 'PLAIN TEXT'}</label>
              <button type="button" onClick={copyToClipboard} className="button-ghost" disabled={!output}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            {error ? (
              <div className="notice-error">{error}</div>
            ) : (
              <textarea
                value={output}
                readOnly
                placeholder="Converted output appears here…"
                className="field-textarea min-h-[220px] bg-background font-mono"
              />
            )}
          </div>

          <div className="app-panel p-6">
            <p className="font-mono text-label-sm uppercase text-text-secondary">Examples</p>
            <div className="mt-4 space-y-4 text-body-md text-text-secondary">
              <div className="mini-card">
                <p className="text-text-primary">Hello World!</p>
                <p className="mt-2 font-mono text-primary">Hello%20World%21</p>
              </div>
              <div className="mini-card">
                <p className="text-text-primary">user@example.com</p>
                <p className="mt-2 font-mono text-primary">user%40example.com</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ToolPage>
  );
}
