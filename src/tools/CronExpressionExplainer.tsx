import { useMemo, useState } from 'react';
import { CalendarClock, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { explainCronExpression } from '../lib/privacyTools';

const sampleCron = '*/15 9-17 * * 1-5';

export default function CronExpressionExplainer() {
  const [expression, setExpression] = useState(sampleCron);
  const result = useMemo(() => explainCronExpression(expression), [expression]);

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Cron Expression Explainer"
      description="Break down a five-part cron schedule into readable field explanations and preview the next matching run times."
      actions={
        <button type="button" className="action-button" onClick={() => setExpression(sampleCron)}>
          <RotateCcw size={16} />
          Reset sample
        </button>
      }
      note={{
        title: 'Cron shape',
        body: 'This tool expects the classic five-field cron format: minute hour day month weekday. It is useful for checking job windows before you ship a scheduler change.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Expression</span>
            <span>minute hour day month weekday</span>
          </div>
          <input
            id="cron-expression"
            className="tool-input"
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            placeholder="*/15 9-17 * * 1-5"
          />
        </section>

        <section className="stack-grid">
          {result.error ? (
            <div className="editor-error">
              <strong>Cron issue</strong>
              <p>{result.error}</p>
            </div>
          ) : result.output ? (
            <>
              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span className="editor-panel__heading-with-icon">
                    <CalendarClock size={16} />
                    Schedule summary
                  </span>
                  <span>Plain language</span>
                </div>
                <div className="insight-list">
                  <article className="insight-row">
                    <strong>{result.output.description}</strong>
                    <p>Use this as a quick confidence check before editing scheduled jobs.</p>
                  </article>
                </div>
              </section>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Field breakdown</span>
                  <span>5 cron parts</span>
                </div>
                <div className="insight-list">
                  {result.output.fields.map((field) => (
                    <article key={field.label} className="insight-row">
                      <strong>
                        {field.label}: <code>{field.expression}</code>
                      </strong>
                      <p>{field.description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="editor-panel">
                <div className="editor-panel__head">
                  <span>Next runs</span>
                  <span>{result.output.nextRuns.length} previews</span>
                </div>
                <div className="insight-list">
                  {result.output.nextRuns.map((run) => (
                    <article key={run} className="insight-row">
                      <strong>{run}</strong>
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
