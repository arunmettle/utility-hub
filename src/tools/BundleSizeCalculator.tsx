import { useMemo, useState } from 'react';
import { BarChart3, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { calculateBundleSize } from '../lib/privacyTools';

const sampleAssets = `dist/assets/index.js 84kb
dist/assets/vendor.js 241kb
dist/assets/index.css 22kb
dist/assets/logo.svg 6kb`;

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export default function BundleSizeCalculator() {
  const [input, setInput] = useState(sampleAssets);
  const result = useMemo(() => calculateBundleSize(input), [input]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Bundle Size Calculator"
      description="Estimate bundle totals, asset mix, and rough text gzip cost from a pasted build output or simple file-size list."
      actions={
        <button type="button" className="action-button" onClick={() => setInput(sampleAssets)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Accepted input',
        body: 'Use one asset per line. Both "file.js 12kb" and "file.js, 12kb" formats are supported.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Asset list</span>
            <span>Paste build output rows</span>
          </div>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Size parsing issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Total</span>
                  <strong>{formatBytes(result.output.totalBytes)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Estimated gzip</span>
                  <strong>{formatBytes(result.output.estimatedTextGzipBytes)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Largest asset</span>
                  <strong>{result.output.largestAsset ? result.output.largestAsset.name : 'None'}</strong>
                </article>
              </div>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <BarChart3 size={16} />
                    Asset breakdown
                  </span>
                  <span>{result.output.assets.length} files</span>
                </div>
                <div className="insight-list">
                  {result.output.assets.map((asset) => (
                    <article key={asset.name} className="insight-row">
                      <strong>{asset.name}</strong>
                      <p>
                        {asset.type} • {formatBytes(asset.bytes)}
                      </p>
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
