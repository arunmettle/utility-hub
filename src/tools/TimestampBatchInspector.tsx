import { useMemo, useState } from 'react';
import { ListOrdered, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectTimestampBatch } from '../lib/privacyTools';

const sampleInput = ['1718625600', '1718625600123', '1718625600123456', '1718625600123456789'].join('\n');

export default function TimestampBatchInspector() {
  const [input, setInput] = useState(sampleInput);
  const result = useMemo(() => inspectTimestampBatch(input), [input]);

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Timestamp Batch Inspector"
      description="Paste one Unix timestamp per line and turn a mixed batch into readable local, ISO, and relative time output."
      actions={
        <button type="button" className="action-button" onClick={() => setInput(sampleInput)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <ListOrdered size={16} />
              Input timestamps
            </span>
            <span>One value per line</span>
          </div>
          <textarea
            className="editor-textarea"
            aria-label="Timestamp batch input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={'1718625600\n1718625600123'}
          />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Batch inspection issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Lines</span>
                  <strong>{result.output.totalLines}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Valid</span>
                  <strong>{result.output.validCount}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Invalid</span>
                  <strong>{result.output.invalidCount}</strong>
                </article>
              </div>
              <div className="timestamp-output">
                {result.output.rows.map((row) =>
                  row.error ? (
                    <div key={row.raw} className="timestamp-output__item">
                      <strong>{row.raw}</strong>
                      <span>{row.error}</span>
                    </div>
                  ) : (
                    <div key={row.raw} className="timestamp-output__item">
                      <strong>
                        {row.raw} <small>{row.detectedUnit}</small>
                      </strong>
                      <span>{row.local}</span>
                      <p>
                        {row.iso} · {row.relative}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </>
          ) : (
            <div className="empty-panel-copy">Paste one timestamp per line to inspect the batch.</div>
          )}
        </section>
      </div>
    </ToolFrame>
  );
}
