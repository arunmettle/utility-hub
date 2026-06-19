import { useMemo, useState } from 'react';
import { Check, Copy, Play, TriangleAlert } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { analyzeRegex, formatRegexFlags, type RegexFlags } from '../lib/privacyTools';

const defaultFlags: RegexFlags = { g: true, i: false, m: false, s: false };
const samplePattern = '(utility|hub)';
const sampleText = 'utility hub keeps utility workflows local';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default function RegexTester() {
  const [pattern, setPattern] = useState(samplePattern);
  const [flags, setFlags] = useState<RegexFlags>(defaultFlags);
  const [testString, setTestString] = useState(sampleText);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => analyzeRegex(pattern, flags, testString), [flags, pattern, testString]);
  const flagString = formatRegexFlags(flags);

  const highlighted = useMemo(() => {
    if (!testString || result.output.length === 0) {
      return escapeHtml(testString);
    }

    let content = '';
    let lastIndex = 0;

    for (const match of [...result.output].sort((left, right) => left.index - right.index)) {
      content += escapeHtml(testString.slice(lastIndex, match.index));
      content += `<mark class="regex-highlight">${escapeHtml(match.text)}</mark>`;
      lastIndex = match.index + match.text.length;
    }

    content += escapeHtml(testString.slice(lastIndex));
    return content;
  }, [result.output, testString]);

  const copyResults = async () => {
    if (!pattern || !testString) return;

    const lines = [`Pattern: /${pattern}/${flagString}`, '', `Match count: ${result.output.length}`];
    if (result.error) {
      lines.push('', `Error: ${result.error}`);
    } else {
      result.output.forEach((match, index) => {
        lines.push('', `Match ${index + 1} at ${match.index}: ${match.text}`);
        match.groups.forEach((group, groupIndex) => {
          lines.push(`Group ${groupIndex + 1}: ${group}`);
        });
      });
    }

    await navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Tester"
      title="Regex Tester"
      description="Try JavaScript regular expressions with live matches, capture groups, and highlighted text previews."
      actions={
        <>
          <button type="button" className="action-button action-button--primary">
            <Play size={16} />
            Live mode
          </button>
          <button type="button" className="action-button" onClick={copyResults} disabled={!pattern || !testString}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            className="action-button"
            onClick={() => {
              setPattern('');
              setTestString('');
              setFlags(defaultFlags);
            }}
          >
            Clear
          </button>
        </>
      }
      note={{
        title: 'How it works',
        body: 'The expression is evaluated with the browser JavaScript engine, so the behavior matches the environment where your front-end code runs.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Pattern</span>
            <span>JavaScript syntax</span>
          </div>
          <input
            type="text"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            className="tool-input"
            placeholder="(utility|hub)"
          />

          <div className="editor-panel__head editor-panel__head--spaced">
            <span>Flags</span>
            <span>/{flagString || 'none'}</span>
          </div>
          <div className="toggle-list">
            {(Object.keys(flags) as Array<keyof RegexFlags>).map((flag) => (
              <label key={flag} className="toggle-card">
                <input
                  type="checkbox"
                  checked={flags[flag]}
                  onChange={(event) => setFlags((current) => ({ ...current, [flag]: event.target.checked }))}
                />
                <span>{flag}</span>
              </label>
            ))}
          </div>

          <div className="editor-panel__head editor-panel__head--spaced">
            <span>Test string</span>
            <span>Local text only</span>
          </div>
          <textarea
            value={testString}
            onChange={(event) => setTestString(event.target.value)}
            className="editor-textarea editor-textarea--compact"
            placeholder="Paste text to evaluate against the pattern."
          />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Results</span>
            <span>{result.output.length} match{result.output.length === 1 ? '' : 'es'}</span>
          </div>

          {result.error ? (
            <div className="editor-error">
              <strong className="editor-panel__heading-with-icon">
                <TriangleAlert size={16} />
                Invalid pattern
              </strong>
              <p>{result.error}</p>
            </div>
          ) : (
            <>
              <div className="regex-preview" dangerouslySetInnerHTML={{ __html: highlighted || 'Add text to preview matches.' }} />

              <div className="timestamp-card-list">
                {result.output.length > 0 ? (
                  result.output.map((match, index) => (
                    <div key={`${match.index}-${index}`} className="timestamp-card">
                      <strong>
                        Match {index + 1} at {match.index}
                      </strong>
                      <span>{match.text}</span>
                      {match.groups.length > 0 ? (
                        <p className="panel-helper">Groups: {match.groups.join(', ')}</p>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="empty-panel-copy">No matches yet. Adjust the pattern, flags, or text to inspect results.</div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
