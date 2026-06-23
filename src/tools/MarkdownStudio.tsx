import { useMemo, useState } from 'react';
import { Check, Copy, Eye, RotateCcw, Wand2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { buildMarkdownStudio } from '../lib/privacyTools';

const sampleInput = `Tool                    Category   Privacy
Markdown Studio         Developer  Local only
Prompt Studio           AI         Local only
Text Diff Checker       Testers    Local only`;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function renderMarkdownPreview(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const parts: string[] = [];

  for (let index = 0; index < lines.length; ) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      const language = trimmed.slice(3).trim();
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }

      index += 1;
      parts.push(
        `<pre class="markdown-preview__code"><code${language ? ` data-language="${escapeHtml(language)}"` : ''}>${escapeHtml(codeLines.join('\n'))}</code></pre>`,
      );
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      parts.push(`<h${level}>${renderInlineMarkdown(headingMatch[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^\|.+\|$/.test(trimmed) && index + 1 < lines.length && /^\|\s*:?-{3,}:?(\s*\|\s*:?-{3,}:?)+\s*\|$/.test(lines[index + 1].trim())) {
      const header = trimmed
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim());

      index += 2;
      const body: string[][] = [];

      while (index < lines.length && /^\|.+\|$/.test(lines[index].trim())) {
        body.push(
          lines[index]
            .trim()
            .replace(/^\|/, '')
            .replace(/\|$/, '')
            .split('|')
            .map((cell) => cell.trim()),
        );
        index += 1;
      }

      parts.push(`
        <div class="markdown-preview__table-wrap">
          <table class="markdown-preview__table">
            <thead>
              <tr>${header.map((cell) => `<th>${renderInlineMarkdown(cell)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${body
                .map((row) => `<tr>${header.map((_, cellIndex) => `<td>${renderInlineMarkdown(row[cellIndex] ?? '')}</td>`).join('')}</tr>`)
                .join('')}
            </tbody>
          </table>
        </div>
      `);
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }
      parts.push(`<blockquote>${quoteLines.map((quoteLine) => renderInlineMarkdown(quoteLine)).join('<br />')}</blockquote>`);
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*+]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*+]\s+/, ''));
        index += 1;
      }
      parts.push(`<ul>${items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ''));
        index += 1;
      }
      parts.push(`<ol>${items.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ol>`);
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      parts.push('<hr />');
      index += 1;
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith('```') &&
      !/^(#{1,6})\s+/.test(lines[index].trim()) &&
      !/^>\s?/.test(lines[index].trim()) &&
      !/^[-*+]\s+/.test(lines[index].trim()) &&
      !/^\d+\.\s+/.test(lines[index].trim()) &&
      !/^---+$/.test(lines[index].trim())
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    parts.push(`<p>${renderInlineMarkdown(paragraphLines.join(' '))}</p>`);
  }

  return parts.join('');
}

export default function MarkdownStudio() {
  const [input, setInput] = useState(sampleInput);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => buildMarkdownStudio(input), [input]);
  const previewHtml = useMemo(() => renderMarkdownPreview(result.output?.markdown ?? ''), [result.output?.markdown]);

  const handleCopy = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(result.output.markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Markdown Studio"
      description="Convert messy AI or CLI output into markdown-friendly content with table cleanup, normalized spacing, and a live preview."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy} disabled={!result.output}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy markdown'}
          </button>
          <button type="button" className="action-button" onClick={() => setInput(sampleInput)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Local-first markdown cleanup',
        body: 'Inspired by browser-based markdown workbenches like Markdown Online, but shaped for developer pain points such as CLI table output, rough AI drafts, and markdown that needs to be pasted straight into PRs, wikis, or docs. Everything stays in the browser.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Raw input</span>
            <span>CLI table, markdown, CSV, or plain text</span>
          </div>
          <p className="panel-helper">
            Paste AI or terminal output here. The tool will try to detect table-like structures and convert them into GitHub-friendly markdown automatically.
          </p>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Markdown issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Detected format</span>
                  <strong>{result.output.detectedFormat}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Rows</span>
                  <strong>{result.output.rowCount}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Columns</span>
                  <strong>{result.output.columnCount}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <Wand2 size={16} />
                    Markdown output
                  </span>
                  <span>Ready to paste</span>
                </div>
                <textarea readOnly value={result.output.markdown} className="editor-textarea editor-textarea--output" />
              </section>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <Eye size={16} />
                    Live preview
                  </span>
                  <span>Rendered locally</span>
                </div>
                <div className="markdown-preview" dangerouslySetInnerHTML={{ __html: previewHtml || '<p class="markdown-preview__empty">Nothing to preview yet.</p>' }} />
              </section>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Formatting notes</span>
                  <span>Detection summary</span>
                </div>
                <div className="insight-list">
                  {result.output.notes.map((note) => (
                    <article key={note} className="insight-row">
                      <p>{note}</p>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
