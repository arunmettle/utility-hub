import { useMemo, useState } from 'react';
import { Link2, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectOpenRedirect } from '../lib/privacyTools';

export default function OpenRedirectChecker() {
  const [input, setInput] = useState('https://app.example.com/login?next=https://evil.example.net/phish');
  const [allowlist, setAllowlist] = useState('app.example.com example.com');
  const result = useMemo(() => inspectOpenRedirect(input, allowlist), [input, allowlist]);

  return (
    <ToolFrame eyebrow="Security" title="Open Redirect Checker" description="Inspect redirect targets locally and flag protocol-relative, script-based, or off-allowlist destinations." actions={<button type="button" className="action-button" onClick={() => { setInput('https://app.example.com/login?next=https://evil.example.net/phish'); setAllowlist('app.example.com example.com'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Link2 size={16} />Redirect input</span><span>Target URL or full request URL</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
          <input className="tool-input" value={allowlist} onChange={(event) => setAllowlist(event.target.value)} placeholder="Optional allowlist hosts" />
        </section>
        <section className="stack-grid">
          {result.error ? <div className="editor-error"><strong>Redirect issue</strong><p>{result.error}</p></div> : result.output ? <>
            <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Target</span><strong>{result.output.target}</strong></article><article className="stat-card"><span className="stat-card__label">Host</span><strong>{result.output.host}</strong></article><article className="stat-card"><span className="stat-card__label">Protocol</span><strong>{result.output.protocol}</strong></article></div>
            {result.output.findings.map((finding) => <article key={finding.title} className="insight-row"><strong>{finding.title}</strong><p>{finding.detail}</p></article>)}
          </> : null}
        </section>
      </div>
    </ToolFrame>
  );
}
