import { useMemo, useState } from 'react';
import { Check, Copy, Fingerprint, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateSriHashes } from '../lib/privacyTools';

export default function SriHashGenerator() {
  const [input, setInput] = useState('console.log("utility hub");');
  const [copied, setCopied] = useState<'sha256' | 'sha384' | 'sha512' | null>(null);
  const result = useMemo(() => generateSriHashes(input), [input]);

  const handleCopy = async (value: string, key: 'sha256' | 'sha384' | 'sha512') => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolFrame eyebrow="Security" title="SRI Hash Generator" description="Generate SHA-based Subresource Integrity hashes locally for inline snippets and static assets." actions={<button type="button" className="action-button" onClick={() => setInput('console.log(\"utility hub\");')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Fingerprint size={16} />Asset content</span><span>Paste inline code or file text</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="stack-grid">
          {result.output ? <>
            <article className="editor-panel">
              <div className="editor-panel__head">
                <span>SHA-256</span>
                <button type="button" className="action-button action-button--icon" onClick={() => handleCopy(result.output!.sha256, 'sha256')} aria-label="Copy SHA-256 SRI hash">
                  {copied === 'sha256' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output.sha256} />
            </article>
            <article className="editor-panel">
              <div className="editor-panel__head">
                <span>SHA-384</span>
                <button type="button" className="action-button action-button--icon" onClick={() => handleCopy(result.output!.sha384, 'sha384')} aria-label="Copy SHA-384 SRI hash">
                  {copied === 'sha384' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output.sha384} />
            </article>
            <article className="editor-panel">
              <div className="editor-panel__head">
                <span>SHA-512</span>
                <button type="button" className="action-button action-button--icon" onClick={() => handleCopy(result.output!.sha512, 'sha512')} aria-label="Copy SHA-512 SRI hash">
                  {copied === 'sha512' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output.sha512} />
            </article>
          </> : null}
        </section>
      </div>
    </ToolFrame>
  );
}
