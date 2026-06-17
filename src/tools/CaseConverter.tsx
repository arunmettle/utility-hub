import { useState } from 'react';
import { CaseSensitive, Check, Copy } from 'lucide-react';
import ToolPage from '../components/ToolPage';

type CaseType =
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'CONSTANT_CASE'
  | 'Title Case'
  | 'Sentence case'
  | 'lower case'
  | 'UPPER CASE';

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<CaseType | null>(null);

  const toCamelCase = (value: string) =>
    value
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => (index === 0 ? letter.toLowerCase() : letter.toUpperCase()))
      .replace(/[\s_-]+/g, '');

  const toPascalCase = (value: string) =>
    value
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
      .replace(/[\s_-]+/g, '');

  const toSnakeCase = (value: string) =>
    value
      .replace(/([A-Z])/g, '_$1')
      .replace(/[\s-]+/g, '_')
      .replace(/^_/, '')
      .toLowerCase();

  const toKebabCase = (value: string) =>
    value
      .replace(/([A-Z])/g, '-$1')
      .replace(/[\s_]+/g, '-')
      .replace(/^-/, '')
      .toLowerCase();

  const conversions: { type: CaseType; convert: (value: string) => string }[] = [
    { type: 'camelCase', convert: toCamelCase },
    { type: 'PascalCase', convert: toPascalCase },
    { type: 'snake_case', convert: toSnakeCase },
    { type: 'kebab-case', convert: toKebabCase },
    { type: 'CONSTANT_CASE', convert: (value) => toSnakeCase(value).toUpperCase() },
    {
      type: 'Title Case',
      convert: (value) =>
        value
          .toLowerCase()
          .replace(/(?:^|\s|[-_])\w/g, (letter) => letter.toUpperCase())
          .replace(/[-_]/g, ' '),
    },
    {
      type: 'Sentence case',
      convert: (value) => {
        const lower = value.toLowerCase().replace(/[-_]/g, ' ');
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      },
    },
    { type: 'lower case', convert: (value) => value.toLowerCase() },
    { type: 'UPPER CASE', convert: (value) => value.toUpperCase() },
  ];

  const copyToClipboard = async (text: string, type: CaseType) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolPage
      title="Case Converter"
      description="Convert strings into naming conventions commonly used across APIs, codebases, and documentation."
      category="Converters"
      icon={CaseSensitive}
      actions={
        <button type="button" onClick={() => setInput('')} className="button-secondary">
          Clear
        </button>
      }
    >
      <section className="app-panel p-6">
        <label className="field-label">Input Text</label>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste a string to transform…"
          className="field-textarea min-h-[160px]"
        />
      </section>

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
        {conversions.map(({ type, convert }) => {
          const output = input ? convert(input) : '';

          return (
            <div key={type} className="app-panel p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-label-sm uppercase text-text-secondary">Format</p>
                  <h3 className="mt-2 text-headline-sm font-semibold text-text-primary">{type}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(output, type)}
                  className="button-ghost"
                  disabled={!output}
                >
                  {copied === type ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div className="code-surface min-h-[124px] break-all">{output || 'Converted output appears here…'}</div>
            </div>
          );
        })}
      </section>
    </ToolPage>
  );
}
