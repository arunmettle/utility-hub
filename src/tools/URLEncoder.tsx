import { useState } from 'react';
import { Copy, Check, ArrowLeftRight } from 'lucide-react';

export default function URLEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const processInput = (value: string, newMode?: 'encode' | 'decode') => {
    setInput(value);
    const currentMode = newMode || mode;
    setError('');

    if (!value) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        const encoded = encodeURIComponent(value);
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(value);
        setOutput(decoded);
      }
    } catch (e) {
      setError(currentMode === 'decode' ? 'Invalid URL-encoded string' : 'Encoding error');
      setOutput('');
    }
  };

  const switchMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    if (output) {
      setInput(output);
      processInput(output, newMode);
    } else {
      processInput(input, newMode);
    }
  };

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">URL Encoder/Decoder</h1>
        <p className="text-gray-600 dark:text-gray-400">Encode and decode URL strings</p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex gap-2">
        <button
          onClick={switchMode}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeftRight size={16} />
          Switch to {mode === 'encode' ? 'Decode' : 'Encode'}
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 overflow-hidden">
        {/* Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input ({mode === 'encode' ? 'Plain Text' : 'URL Encoded'})
          </label>
          <textarea
            value={input}
            onChange={(e) => processInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter URL-encoded text to decode...'}
            className="flex-1 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Output ({mode === 'encode' ? 'URL Encoded' : 'Plain Text'})
            </label>
            {output && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={error || output}
            readOnly
            placeholder="Result will appear here..."
            className={`flex-1 p-4 border rounded-lg font-mono text-sm resize-none ${
              error
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                : 'bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white'
            }`}
          />
        </div>
      </div>

      {/* Examples */}
      <div className="px-6 pb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Examples:</h3>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-blue-800 dark:text-blue-300">
                <span className="font-medium">Original:</span> Hello World!
              </p>
              <p className="text-blue-700 dark:text-blue-400 font-mono">
                <span className="font-medium">Encoded:</span> Hello%20World%21
              </p>
            </div>
            <div>
              <p className="text-blue-800 dark:text-blue-300">
                <span className="font-medium">Original:</span> user@example.com
              </p>
              <p className="text-blue-700 dark:text-blue-400 font-mono">
                <span className="font-medium">Encoded:</span> user%40example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
