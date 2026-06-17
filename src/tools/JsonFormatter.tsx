import { useState } from 'react';
import { Copy, Check, AlertCircle, Wand2 } from 'lucide-react';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = (value: string) => {
    setInput(value);
    if (!value.trim()) {
      setOutput('');
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
      setOutput('');
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">JSON Formatter</h1>
        <p className="text-gray-600 dark:text-gray-400">Format, validate and beautify your JSON data</p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex gap-2">
        <button
          onClick={minifyJson}
          disabled={!input.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Wand2 size={16} />
          Minify
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
            Input JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => formatJson(e.target.value)}
            placeholder='{"name": "John", "age": 30}'
            className="flex-1 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Formatted Output
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
          {error ? (
            <div className="flex-1 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Invalid JSON</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-900 dark:text-white resize-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
