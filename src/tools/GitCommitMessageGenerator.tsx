import { useMemo, useState } from 'react';
import { Check, Copy, GitCommitHorizontal, ListOrdered, RotateCcw, Sparkles, TerminalSquare } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateCommitSuggestions } from '../lib/privacyTools';

const sampleInput = `fix sidebar toggle transition on desktop
- remove horizontal scrollbar during collapse
- keep accordion state stable while toggling`;

const sampleDiffInput = `diff --git a/src/components/AppShell.tsx b/src/components/AppShell.tsx
index 1111111..2222222 100644
--- a/src/components/AppShell.tsx
+++ b/src/components/AppShell.tsx
@@ -24,7 +24,7 @@ export default function AppShell() {
-  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(true);
+  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(false);
@@ -72,6 +72,7 @@
+  document.body.style.overflowX = 'hidden';`;

export default function GitCommitMessageGenerator() {
  const [input, setInput] = useState(sampleInput);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const result = useMemo(() => generateCommitSuggestions(input), [input]);
  const isDiffInput = /(^diff --git )|(^@@ )|(^\+\+\+ )|(^--- )/m.test(input);

  const handleCopy = async (message: string) => {
    await navigator.clipboard.writeText(message);
    setCopiedMessage(message);
    window.setTimeout(() => setCopiedMessage(null), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Git Commit Message Generator"
      description="Turn rough diff notes into conventional, release-note, and team-friendly commit messages without sending code anywhere."
      actions={
        <>
          <button
            type="button"
            className="action-button action-button--primary"
            onClick={() => setInput(sampleInput)}
          >
            <Sparkles size={16} />
            Load sample
          </button>
          <button type="button" className="action-button" onClick={() => setInput('')}>
            <RotateCcw size={16} />
            Clear
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleDiffInput)}>
            <TerminalSquare size={16} />
            Load diff sample
          </button>
        </>
      }
      note={{
        title: 'Commit quality',
        body: 'This tool now accepts either short notes or pasted unified diff output. For diff mode, run git diff or git diff --staged and paste the patch directly into the input box.',
      }}
    >
      <div className="stack-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <ListOrdered size={16} />
              How to use
            </span>
            <span>{isDiffInput ? 'Diff input detected' : 'Notes mode detected'}</span>
          </div>
          <div className="insight-list">
            <article className="insight-row">
              <strong>Option 1: Paste short notes</strong>
              <p>Describe the change in one line or a few bullets, for example what you fixed, added, or cleaned up.</p>
            </article>
            <article className="insight-row">
              <strong>Option 2: Paste git diff output</strong>
              <div className="command-block" aria-label="Git diff commands">
                <span className="command-block__line">
                  <code>git diff</code>
                </span>
                <span className="command-block__line">
                  <code>git diff --staged</code>
                </span>
              </div>
              <p>Paste the unified diff here, and the tool will infer likely type, scope, and subject from changed files and diff hunks.</p>
            </article>
            <article className="insight-row">
              <strong>Best for</strong>
              <p>Simple or focused changes work best. Mixed commits across unrelated files can still produce weaker suggestions.</p>
            </article>
          </div>
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>{isDiffInput ? 'Diff input' : 'Change notes'}</span>
            <span>{isDiffInput ? 'Paste git diff or git diff --staged output' : 'Paste a short summary or bullet list'}</span>
          </div>
          <p className="panel-helper">
            {isDiffInput
              ? 'Unified diff input detected. The generator will read file paths and changed lines to build commit suggestions.'
              : 'You can paste plain notes, or switch to diff mode by pasting unified git diff output.'}
          </p>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="editor-textarea"
            placeholder="Describe the work you just completed, or paste git diff output"
          />
        </section>

        <section className="result-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Generation issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output.length > 0 ? (
            result.output.map((suggestion) => (
              <article key={suggestion.label} className="insight-card">
                <div className="insight-card__head">
                  <span className="insight-card__title">
                    <GitCommitHorizontal size={16} />
                    {suggestion.label}
                  </span>
                  <button type="button" className="action-button action-button--icon" onClick={() => handleCopy(suggestion.message)} aria-label={`Copy ${suggestion.label}`}>
                    {copiedMessage === suggestion.message ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <pre className="code-output">{suggestion.message}</pre>
                <p className="insight-card__body">{suggestion.rationale}</p>
              </article>
            ))
          ) : (
            <div className="empty-panel-copy">Add some change notes to generate commit suggestions.</div>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
