import { useState } from 'react';
import { ArrowLeftRight, Binary, Check, Copy } from 'lucide-react';
import ToolPage from '../components/ToolPage';

export default function Base64Encoder() {
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
      if (currentMode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(value))));
      } else {
        setOutput(decodeURIComponent(escape(atob(value))));
      }
    } catch {
      setError(currentMode === 'decode' ? 'Invalid Base64 string.' : 'Unable to encode the provided text.');
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
      title="Base64 Encoder / Decoder"
      description="Encode raw text to Base64 or decode Base64 payloads instantly with clear side-by-side outputs."
      category="Encoders/Decoders"
      icon={Binary}
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
          <label className="field-label">Input / {mode === 'encode' ? 'PLAIN TEXT' : 'BASE64'}</label>
          <textarea
            value={input}
            onChange={(event) => processInput(event.target.value)}
            placeholder={mode === 'encode' ? 'Paste text to encode…' : 'Paste Base64 to decode…'}
            className="field-textarea min-h-[320px] font-mono"
          />
        </section>

        <section className="app-panel p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <label className="field-label mb-0">Output / {mode === 'encode' ? 'BASE64' : 'PLAIN TEXT'}</label>
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
              className="field-textarea min-h-[320px] bg-background font-mono"
            />
          )}
        </section>
      </div>
    </ToolPage>
  );
}
