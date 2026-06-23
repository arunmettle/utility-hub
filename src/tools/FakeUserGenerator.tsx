import { useMemo, useState } from 'react';
import { RotateCcw, UserRound } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateFakeUsers } from '../lib/privacyTools';

export default function FakeUserGenerator() {
  const [count, setCount] = useState(4);
  const result = useMemo(() => generateFakeUsers(count), [count]);

  return (
    <ToolFrame eyebrow="Generator" title="Fake User Generator" description="Generate local fake user rows for fixtures, demos, and test data without touching real identities." actions={<button type="button" className="action-button" onClick={() => setCount(4)}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><UserRound size={16} />User count</span></div><input className="tool-input" type="number" value={count} onChange={(event) => setCount(Number(event.target.value))} /></section>
        <section className="stack-grid">{result.error ? <div className="editor-error"><strong>User issue</strong><p>{result.error}</p></div> : result.output?.values.map((user) => <article key={user.email} className="insight-row"><strong>{user.name}</strong><p>{user.email} · {user.role}</p></article>)}</section>
      </div>
    </ToolFrame>
  );
}
