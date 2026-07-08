import { Check, ClipboardList, Copy, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import ToolFrame from '../components/ToolFrame';
import { buildCivilHandover } from '../lib/civilTools';

const sampleNotes = `urgent: traffic control sign missing at north gate
review drawing revision 4 before setting out the curb line
chainage 2+300 needs a level check at 09:30
confirm concrete delivery and compaction plan with subcontractor
follow up on RFI for drainage invert at south pit`;

export default function SiteHandoverBuilder() {
  const [notes, setNotes] = useState(sampleNotes);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => buildCivilHandover(notes), [notes]);

  const copyReport = async () => {
    await navigator.clipboard.writeText(result.markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Coordinator"
      title="Site Handover Builder"
      description="Turn rough civil site notes into grouped actions, urgent items, and a cleaner markdown handover."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={copyReport}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy handover'}
          </button>
          <button type="button" className="action-button" onClick={() => setNotes(sampleNotes)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Handover scope',
        body: 'This builder is for quick civil site handovers and follow-up notes. It organizes free text locally; it does not replace a full field management system.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <ClipboardList size={16} />
              Input notes
            </span>
            <span>One line per note</span>
          </div>
          <textarea
            className="editor-textarea"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Paste civil site notes, follow-ups, or inspection points."
          />
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            <article className="stat-card">
              <span className="stat-card__label">Sections</span>
              <strong>{result.sections.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Urgent</span>
              <strong>{result.urgentItems.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Due times</span>
              <strong>{result.dueTimes.length}</strong>
            </article>
            <article className="stat-card">
              <span className="stat-card__label">Markdown lines</span>
              <strong>{result.markdown.split('\n').length}</strong>
            </article>
          </div>

          <div className="tool-note">
            <h2 className="editor-panel__heading-with-icon">
              <ClipboardList size={16} />
              Urgent items
            </h2>
            {result.urgentItems.length > 0 ? (
              <ul className="tool-bullet-list">
                {result.urgentItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No urgent items detected.</p>
            )}
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span className="editor-panel__heading-with-icon">
                <ClipboardList size={16} />
                Handover markdown
              </span>
              <span>Copy-ready</span>
            </div>
            <textarea className="editor-textarea editor-textarea--output" readOnly value={result.markdown} />
          </section>
        </section>
      </div>

      <section className="editor-panel">
        <div className="editor-panel__head">
          <span>Section breakdown</span>
          <span>{result.sections.length} groups</span>
        </div>
        <div className="docs-plain-list">
          {result.sections.map((section) => (
            <article key={section.title} className="docs-plain-item">
              <p>
                <strong>{section.title}</strong>
              </p>
              <p>{section.items.join(' · ')}</p>
            </article>
          ))}
        </div>
      </section>
    </ToolFrame>
  );
}
