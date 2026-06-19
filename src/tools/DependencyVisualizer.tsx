import { useMemo, useState } from 'react';
import { PackageSearch, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { visualizeDependencies } from '../lib/privacyTools';

const sampleManifest = `{
  "name": "cobalt",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.0.0"
  },
  "devDependencies": {
    "vite": "^8.0.0",
    "typescript": "^6.0.0",
    "vitest": "^4.0.0"
  }
}`;

export default function DependencyVisualizer() {
  const [input, setInput] = useState(sampleManifest);
  const result = useMemo(() => visualizeDependencies(input), [input]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Dependency Visualizer"
      description="Inspect a package manifest locally to understand dependency groups, scripts, and duplicated package names across sections."
      actions={
        <button type="button" className="action-button" onClick={() => setInput(sampleManifest)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Manifest view',
        body: 'This is a quick architecture lens for package.json files. It helps you spot dependency sprawl before it becomes a maintenance issue.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>package.json</span>
            <span>Paste a dependency manifest</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Parsing issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Package</span>
                  <strong>{result.output.packageName}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Dependencies</span>
                  <strong>{result.output.totals.dependencies}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Dev dependencies</span>
                  <strong>{result.output.totals.devDependencies}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <PackageSearch size={16} />
                    Dependency map
                  </span>
                  <span>Version {result.output.version}</span>
                </div>
                <div className="chip-list">
                  {result.output.entries.map((entry) => (
                    <span key={`${entry.ecosystem}-${entry.name}`} className="chip">
                      {entry.name}
                      <small>{entry.version}</small>
                    </span>
                  ))}
                </div>
              </section>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Scripts</span>
                  <span>{result.output.scripts.length} commands</span>
                </div>
                <div className="chip-list">
                  {result.output.scripts.length > 0 ? (
                    result.output.scripts.map((script) => <span key={script} className="chip chip--muted">{script}</span>)
                  ) : (
                    <div className="empty-panel-copy">No scripts were found in this manifest.</div>
                  )}
                </div>
              </section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
