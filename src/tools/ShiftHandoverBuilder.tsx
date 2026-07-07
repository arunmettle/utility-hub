import { useMemo, useState } from 'react';
import { Check, ClipboardList, Copy, RotateCcw, ShieldAlert } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { buildShiftHandover } from '../lib/industryTools';

const sampleNotes = `07:30 urgent - pump 2 vibration still elevated, monitor every 2 hours
08:00 isolation room bed 4 awaiting review from pediatrics
Need follow up with electrical team on panel B breaker trip cause
Ventilation fan stable after overnight reset
Critical: permit sign-off required before restarting conveyor line`;

export default function ShiftHandoverBuilder() {
  const [notes, setNotes] = useState(sampleNotes);
  const [copied, setCopied] = useState(false);
  const handover = useMemo(() => buildShiftHandover(notes), [notes]);

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(handover.markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Shift Handover Builder"
      description="Turn raw shift notes into a cleaner handover with grouped actions, urgent watch-outs, and a markdown summary for hospitals, mining crews, site teams, and operations rooms."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={copyMarkdown}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy markdown'}
          </button>
          <button type="button" className="action-button" onClick={() => setNotes(sampleNotes)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Operational note',
        body: 'This first version groups handover notes locally using simple heuristics so sensitive shift details never need to leave the browser.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <ClipboardList size={16} />
              Raw notes
            </span>
            <span>Paste one note per line</span>
          </div>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="editor-textarea"
            placeholder="Paste rough handover notes, observations, pending actions, and time-based reminders."
          />
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Sections</span>
              <strong>{handover.sections.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Urgent items</span>
              <strong>{handover.urgentItems.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Due times</span>
              <strong>{handover.dueTimes.length}</strong>
            </article>
          </div>

          {handover.urgentItems.length > 0 ? (
            <div className="editor-error editor-error--compact">
              <strong className="editor-panel__heading-with-icon">
                <ShieldAlert size={16} />
                High attention items
              </strong>
              <p>{handover.urgentItems.join(' | ')}</p>
            </div>
          ) : null}

          <div className="tool-note">
            <h2>Structured handover</h2>
            <div className="stack-grid">
              {handover.sections.map((section) => (
                <article key={section.title} className="insight-row">
                  <strong>{section.title}</strong>
                  <ul className="tool-bullet-list">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span>Markdown output</span>
              <span>Ready for docs or chat</span>
            </div>
            <textarea className="editor-textarea editor-textarea--output" readOnly value={handover.markdown} />
          </section>
        </section>
      </div>
    </ToolFrame>
  );
}
