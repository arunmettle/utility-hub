import { useState } from 'react';
import { Copy, Check, AlertTriangle } from 'lucide-react';

interface DecodedToken {
  header: any;
  payload: any;
  signature: string;
}

export default function JWTDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<'header' | 'payload' | null>(null);

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
        throw new Error('Invalid JWT format. Must have 3 parts separated by dots.');
      }

      const [headerB64, payloadB64, signature] = parts;

      // Decode header
      const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
      
      // Decode payload
      const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));

      setDecoded({ header, payload, signature });
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JWT token');
      setDecoded(null);
    }
  };

  const copyToClipboard = async (data: any, type: 'header' | 'payload') => {
    const text = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const clear = () => {
    setInput('');
    setDecoded(null);
    setError('');
  };

  const analyzeToken = () => {
    if (!decoded) return null;

    const warnings: string[] = [];
    const info: string[] = [];

    // Check expiration
    if (decoded.payload.exp) {
      const expDate = new Date(decoded.payload.exp * 1000);
      const now = new Date();
      if (expDate < now) {
        warnings.push(`Token expired on ${expDate.toLocaleString()}`);
      } else {
        info.push(`Token expires on ${expDate.toLocaleString()}`);
      }
    }

    // Check issued at
    if (decoded.payload.iat) {
      const iatDate = new Date(decoded.payload.iat * 1000);
      info.push(`Token issued on ${iatDate.toLocaleString()}`);
    }

    // Check algorithm
    if (decoded.header.alg === 'none') {
      warnings.push('Token uses "none" algorithm - this is insecure!');
    }

    return { warnings, info };
  };

  const analysis = analyzeToken();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">JWT Decoder</h1>
        <p className="text-gray-600 dark:text-gray-400">Decode and analyze JWT tokens</p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl">
          {/* Input */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              JWT Token
            </label>
            <textarea
              value={input}
              onChange={(e) => decodeJWT(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
              rows={4}
              className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Invalid Token</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Decoded Data */}
          {decoded && (
            <div className="space-y-6">
              {/* Analysis */}
              {analysis && (analysis.warnings.length > 0 || analysis.info.length > 0) && (
                <div className="space-y-3">
                  {analysis.warnings.length > 0 && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Warnings</p>
                          <ul className="space-y-1">
                            {analysis.warnings.map((warning, i) => (
                              <li key={i} className="text-sm text-yellow-700 dark:text-yellow-400">
                                • {warning}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  {analysis.info.length > 0 && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <ul className="space-y-1">
                        {analysis.info.map((info, i) => (
                          <li key={i} className="text-sm text-blue-700 dark:text-blue-300">
                            • {info}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Header */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Header</h3>
                  <button
                    onClick={() => copyToClipboard(decoded.header, 'header')}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {copied === 'header' ? <Check size={14} /> : <Copy size={14} />}
                    {copied === 'header' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-gray-50 dark:bg-gray-900 rounded p-4 overflow-auto text-sm">
                  <code className="text-gray-900 dark:text-white">
                    {JSON.stringify(decoded.header, null, 2)}
                  </code>
                </pre>
              </div>

              {/* Payload */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Payload</h3>
                  <button
                    onClick={() => copyToClipboard(decoded.payload, 'payload')}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {copied === 'payload' ? <Check size={14} /> : <Copy size={14} />}
                    {copied === 'payload' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-gray-50 dark:bg-gray-900 rounded p-4 overflow-auto text-sm">
                  <code className="text-gray-900 dark:text-white">
                    {JSON.stringify(decoded.payload, null, 2)}
                  </code>
                </pre>
              </div>

              {/* Signature */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Signature</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-4">
                  <code className="text-sm font-mono text-gray-900 dark:text-white break-all">
                    {decoded.signature}
                  </code>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  The signature is base64 encoded and cannot be verified without the secret key.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
