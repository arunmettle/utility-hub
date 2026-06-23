import { useMemo, useState } from 'react';
import { CaseSensitive, Check, Copy, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { slugifyText } from '../lib/privacyTools';

export default function SlugifyStudio() {
  const [input, setInput] = useState('Privacy First UtilityHub');
  const [copied, setCopied] = useState<string | null>(null);

  const slug = useMemo(() => slugifyText(input), [input]);
  const variants = useMemo(
    () => ({
      kebab: slug,
      snake: slug.replace(/-/g, '_'),
      path: `/tools/${slug}`,
    }),
    [slug],
  );

  const copyValue = async (value: string, key: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Slugify Studio"
      description="Turn headings, labels, or filenames into clean URL-friendly slugs with a few ready-to-copy variants."
      actions={
        <button type="button" className="action-button" onClick={() => setInput('')}>
          <Trash2 size={16} />
          Clear
        </button>
      }
    >
      <div className="stack-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <CaseSensitive size={16} />
              Source text
            </span>
            <span>Lowercase normalized</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="editor-textarea editor-textarea--compact"
            placeholder="Enter a title or label to slugify"
          />
        </section>

        <div className="result-grid">
          {[
            { key: 'kebab', label: 'Kebab case slug', value: variants.kebab },
            { key: 'snake', label: 'Snake case', value: variants.snake },
            { key: 'path', label: 'Path preview', value: variants.path },
          ].map((item) => (
            <section key={item.key} className="editor-panel">
              <div className="editor-panel__head">
                <span>{item.label}</span>
                <button
                  type="button"
                  className="action-button action-button--icon"
                  onClick={() => copyValue(item.value, item.key)}
                  aria-label={`Copy ${item.label}`}
                >
                  {copied === item.key ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <textarea value={item.value} readOnly className="editor-textarea editor-textarea--compact editor-textarea--output" />
            </section>
          ))}
        </div>
      </div>
    </ToolFrame>
  );
}
