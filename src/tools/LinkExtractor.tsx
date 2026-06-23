import { useMemo, useState } from 'react';
import { Link2, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { extractLinksAndEmails } from '../lib/privacyTools';

const sampleContent = `Docs: https://utilityhub.dev/
Mail Arun at arun@example.com
Repo https://github.com/arunmettle/utility-hub`;

export default function LinkExtractor() {
  const [input, setInput] = useState(sampleContent);
  const result = useMemo(() => extractLinksAndEmails(input), [input]);

  return (
    <ToolFrame eyebrow="Developer" title="Link Extractor" description="Extract URLs and email addresses from pasted text so copied notes become structured reference lists." actions={<button type="button" className="action-button" onClick={() => setInput(sampleContent)}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>Source text</span><span>Paste mixed content</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="stack-grid">{result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">URLs</span><strong>{result.output.urls.length}</strong></article><article className="stat-card"><span className="stat-card__label">Emails</span><strong>{result.output.emails.length}</strong></article></div><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Link2 size={16} />Extracted links</span><span>Structured output</span></div><div className="chip-list">{[...result.output.urls, ...result.output.emails].map((entry) => <span key={entry} className="chip">{entry}</span>)}</div></section></> : null}</section>
      </div>
    </ToolFrame>
  );
}
