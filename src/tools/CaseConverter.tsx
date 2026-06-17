import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type CaseType = 'camelCase' | 'PascalCase' | 'snake_case' | 'kebab-case' | 'CONSTANT_CASE' | 'Title Case' | 'Sentence case' | 'lower case' | 'UPPER CASE';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<CaseType | null>(null);

  const toCamelCase = (str: string): string => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => 
        index === 0 ? letter.toLowerCase() : letter.toUpperCase()
      )
      .replace(/[\s_-]+/g, '');
  };

  const toPascalCase = (str: string): string => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, letter => letter.toUpperCase())
      .replace(/[\s_-]+/g, '');
  };

  const toSnakeCase = (str: string): string => {
    return str
      .replace(/([A-Z])/g, '_$1')
      .replace(/[\s-]+/g, '_')
      .replace(/^_/, '')
      .toLowerCase();
  };

  const toKebabCase = (str: string): string => {
    return str
      .replace(/([A-Z])/g, '-$1')
      .replace(/[\s_]+/g, '-')
      .replace(/^-/, '')
      .toLowerCase();
  };

  const toConstantCase = (str: string): string => {
    return toSnakeCase(str).toUpperCase();
  };

  const toTitleCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/(?:^|\s|[-_])\w/g, letter => letter.toUpperCase())
      .replace(/[-_]/g, ' ');
  };

  const toSentenceCase = (str: string): string => {
    const lower = str.toLowerCase().replace(/[-_]/g, ' ');
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const conversions: { type: CaseType; convert: (str: string) => string }[] = [
    { type: 'camelCase', convert: toCamelCase },
    { type: 'PascalCase', convert: toPascalCase },
    { type: 'snake_case', convert: toSnakeCase },
    { type: 'kebab-case', convert: toKebabCase },
    { type: 'CONSTANT_CASE', convert: toConstantCase },
    { type: 'Title Case', convert: toTitleCase },
    { type: 'Sentence case', convert: toSentenceCase },
    { type: 'lower case', convert: (str) => str.toLowerCase() },
    { type: 'UPPER CASE', convert: (str) => str.toUpperCase() }
  ];

  const copyToClipboard = async (text: string, type: CaseType) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const clear = () => {
    setInput('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Case Converter</h1>
        <p className="text-gray-600 dark:text-gray-400">Convert between different text cases</p>
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
              placeholder="Enter text to convert..."
              rows={4}
              className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Conversions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversions.map(({ type, convert }) => {
              const output = input ? convert(input) : '';
              return (
                <div key={type} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{type}</h3>
                    {output && (
                      <button
                        onClick={() => copyToClipboard(output, type)}
                        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        {copied === type ? <Check size={12} /> : <Copy size={12} />}
                        {copied === type ? 'Copied!' : 'Copy'}
                      </button>
                    )}
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 min-h-[60px] flex items-center">
                    <code className="text-sm font-mono text-gray-900 dark:text-white break-all">
                      {output || 'Converted text will appear here...'}
                    </code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
