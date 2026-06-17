import { useMemo, useState } from 'react';
import { Check, Copy, Shield, TriangleAlert } from 'lucide-react';
import ToolPage from '../components/ToolPage';

interface DecodedToken {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

export default function JWTDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<'header' | 'payload' | 'signature' | null>(null);

  const decodeJWT = (token: string) => {
    setInput(token);

    if (!token.trim()) {
      setDecoded(null);
      setError('');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT tokens must contain header, payload, and signature segments.');
      }

      const [headerB64, payloadB64, signature] = parts;
      const decodePart = (value: string) => JSON.parse(atob(value.replace(/-/g, '+').replace(/_/g, '/')));

      setDecoded({
        header: decodePart(headerB64),
        payload: decodePart(payloadB64),
        signature,
      });
      setError('');
    } catch (decodeError) {
      setError(decodeError instanceof Error ? decodeError.message : 'Invalid JWT token.');
      setDecoded(null);
    }
  };

  const copyToClipboard = async (data: string, type: 'header' | 'payload' | 'signature') => {
    await navigator.clipboard.writeText(data);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const analysis = useMemo(() => {
    if (!decoded) return null;

    const warnings: string[] = [];
    const info: string[] = [];
    const payload = decoded.payload as Record<string, number | string | undefined>;
    const header = decoded.header as Record<string, string | undefined>;

    if (payload.exp) {
      const expiration = new Date(Number(payload.exp) * 1000);
      if (expiration.getTime() < Date.now()) {
        warnings.push(`Token expired on ${expiration.toLocaleString()}.`);
      } else {
        info.push(`Token expires on ${expiration.toLocaleString()}.`);
      }
    }

    if (payload.iat) {
      info.push(`Token issued on ${new Date(Number(payload.iat) * 1000).toLocaleString()}.`);
    }

    if (header.alg === 'none') {
      warnings.push('The token uses the “none” algorithm and should not be trusted.');
    }

    return { warnings, info };
  }, [decoded]);

  const headerOutput = decoded ? JSON.stringify(decoded.header, null, 2) : 'Paste a JWT to inspect the header.';
  const payloadOutput = decoded ? JSON.stringify(decoded.payload, null, 2) : 'Paste a JWT to inspect the payload.';
  const signatureOutput = decoded?.signature ?? 'Paste a JWT to inspect the signature.';

  return (
    <ToolPage
      title="JWT Decoder"
      description="Inspect token headers and payloads without leaving the browser, including simple expiration and algorithm warnings."
      category="Encoders/Decoders"
      icon={Shield}
      actions={
        <button
          type="button"
          onClick={() => {
            setInput('');
            setDecoded(null);
            setError('');
          }}
          className="button-secondary"
        >
          Clear
        </button>
      }
    >
      <section className="app-panel p-6">
        <label className="field-label">JWT Token</label>
        <textarea
          value={input}
          onChange={(event) => decodeJWT(event.target.value)}
          placeholder="Paste a JWT here…"
          className="field-textarea min-h-[140px] font-mono"
        />
      </section>

      {error ? <div className="notice-error">{error}</div> : null}

      {analysis && (analysis.warnings.length > 0 || analysis.info.length > 0) ? (
        <div className="grid grid-cols-1 gap-gutter xl:grid-cols-2">
          {analysis.warnings.length > 0 ? (
            <section className="notice-warning">
              <div className="flex gap-3">
                <TriangleAlert size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Warnings</p>
                  <ul className="mt-2 space-y-1">
                    {analysis.warnings.map((warning) => (
                      <li key={warning}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ) : null}

          {analysis.info.length > 0 ? (
            <section className="notice-info">
              <p className="font-semibold text-text-primary">Analysis</p>
              <ul className="mt-2 space-y-1">
                {analysis.info.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-gutter xl:grid-cols-2">
        <section className="app-panel p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-label-sm uppercase text-text-secondary">Segment</p>
              <h3 className="mt-2 text-headline-sm font-semibold text-text-primary">Header</h3>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(headerOutput, 'header')}
              className="button-ghost"
              disabled={!decoded}
            >
              {copied === 'header' ? <Check size={16} /> : <Copy size={16} />}
              {copied === 'header' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="code-surface overflow-auto whitespace-pre-wrap break-all">{headerOutput}</pre>
        </section>

        <section className="app-panel p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-label-sm uppercase text-text-secondary">Segment</p>
              <h3 className="mt-2 text-headline-sm font-semibold text-text-primary">Payload</h3>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(payloadOutput, 'payload')}
              className="button-ghost"
              disabled={!decoded}
            >
              {copied === 'payload' ? <Check size={16} /> : <Copy size={16} />}
              {copied === 'payload' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="code-surface overflow-auto whitespace-pre-wrap break-all">{payloadOutput}</pre>
        </section>

        <section className="app-panel p-6 xl:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-label-sm uppercase text-text-secondary">Segment</p>
              <h3 className="mt-2 text-headline-sm font-semibold text-text-primary">Signature</h3>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(signatureOutput, 'signature')}
              className="button-ghost"
              disabled={!decoded}
            >
              {copied === 'signature' ? <Check size={16} /> : <Copy size={16} />}
              {copied === 'signature' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="mt-4 code-surface break-all">{signatureOutput}</div>
          <p className="mt-3 text-body-md text-text-secondary">
            Signature verification requires the original signing secret or public key.
          </p>
        </section>
      </div>
    </ToolPage>
  );
}
