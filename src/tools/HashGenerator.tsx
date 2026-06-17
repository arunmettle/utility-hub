import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { md5 } from 'js-md5';
import { sha256 } from 'js-sha256';
import { sha512 } from 'js-sha512';

type HashType = 'md5' | 'sha256' | 'sha512';

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha256: '',
    sha512: ''
  });
  const [copied, setCopied] = useState<HashType | null>(null);

  useEffect(() => {
    if (!input) {
      setHashes({ md5: '', sha256: '', sha512: '' });
      return;
    }

    setHashes({
      md5: md5(input),
      sha256: sha256(input),
      sha512: sha512(input)
    });
  }, [input]);

  const copyToClipboard = async (hash: string, type: HashType) => {
    await navigator.clipboard.writeText(hash);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const clear = () => {
    setInput('');
  };

  const hashTypes: { type: HashType; label: string; color: string }[] = [
    { type: 'md5', label: 'MD5', color: 'from-red-500 to-pink-500' },
    { type: 'sha256', label: 'SHA-256', color: 'from-blue-500 to-cyan-500' },
    { type: 'sha512', label: 'SHA-512', color: 'from-purple-500 to-pink-500' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Hash Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Generate MD5, SHA-256, and SHA-512 hashes</p>
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
        <div className="max-w-4xl">
          {/* Input */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
              rows={4}
              className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Hash Results */}
          <div className="space-y-4">
            {hashTypes.map(({ type, label, color }) => (
              <div key={type} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${color}`}></div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
                  </div>
                  {hashes[type] && (
                    <button
                      onClick={() => copyToClipboard(hashes[type], type)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      {copied === type ? <Check size={14} /> : <Copy size={14} />}
                      {copied === type ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <code className="text-sm font-mono text-gray-900 dark:text-white break-all">
                    {hashes[type] || 'Hash will appear here...'}
                  </code>
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          {input && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <span className="font-semibold">Note:</span> Hash functions are one-way operations. 
                The original text cannot be recovered from the hash.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
