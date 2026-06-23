import { useMemo, useState } from 'react';
import { RotateCcw, Shield } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { inspectCookieSecurity } from '../lib/privacyTools';

const sampleCookies = `Set-Cookie: session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax
Set-Cookie: prefs=dark; Path=/`;

export default function CookieSecurityInspector() {
  const [input, setInput] = useState(sampleCookies);
  const result = useMemo(() => inspectCookieSecurity(input), [input]);

  return (
    <ToolFrame eyebrow="Security" title="Cookie Security Inspector" description="Inspect raw Set-Cookie headers for Secure, HttpOnly, and SameSite coverage before shipping changes." actions={<button type="button" className="action-button" onClick={() => setInput(sampleCookies)}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span>Set-Cookie headers</span><span>One per line</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section><section className="stack-grid">{result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Cookies</span><strong>{result.output.cookies.length}</strong></article><article className="stat-card"><span className="stat-card__label">Findings</span><strong>{result.output.findings.length}</strong></article></div><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Shield size={16} />Cookie flags</span><span>Security posture</span></div><div className="insight-list">{result.output.cookies.map((cookie) => <article key={cookie.name} className="insight-row"><strong>{cookie.name}</strong><p>Secure: {String(cookie.secure)} · HttpOnly: {String(cookie.httpOnly)} · SameSite: {cookie.sameSite}</p></article>)}</div></section><section className="editor-panel"><div className="editor-panel__head"><span>Findings</span><span>Missing protections</span></div><div className="insight-list">{result.output.findings.map((finding) => <article key={finding.title} className={`insight-row insight-row--${finding.severity}`}><strong>{finding.title}</strong><p>{finding.detail}</p></article>)}</div></section></> : null}</section></div>
    </ToolFrame>
  );
}
