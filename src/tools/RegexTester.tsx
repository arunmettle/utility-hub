import { useState } from 'react';
import { Play, AlertCircle } from 'lucide-react';

interface Match {
  text: string;
  index: number;
  groups?: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false });
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');

  const testRegex = (newPattern?: string, newFlags?: typeof flags, newTestString?: string) => {
    const currentPattern = newPattern !== undefined ? newPattern : pattern;
    const currentFlags = newFlags || flags;
    const currentTestString = newTestString !== undefined ? newTestString : testString;

    if (!currentPattern || !currentTestString) {
      setMatches([]);
      setError('');
      return;
    }

    try {
      const flagString = Object.entries(currentFlags)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
        .join('');

      const regex = new RegExp(currentPattern, flagString);
      const foundMatches: Match[] = [];

      if (currentFlags.g) {
        let match;
        while ((match = regex.exec(currentTestString)) !== null) {
          foundMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          // Prevent infinite loop
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        const match = regex.exec(currentTestString);
        if (match) {
          foundMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1)
          });
        }
      }

      setMatches(foundMatches);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid regular expression');
      setMatches([]);
    }
  };

  const updatePattern = (value: string) => {
    setPattern(value);
    testRegex(value, flags, testString);
  };

  const updateTestString = (value: string) => {
    setTestString(value);
    testRegex(pattern, flags, value);
  };

  const toggleFlag = (flag: keyof typeof flags) => {
    const newFlags = { ...flags, [flag]: !flags[flag] };
    setFlags(newFlags);
    testRegex(pattern, newFlags, testString);
  };

  const clear = () => {
    setPattern('');
    setTestString('');
    setMatches([]);
    setError('');
  };

  const highlightMatches = () => {
    if (!testString || matches.length === 0) return testString;

    let result = '';
    let lastIndex = 0;

    // Sort matches by index
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);

    sortedMatches.forEach((match) => {
      // Add text before match
      result += testString.substring(lastIndex, match.index);
      
      // Add highlighted match
      result += `<mark class="bg-yellow-200 dark:bg-yellow-700 rounded px-1">${match.text}</mark>`;
      
      lastIndex = match.index + match.text.length;
    });

    // Add remaining text
    result += testString.substring(lastIndex);

    return result;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Regex Tester</h1>
        <p className="text-gray-600 dark:text-gray-400">Test and debug regular expressions</p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex gap-2">
        <button
          onClick={() => testRegex()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play size={16} />
          Test
        </button>
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
          {/* Pattern Input */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Regular Expression Pattern
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-mono">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => updatePattern(e.target.value)}
                  placeholder="[A-Z]\w+"
                  className="w-full pl-8 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-gray-900 dark:text-white"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-mono">/</span>
              </div>
            </div>
            
            {/* Flags */}
            <div className="flex gap-3 mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.g}
                  onChange={() => toggleFlag('g')}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">g</code> global
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.i}
                  onChange={() => toggleFlag('i')}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">i</code> case-insensitive
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.m}
                  onChange={() => toggleFlag('m')}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">m</code> multiline
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flags.s}
                  onChange={() => toggleFlag('s')}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">s</code> dotAll
                </span>
              </label>
            </div>
          </div>

          {/* Test String */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Test String
            </label>
            <textarea
              value={testString}
              onChange={(e) => updateTestString(e.target.value)}
              placeholder="Enter text to test against the regex pattern..."
              rows={6}
              className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Invalid Regular Expression</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {!error && pattern && testString && (
            <div className="space-y-6">
              {/* Match count */}
              <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="text-blue-700 dark:text-blue-300">
                  <span className="font-semibold text-2xl">{matches.length}</span>
                  <span className="ml-2">match{matches.length !== 1 ? 'es' : ''} found</span>
                </div>
              </div>

              {/* Highlighted text */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Highlighted Matches</h3>
                <div 
                  className="bg-gray-50 dark:bg-gray-900 rounded p-4 font-mono text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all"
                  dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                />
              </div>

              {/* Match details */}
              {matches.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Match Details</h3>
                  <div className="space-y-3">
                    {matches.map((match, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-900 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Match {i + 1}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Position: {match.index}
                          </span>
                        </div>
                        <code className="text-sm text-gray-900 dark:text-white break-all">
                          {match.text}
                        </code>
                        {match.groups && match.groups.length > 0 && match.groups.some(g => g) && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Capture Groups:</p>
                            {match.groups.map((group, j) => group && (
                              <div key={j} className="text-xs">
                                <span className="text-gray-500 dark:text-gray-400">Group {j + 1}:</span>{' '}
                                <code className="text-gray-900 dark:text-white">{group}</code>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
