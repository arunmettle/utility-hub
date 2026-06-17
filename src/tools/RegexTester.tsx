import { useState } from 'react';
import { Check, Copy, FlaskConical, Play, TriangleAlert } from 'lucide-react';
import ToolPage from '../components/ToolPage';

interface Match {
  text: string;
  index: number;
  groups?: string[];
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const testRegex = (nextPattern?: string, nextFlags?: typeof flags, nextTestString?: string) => {
    const activePattern = nextPattern ?? pattern;
    const activeFlags = nextFlags ?? flags;
    const activeTestString = nextTestString ?? testString;

    if (!activePattern || !activeTestString) {
      setMatches([]);
      setError('');
      return;
    }

    try {
      const flagString = Object.entries(activeFlags)
        .filter(([, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('');

      const regex = new RegExp(activePattern, flagString);
      const foundMatches: Match[] = [];

      if (activeFlags.g) {
        let match: RegExpExecArray | null;
        while ((match = regex.exec(activeTestString)) !== null) {
          foundMatches.push({ text: match[0], index: match.index, groups: match.slice(1) });
          if (match.index === regex.lastIndex) regex.lastIndex += 1;
        }
      } else {
        const match = regex.exec(activeTestString);
        if (match) {
          foundMatches.push({ text: match[0], index: match.index, groups: match.slice(1) });
        }
      }

      setMatches(foundMatches);
      setError('');
    } catch (regexError) {
      setError(regexError instanceof Error ? regexError.message : 'Invalid regular expression.');
      setMatches([]);
    }
  };

  const highlightMatches = () => {
    if (!testString || matches.length === 0) return escapeHtml(testString);

    let result = '';
    let lastIndex = 0;

    [...matches]
      .sort((left, right) => left.index - right.index)
      .forEach((match) => {
        result += escapeHtml(testString.substring(lastIndex, match.index));
        result += `<mark class="rounded bg-[#DBEAFE] px-1 text-[#0058be]">${escapeHtml(match.text)}</mark>`;
        lastIndex = match.index + match.text.length;
      });

    result += escapeHtml(testString.substring(lastIndex));
    return result;
  };

  const buildResultsText = () => {
    if (!pattern || !testString) return '';

    const flagString = Object.entries(flags)
      .filter(([, enabled]) => enabled)
      .map(([flag]) => flag)
      .join('');

    if (error) {
      return `Pattern: /${pattern}/${flagString}\n\nError: ${error}`;
    }

    const lines = [`Pattern: /${pattern}/${flagString}`, '', `Match count: ${matches.length}`];

    if (matches.length === 0) {
      lines.push('No matches found.');
      return lines.join('\n');
    }

    matches.forEach((match, index) => {
      lines.push('', `Match ${index + 1} (position ${match.index})`, match.text);

      match.groups?.forEach((group, groupIndex) => {
        if (group) {
          lines.push(`Group ${groupIndex + 1}: ${group}`);
        }
      });
    });

    return lines.join('\n');
  };

  const copyResults = async () => {
    const results = buildResultsText();
    if (!results) return;

    await navigator.clipboard.writeText(results);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPage
      title="Regex Tester"
      description="Test JavaScript regular expressions with instant match counts, highlighted results, and capture group inspection."
      category="Testers"
      icon={FlaskConical}
      actions={
        <>
          <button type="button" onClick={() => testRegex()} className="button-primary">
            <Play size={16} />
            Test Pattern
          </button>
          <button
            type="button"
            onClick={copyResults}
            className="button-secondary"
            disabled={!pattern || !testString}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            type="button"
            onClick={() => {
              setPattern('');
              setTestString('');
              setMatches([]);
              setError('');
              setCopied(false);
            }}
            className="button-secondary"
          >
            Clear
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-gutter xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <div className="app-panel p-6">
            <label className="field-label">Pattern</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-text-secondary">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(event) => {
                  setPattern(event.target.value);
                  testRegex(event.target.value, flags, testString);
                }}
                placeholder="[A-Z]\w+"
                className="field-input pl-8 pr-8 font-mono"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-text-secondary">/</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {(Object.keys(flags) as Array<keyof typeof flags>).map((flag) => (
                <label key={flag} className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
                  <input
                    type="checkbox"
                    checked={flags[flag]}
                    onChange={() => {
                      const nextFlags = { ...flags, [flag]: !flags[flag] };
                      setFlags(nextFlags);
                      testRegex(pattern, nextFlags, testString);
                    }}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-body-md text-text-primary">
                    <code className="font-mono">{flag}</code>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="app-panel p-6">
            <label className="field-label">Test String</label>
            <textarea
              value={testString}
              onChange={(event) => {
                setTestString(event.target.value);
                testRegex(pattern, flags, event.target.value);
              }}
              placeholder="Paste text to test against your pattern…"
              className="field-textarea min-h-[280px] font-mono"
            />
          </div>
        </section>

        <section className="space-y-6">
          {error ? (
            <div className="notice-error">
              <div className="flex gap-3">
                <TriangleAlert size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Invalid pattern</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : null}

          {!error && pattern && testString ? (
            <>
              <div className="notice-info">
                <span className="font-semibold text-text-primary">{matches.length}</span> match{matches.length === 1 ? '' : 'es'} found.
              </div>

              <div className="app-panel p-6">
                <p className="font-mono text-label-sm uppercase text-text-secondary">Highlighted Matches</p>
                <div
                  className="mt-4 code-surface whitespace-pre-wrap break-all"
                  dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                />
              </div>

              {matches.length > 0 ? (
                <div className="app-panel p-6">
                  <p className="font-mono text-label-sm uppercase text-text-secondary">Match Details</p>
                  <div className="mt-4 space-y-3">
                    {matches.map((match, index) => (
                      <div key={`${match.index}-${index}`} className="mini-card">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-body-md font-medium text-text-primary">Match {index + 1}</p>
                          <span className="font-mono text-[11px] uppercase text-text-secondary">Position {match.index}</span>
                        </div>
                        <div className="mt-3 code-surface break-all">{match.text}</div>
                        {match.groups?.some(Boolean) ? (
                          <div className="mt-3 border-t border-border pt-3 text-body-md text-text-secondary">
                            {match.groups.map((group, groupIndex) =>
                              group ? (
                                <p key={`${group}-${groupIndex}`}>
                                  <span className="font-mono text-[11px] uppercase">Group {groupIndex + 1}</span>: {group}
                                </p>
                              ) : null,
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="app-panel p-6">
              <p className="text-body-md text-text-secondary">Add both a pattern and test string to inspect results.</p>
            </div>
          )}
        </section>
      </div>
    </ToolPage>
  );
}
