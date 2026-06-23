import { useEffect, useState } from 'react';
import { Check, Copy, Fingerprint, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateHashes, type HashType } from '../lib/privacyTools';

const hashItems: { type: HashType; label: string; helper: string }[] = [
  { type: 'md5', label: 'MD5', helper: 'Fast checksum for legacy comparison.' },
  { type: 'sha256', label: 'SHA-256', helper: 'A strong default for integrity verification.' },
  { type: 'sha512', label: 'SHA-512', helper: 'Long-form digest for advanced verification needs.' },
];

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState(generateHashes(''));
  const [copied, setCopied] = useState<HashType | null>(null);

  useEffect(() => {
    setHashes(generateHashes(input));
  }, [input]);

  const copyHash = async (type: HashType) => {
    if (!hashes[type]) return;
    await navigator.clipboard.writeText(hashes[type]);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Generator"
      title="Hash Generator"
      description="Generate deterministic MD5, SHA-256, and SHA-512 digests locally in the browser."
      actions={
        <button type="button" className="action-button" onClick={() => setInput('')}>
          <Trash2 size={16} />
          Clear
        </button>
      }
      note={{
        title: 'Privacy note',
        body: 'Hashing happens entirely in-browser, so secrets and payloads never leave your device.',
      }}
    >
      <div className="stack-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Source text</span>
            <span>Local only</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="editor-textarea editor-textarea--compact"
            placeholder="Enter text to hash"
          />
        </section>

        <div className="result-grid">
          {hashItems.map((item) => (
            <section key={item.type} className="editor-panel">
              <div className="editor-panel__head">
                <span className="editor-panel__heading-with-icon">
                  <Fingerprint size={16} />
                  {item.label}
                </span>
                <button
                  type="button"
                  className="action-button action-button--icon"
                  onClick={() => copyHash(item.type)}
                  disabled={!hashes[item.type]}
                  aria-label={`Copy ${item.label} hash`}
                >
                  {copied === item.type ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="panel-helper">{item.helper}</p>
              <textarea value={hashes[item.type]} readOnly className="editor-textarea editor-textarea--compact editor-textarea--output" />
            </section>
          ))}
        </div>
      </div>
    </ToolFrame>
  );
}
