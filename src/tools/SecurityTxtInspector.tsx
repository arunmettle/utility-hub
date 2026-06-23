import { useMemo, useState } from 'react';
import { Shield, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectSecurityTxt } from '../lib/privacyTools';

export default function SecurityTxtInspector() {
  const [input, setInput] = useState('Contact: mailto:security@example.com\nExpires: 2027-01-01T00:00:00Z\nPolicy: https://example.com/security');
  const result = useMemo(() => inspectSecurityTxt(input), [input]);

  return (
    <ToolFrame eyebrow="Security" title="Security.txt Inspector" description="Validate the structure of a security.txt file locally so disclosure contacts and expiry details stay easy to review." actions={<button type="button" className="action-button" onClick={() => setInput('Contact: mailto:security@example.com\nExpires: 2027-01-01T00:00:00Z\nPolicy: https://example.com/security')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Shield size={16} />security.txt content</span><span>Paste the file body</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="stack-grid">
          {result.output ? <>
            <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Fields</span><strong>{result.output.fields.length}</strong></article><article className="stat-card"><span className="stat-card__label">Contacts</span><strong>{result.output.contacts.length}</strong></article><article className="stat-card"><span className="stat-card__label">Expires</span><strong>{result.output.expires || 'missing'}</strong></article></div>
            <div className="chip-list">{result.output.fields.map((field) => <span key={field} className="chip">{field}</span>)}</div>
            {result.output.findings.map((finding) => <article key={finding.title} className="insight-row"><strong>{finding.title}</strong><p>{finding.detail}</p></article>)}
          </> : null}
        </section>
      </div>
    </ToolFrame>
  );
}
