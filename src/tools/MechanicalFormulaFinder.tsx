import { useMemo, useState } from 'react';
import { Check, Copy, PackageSearch, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { findMechanicalFormulas, type MechanicalFormula } from '../lib/industryTools';

const categories = ['All', 'Statics', 'Strength', 'Dynamics', 'Fluids', 'Heat Transfer', 'Machine Design'] as const;

function buildFormulaSheet(formulas: MechanicalFormula[]) {
  return formulas
    .map((formula) =>
      [
        `${formula.title} (${formula.category})`,
        formula.formula,
        ...formula.variables.map((variable) => `- ${variable}`),
        `Note: ${formula.notes}`,
      ].join('\n'),
    )
    .join('\n\n');
}

export default function MechanicalFormulaFinder() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [copied, setCopied] = useState(false);
  const results = useMemo(() => findMechanicalFormulas(query, category), [category, query]);

  const handleCopy = async () => {
    if (!results.length) return;
    await navigator.clipboard.writeText(buildFormulaSheet(results));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Mechanical Formula Finder"
      description="Search a browser-local sheet of recurring mechanical formulas so engineers can find trustworthy equations faster than flipping through notes, textbooks, or fragile personal spreadsheets."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy} disabled={!results.length}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy formula sheet'}
          </button>
          <button
            type="button"
            className="action-button"
            onClick={() => {
              setQuery('');
              setCategory('All');
            }}
          >
            <RotateCcw size={16} />
            Reset filters
          </button>
        </>
      }
      note={{
        title: 'Formula finder scope',
        body: 'This tool is a broad practical lookup surface for recurring mechanical formulas, not a standards authority or full derivation engine. It is best used to find the right starting equation quickly before a deeper design review.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <PackageSearch size={16} />
              Search formulas
            </span>
            <span>Mechanical-only lookup</span>
          </div>

          <div className="tool-field">
            <label className="tool-field-label" htmlFor="mechanical-formula-query">
              Search by formula, variable, or task
            </label>
            <input
              id="mechanical-formula-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="tool-input"
              placeholder="Try bending stress, deflection, reynolds, thermal expansion..."
            />
          </div>

          <div className="tool-field">
            <label className="tool-field-label" htmlFor="mechanical-formula-category">
              Formula family
            </label>
            <select
              id="mechanical-formula-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as (typeof categories)[number])}
              className="tool-input tool-input--select"
            >
              {categories.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Results</span>
            <span>{results.length} formulas matched</span>
          </div>

          {results.length ? (
            <div className="docs-plain-list">
              {results.map((formula) => (
                <article key={formula.id} className="docs-plain-item">
                  <p>
                    <strong>{formula.title}</strong> <span className="chip chip--muted">{formula.category}</span>
                  </p>
                  <p>
                    <code>{formula.formula}</code>
                  </p>
                  <p>{formula.notes}</p>
                  <ul className="bullet-list">
                    {formula.variables.map((variable) => (
                      <li key={variable}>{variable}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-panel-copy">No formulas matched that search yet. Try a broader term or switch back to `All`.</div>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
