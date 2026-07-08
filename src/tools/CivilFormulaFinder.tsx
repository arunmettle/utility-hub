import { useMemo, useState } from 'react';
import { Check, Copy, PackageSearch, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { findCivilFormulas, type CivilFormula } from '../lib/industryTools';

const categories = ['All', 'Hydraulics', 'Earthworks', 'Concrete', 'Geometry', 'Materials', 'Surveying', 'Roads'] as const;

function buildFormulaSheet(formulas: CivilFormula[]) {
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

export default function CivilFormulaFinder() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [copied, setCopied] = useState(false);
  const results = useMemo(() => findCivilFormulas(query, category), [category, query]);

  const handleCopy = async () => {
    if (!results.length) return;
    await navigator.clipboard.writeText(buildFormulaSheet(results));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Civil Formula Finder"
      description="Search a browser-local sheet of recurring civil formulas so engineers can get to the right relation faster than hunting through old notes or manual references."
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
        body: 'This surface is a practical lookup layer for common civil, drainage, concrete, and geometry formulas. It is not a standards authority or a replacement for formal design review.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <PackageSearch size={16} />
              Search formulas
            </span>
            <span>Civil-only lookup</span>
          </div>

          <div className="tool-field">
            <label className="tool-field-label" htmlFor="civil-formula-query">
              Search by formula, variable, or task
            </label>
            <input
              id="civil-formula-query"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="tool-input"
              placeholder="Try head loss, earthworks volume, crossfall, concrete..."
            />
          </div>

          <div className="tool-field">
            <label className="tool-field-label" htmlFor="civil-formula-category">
              Formula family
            </label>
            <select
              id="civil-formula-category"
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
