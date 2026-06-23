import { useMemo, useState } from 'react';
import { RotateCcw, ScanSearch } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { validateEmailAddresses } from '../lib/privacyTools';

const sampleEmails = `arun@example.com
invalid@localhost
hello@utilityhub.dev`;

export default function EmailValidator() {
  const [input, setInput] = useState(sampleEmails);
  const result = useMemo(() => validateEmailAddresses(input), [input]);

  return (
    <ToolFrame eyebrow="Tester" title="Email Validator" description="Validate line-separated email addresses quickly when cleaning imports, invites, or support lists." actions={<button type="button" className="action-button" onClick={() => setInput(sampleEmails)}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span>Email list</span><span>One address per line</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section><section className="stack-grid">{result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Valid</span><strong>{result.output.valid.length}</strong></article><article className="stat-card"><span className="stat-card__label">Invalid</span><strong>{result.output.invalid.length}</strong></article></div><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><ScanSearch size={16} />Results</span><span>Validation split</span></div><div className="chip-list">{result.output.valid.map((entry) => <span key={entry} className="chip">{entry}</span>)}{result.output.invalid.map((entry) => <span key={entry} className="chip chip--muted">{entry}</span>)}</div></section></> : null}</section></div>
    </ToolFrame>
  );
}
