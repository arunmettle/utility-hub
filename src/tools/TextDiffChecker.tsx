import { useMemo, useState } from 'react';
import { Check, Copy, EyeOff, GitCompareArrows, Trash2 } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { diffInlineText, diffText, type DiffLine } from '../lib/privacyTools';

const leftSample = 'Cobalt\nprivacy-first\nbrowser tools';
const rightSample = 'Cobalt\nprivacy-first\nbrowser workflows\nnew utility';

interface DiffRow {
  kind: 'unchanged' | 'added' | 'removed' | 'changed';
  leftLineNumber: number | null;
  rightLineNumber: number | null;
  leftValue: string;
  rightValue: string;
}

function buildDiffRows(lines: DiffLine[]) {
  const rows: DiffRow[] = [];
  let leftLineNumber = 1;
  let rightLineNumber = 1;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const nextLine = lines[index + 1];

    if (line.kind === 'removed' && nextLine?.kind === 'added') {
      rows.push({
        kind: 'changed',
        leftLineNumber,
        rightLineNumber,
        leftValue: line.value,
        rightValue: nextLine.value,
      });
      leftLineNumber += 1;
      rightLineNumber += 1;
      index += 1;
      continue;
    }

    if (line.kind === 'added') {
      rows.push({
        kind: 'added',
        leftLineNumber: null,
        rightLineNumber,
        leftValue: '',
        rightValue: line.value,
      });
      rightLineNumber += 1;
      continue;
    }

    if (line.kind === 'removed') {
      rows.push({
        kind: 'removed',
        leftLineNumber,
        rightLineNumber: null,
        leftValue: line.value,
        rightValue: '',
      });
      leftLineNumber += 1;
      continue;
    }

    rows.push({
      kind: 'unchanged',
      leftLineNumber,
      rightLineNumber,
      leftValue: line.value,
      rightValue: line.value,
    });
    leftLineNumber += 1;
    rightLineNumber += 1;
  }

  return rows;
}

function countNonEmptyLines(value: string) {
  if (!value.trim()) return 0;
  return value.split(/\r?\n/).length;
}

function countVisibleBlocks(rows: DiffRow[]) {
  if (rows.length === 0) return 0;

  let blocks = 1;

  for (let index = 1; index < rows.length; index += 1) {
    const previousKind = rows[index - 1].kind === 'unchanged' ? 'unchanged' : 'changed';
    const currentKind = rows[index].kind === 'unchanged' ? 'unchanged' : 'changed';

    if (previousKind !== currentKind) {
      blocks += 1;
    }
  }

  return blocks;
}

function DiffCodeText({
  row,
  tone,
}: {
  row: DiffRow;
  tone: 'left' | 'right';
}) {
  if (row.kind === 'changed') {
    const fragments = diffInlineText(row.leftValue, row.rightValue);
    const activeFragments = tone === 'left' ? fragments.left : fragments.right;

    return (
      <>
        {activeFragments.map((fragment, index) => (
          <span
            key={`${fragment.kind}-${index}-${fragment.value}`}
            className={`diff-code-fragment ${
              fragment.kind === 'unchanged'
                ? ''
                : tone === 'left'
                  ? 'diff-code-fragment--removed'
                  : 'diff-code-fragment--added'
            }`}
          >
            {fragment.value}
          </span>
        ))}
      </>
    );
  }

  return <>{tone === 'left' ? row.leftValue || ' ' : row.rightValue || ' '}</>;
}

export default function TextDiffChecker() {
  const [left, setLeft] = useState(leftSample);
  const [right, setRight] = useState(rightSample);
  const [hideUnchanged, setHideUnchanged] = useState(false);
  const [copiedSide, setCopiedSide] = useState<'left' | 'right' | null>(null);
  const diffLines = useMemo(() => diffText(left, right), [left, right]);
  const diffRows = useMemo(() => buildDiffRows(diffLines), [diffLines]);
  const visibleRows = useMemo(
    () => (hideUnchanged ? diffRows.filter((row) => row.kind !== 'unchanged') : diffRows),
    [diffRows, hideUnchanged],
  );
  const visibleBlockCount = useMemo(() => countVisibleBlocks(visibleRows), [visibleRows]);
  const summary = useMemo(
    () =>
      diffRows.reduce(
        (accumulator, row) => {
          if (row.kind === 'added') accumulator.added += 1;
          if (row.kind === 'removed') accumulator.removed += 1;
          if (row.kind === 'changed') accumulator.changed += 1;
          if (row.kind === 'unchanged') accumulator.unchanged += 1;
          return accumulator;
        },
        { added: 0, removed: 0, changed: 0, unchanged: 0 },
      ),
    [diffRows],
  );
  const leftLineCount = useMemo(() => countNonEmptyLines(left), [left]);
  const rightLineCount = useMemo(() => countNonEmptyLines(right), [right]);

  const copyPane = async (value: string, side: 'left' | 'right') => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedSide(side);
    window.setTimeout(() => setCopiedSide(null), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Tester"
      title="Text Diff Checker"
      description="Compare two text blocks in a pull-request style review layout with grouped change blocks and inline delta highlights."
      actions={
        <>
          <button type="button" className="action-button" onClick={() => setHideUnchanged((current) => !current)} aria-pressed={hideUnchanged}>
            <EyeOff size={16} />
            {hideUnchanged ? 'Show unchanged' : 'Hide unchanged'}
          </button>
          <button
            type="button"
            className="action-button"
            onClick={() => {
              setLeft('');
              setRight('');
            }}
          >
            <Trash2 size={16} />
            Clear
          </button>
        </>
      }
      note={{
        title: 'Review flow',
        body: 'For code reviews, split view with line numbers is usually easiest. When you only want to inspect edits, turn on Hide unchanged to reduce noise.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Original text</span>
            <span>Left side</span>
          </div>
          <textarea value={left} onChange={(event) => setLeft(event.target.value)} className="editor-textarea editor-textarea--compact" />
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Updated text</span>
            <span>Right side</span>
          </div>
          <textarea value={right} onChange={(event) => setRight(event.target.value)} className="editor-textarea editor-textarea--compact" />
        </section>
      </div>

      <section className="editor-panel">
        <div className="editor-panel__head">
          <span className="editor-panel__heading-with-icon">
            <GitCompareArrows size={16} />
            Review diff
          </span>
          <span>{visibleBlockCount} blocks</span>
        </div>
        <div className="diff-summary" aria-label="Diff summary">
          <span className="diff-summary__pill diff-summary__pill--changed">Changed {summary.changed}</span>
          <span className="diff-summary__pill diff-summary__pill--added">Added {summary.added}</span>
          <span className="diff-summary__pill diff-summary__pill--removed">Removed {summary.removed}</span>
          <span className="diff-summary__pill">Unchanged {summary.unchanged}</span>
        </div>
        {visibleRows.length > 0 ? (
          <div className="pr-diff" aria-label="Pull request style diff view">
            <div className="pr-diff__frame">
              <div className="pr-diff__panes">
                <section className="pr-diff__pane">
                  <div className="pr-diff__pane-head pr-diff__pane-head--removed">
                    <div className="pr-diff__pane-meta">
                      <strong>{summary.removed + summary.changed} removals</strong>
                    </div>
                    <div className="pr-diff__pane-actions">
                      <span>{leftLineCount} lines</span>
                      <button type="button" className="pr-diff__copy" onClick={() => copyPane(left, 'left')}>
                        {copiedSide === 'left' ? <Check size={14} /> : <Copy size={14} />}
                        {copiedSide === 'left' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </section>

                <section className="pr-diff__pane">
                  <div className="pr-diff__pane-head pr-diff__pane-head--added">
                    <div className="pr-diff__pane-meta">
                      <strong>{summary.added + summary.changed} additions</strong>
                    </div>
                    <div className="pr-diff__pane-actions">
                      <span>{rightLineCount} lines</span>
                      <button type="button" className="pr-diff__copy" onClick={() => copyPane(right, 'right')}>
                        {copiedSide === 'right' ? <Check size={14} /> : <Copy size={14} />}
                        {copiedSide === 'right' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              <div className="pr-diff__surfaces">
                <section className="pr-diff__surface" aria-label="Original review pane">
                  {visibleRows.map((row, rowIndex) => (
                    <div
                      key={`left-${rowIndex}`}
                      className={`pr-diff__line ${
                        row.kind === 'removed' || row.kind === 'changed'
                          ? 'pr-diff__line--removed'
                          : row.kind === 'unchanged'
                            ? 'pr-diff__line--unchanged'
                            : 'pr-diff__line--placeholder'
                      }`}
                    >
                      <span className="pr-diff__line-number">{row.leftLineNumber ?? ''}</span>
                      <code className="pr-diff__code">
                        {row.leftLineNumber === null ? <span className="pr-diff__placeholder" /> : <DiffCodeText row={row} tone="left" />}
                      </code>
                    </div>
                  ))}
                </section>

                <section className="pr-diff__surface" aria-label="Updated review pane">
                  {visibleRows.map((row, rowIndex) => (
                    <div
                      key={`right-${rowIndex}`}
                      className={`pr-diff__line ${
                        row.kind === 'added' || row.kind === 'changed'
                          ? 'pr-diff__line--added'
                          : row.kind === 'unchanged'
                            ? 'pr-diff__line--unchanged'
                            : 'pr-diff__line--placeholder'
                      }`}
                    >
                      <span className="pr-diff__line-number">{row.rightLineNumber ?? ''}</span>
                      <code className="pr-diff__code">
                        {row.rightLineNumber === null ? <span className="pr-diff__placeholder" /> : <DiffCodeText row={row} tone="right" />}
                      </code>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-panel-copy">Add content on either side to compare the text.</div>
        )}
      </section>
    </ToolFrame>
  );
}
