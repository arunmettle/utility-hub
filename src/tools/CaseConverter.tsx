import { useMemo, useState } from 'react';
import { CaseSensitive, Check, Copy } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertCase, type CaseType } from '../lib/privacyTools';

const caseTypes: CaseType[] = [
  'camelCase',
  'PascalCase',
  'snake_case',
  'kebab-case',
  'CONSTANT_CASE',
  'Title Case',
  'Sentence case',
  'lower case',
  'UPPER CASE',
];

export default function CaseConverter() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState<CaseType | null>(null);

  const conversions = useMemo(
    () => caseTypes.map((type) => ({ type, output: convertCase(input, type) })),
    [input],
  );

  const copyConversion = async (type: CaseType, output: string) => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Case Converter"
      description="Transform text across the most common naming conventions used in code, APIs, and documentation."
      actions={
        <button type="button" className="action-button" onClick={() => setInput('')}>
          Clear
        </button>
      }
    >
      <section className="editor-panel">
        <div className="editor-panel__head">
          <span className="editor-panel__heading-with-icon">
            <CaseSensitive size={16} />
            Source text
          </span>
          <span>Multi-format output</span>
        </div>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="editor-textarea editor-textarea--compact"
          placeholder="Paste a string to convert"
        />
      </section>

      <div className="result-grid">
        {conversions.map(({ type, output }) => (
          <section key={type} className="editor-panel">
            <div className="editor-panel__head">
              <span>{type}</span>
              <button type="button" className="action-button action-button--icon" onClick={() => copyConversion(type, output)} disabled={!output}>
                {copied === type ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <textarea value={output} readOnly className="editor-textarea editor-textarea--compact editor-textarea--output" />
          </section>
        ))}
      </div>
    </ToolFrame>
  );
}
