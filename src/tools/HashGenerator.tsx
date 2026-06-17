import { useEffect, useState } from 'react';
import { Check, Copy, Fingerprint } from 'lucide-react';
import { md5 } from 'js-md5';
import { sha256 } from 'js-sha256';
import { sha512 } from 'js-sha512';
import ToolPage from '../components/ToolPage';

type HashType = 'md5' | 'sha256' | 'sha512';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<HashType, string>>({ md5: '', sha256: '', sha512: '' });
  const [copied, setCopied] = useState<HashType | null>(null);

  useEffect(() => {
    if (!input) {
      setHashes({ md5: '', sha256: '', sha512: '' });
      return;
    }

    setHashes({
      md5: md5(input),
      sha256: sha256(input),
      sha512: sha512(input),
    });
  }, [input]);

  const copyToClipboard = async (hash: string, type: HashType) => {
    await navigator.clipboard.writeText(hash);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const hashTypes: { type: HashType; label: string; helper: string }[] = [
    { type: 'md5', label: 'MD5', helper: 'Fast checksum for legacy workflows.' },
    { type: 'sha256', label: 'SHA-256', helper: 'Balanced default for modern integrity checks.' },
    { type: 'sha512', label: 'SHA-512', helper: 'Extended digest length for advanced verification.' },
  ];

  return (
    <ToolPage
      title="Hash Generator"
      description="Generate deterministic digests for plain text with clean comparison blocks and one-click copy actions."
      category="Generators"
      icon={Fingerprint}
      actions={
        <button type="button" onClick={() => setInput('')} className="button-secondary">
          Clear
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-gutter xl:grid-cols-[1.1fr_1fr]">
        <section className="app-panel p-6">
          <label className="field-label">Source Text</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Enter text to hash…"
            className="field-textarea min-h-[220px]"
          />
          <div className="mt-4 notice-info">
            Hashes are one-way outputs. The original value cannot be reconstructed from the digest.
          </div>
        </section>

        <section className="space-y-4">
          {hashTypes.map(({ type, label, helper }) => (
            <div key={type} className="app-panel p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-label-sm uppercase text-text-secondary">Algorithm</p>
                  <h3 className="mt-2 text-headline-sm font-semibold text-text-primary">{label}</h3>
                  <p className="mt-1 text-body-md text-text-secondary">{helper}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(hashes[type], type)}
                  className="button-ghost"
                  disabled={!hashes[type]}
                >
                  {copied === type ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="code-surface break-all">{hashes[type] || 'Digest output appears here…'}</div>
            </div>
          ))}
        </section>
      </div>
    </ToolPage>
  );
}
