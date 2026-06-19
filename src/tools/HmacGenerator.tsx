import { useMemo, useState } from 'react';
import { Check, Copy, Shield, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateHmacs, type HmacType } from '../lib/privacyTools';

const sampleSecret = 'cobalt-secret';
const sampleMessage = 'sign-this-message';

const hmacItems: Array<{ key: HmacType; label: string; helper: string }> = [
  { key: 'sha256', label: 'HMAC SHA-256', helper: 'Balanced default for API signatures and webhook validation.' },
  { key: 'sha512', label: 'HMAC SHA-512', helper: 'Longer digest for stricter compatibility requirements.' },
];

export default function HmacGenerator() {
  const [secret, setSecret] = useState(sampleSecret);
  const [message, setMessage] = useState(sampleMessage);
  const [copied, setCopied] = useState<HmacType | null>(null);

  const results = useMemo(() => generateHmacs(message, secret), [message, secret]);

  const copyValue = async (type: HmacType) => {
    const value = results[type];
    if (!value) return;

    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Security"
      title="HMAC Generator"
      description="Generate HMAC signatures locally from a message and secret without exposing either to a backend."
      actions={
        <button
          type="button"
          className="action-button"
          onClick={() => {
            setSecret('');
            setMessage('');
          }}
        >
          <Trash2 size={16} />
          Clear
        </button>
      }
      note={{
        title: 'Privacy note',
        body: 'Both the secret and the message stay in-browser, which makes this safer for signature debugging and local verification.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Secret</span>
            <span>Private input</span>
          </div>
          <textarea
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            className="editor-textarea editor-textarea--compact"
            placeholder="Enter a signing secret"
          />

          <div className="editor-panel__head editor-panel__head--spaced">
            <span>Message</span>
            <span>Signed content</span>
          </div>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="editor-textarea editor-textarea--compact"
            placeholder="Enter the message to sign"
          />
        </section>

        <div className="stack-grid">
          {hmacItems.map((item) => (
            <section key={item.key} className="editor-panel">
              <div className="editor-panel__head">
                <span className="editor-panel__heading-with-icon">
                  <Shield size={16} />
                  {item.label}
                </span>
                <button
                  type="button"
                  className="action-button action-button--icon"
                  onClick={() => copyValue(item.key)}
                  disabled={!results[item.key]}
                  aria-label={`Copy ${item.label}`}
                >
                  {copied === item.key ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className="panel-helper">{item.helper}</p>
              <textarea
                value={results[item.key]}
                readOnly
                className="editor-textarea editor-textarea--compact editor-textarea--output"
              />
            </section>
          ))}
        </div>
      </div>
    </ToolFrame>
  );
}
