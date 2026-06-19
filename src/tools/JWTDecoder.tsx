import { useMemo, useState } from 'react';
import { Check, Copy, Shield, TriangleAlert } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { analyzeJwtToken, decodeJwtToken } from '../lib/privacyTools';

const sampleToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dGlsaXR5LWh1YiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxODYyMjAwMCwiZXhwIjoyMDMyNjIyMDAwfQ.signature';

export default function JWTDecoder() {
  const [input, setInput] = useState(sampleToken);
  const [copied, setCopied] = useState<'header' | 'payload' | 'signature' | null>(null);

  const decoded = decodeJwtToken(input);
  const analysis = useMemo(() => (decoded.output ? analyzeJwtToken(decoded.output) : null), [decoded.output]);

  const copyValue = async (value: string, type: 'header' | 'payload' | 'signature') => {
    if (!decoded.output) return;
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1500);
  };

  const headerOutput = decoded.output ? JSON.stringify(decoded.output.header, null, 2) : '';
  const payloadOutput = decoded.output ? JSON.stringify(decoded.output.payload, null, 2) : '';
  const signatureOutput = decoded.output?.signature ?? '';

  return (
    <ToolFrame
      eyebrow="Security"
      title="JWT Decoder"
      description="Inspect token headers and payloads locally, with lightweight expiry and algorithm warnings to keep debugging safe."
      actions={
        <button
          type="button"
          className="action-button"
          onClick={() => {
            setInput('');
            setCopied(null);
          }}
        >
          Clear
        </button>
      }
      note={{
        title: 'Privacy note',
        body: 'This tool decodes tokens in the browser only. Signature verification still requires the original signing secret or public key.',
      }}
    >
      <div className="stack-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <Shield size={16} />
              Token input
            </span>
            <span>Header.Payload.Signature</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="editor-textarea editor-textarea--compact"
            placeholder="Paste a JWT to decode it locally."
          />
        </section>

        {decoded.error ? (
          <div className="editor-error">
            <strong>Invalid token</strong>
            <p>{decoded.error}</p>
          </div>
        ) : null}

        {analysis && (analysis.warnings.length > 0 || analysis.info.length > 0) ? (
          <div className="result-grid">
            {analysis.warnings.length > 0 ? (
              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <TriangleAlert size={16} />
                    Warnings
                  </span>
                  <span>Review carefully</span>
                </div>
                <div className="timestamp-card-list">
                  {analysis.warnings.map((warning) => (
                    <div key={warning} className="timestamp-card">
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {analysis.info.length > 0 ? (
              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Analysis</span>
                  <span>Token metadata</span>
                </div>
                <div className="timestamp-card-list">
                  {analysis.info.map((item) => (
                    <div key={item} className="timestamp-card">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}

        <div className="result-grid">
          <section className="editor-panel">
            <div className="editor-panel__head">
              <span>Header</span>
              <button
                type="button"
                className="action-button action-button--icon"
                onClick={() => copyValue(headerOutput, 'header')}
                disabled={!headerOutput}
                aria-label="Copy header"
              >
                {copied === 'header' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <textarea
              readOnly
              value={headerOutput || 'Paste a JWT to inspect the header.'}
              className="editor-textarea editor-textarea--output editor-textarea--compact"
            />
          </section>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span>Payload</span>
              <button
                type="button"
                className="action-button action-button--icon"
                onClick={() => copyValue(payloadOutput, 'payload')}
                disabled={!payloadOutput}
                aria-label="Copy payload"
              >
                {copied === 'payload' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <textarea
              readOnly
              value={payloadOutput || 'Paste a JWT to inspect the payload.'}
              className="editor-textarea editor-textarea--output editor-textarea--compact"
            />
          </section>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span>Signature</span>
              <button
                type="button"
                className="action-button action-button--icon"
                onClick={() => copyValue(signatureOutput, 'signature')}
                disabled={!signatureOutput}
                aria-label="Copy signature"
              >
                {copied === 'signature' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <textarea
              readOnly
              value={signatureOutput || 'Paste a JWT to inspect the signature.'}
              className="editor-textarea editor-textarea--output editor-textarea--compact"
            />
          </section>
        </div>
      </div>
    </ToolFrame>
  );
}
