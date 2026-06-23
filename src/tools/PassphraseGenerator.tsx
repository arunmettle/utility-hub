import { useMemo, useState } from 'react';
import { KeyRound, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generatePassphrases } from '../lib/privacyTools';

export default function PassphraseGenerator() {
  const [count, setCount] = useState(4);
  const [words, setWords] = useState(4);
  const result = useMemo(() => generatePassphrases(count, words), [count, words]);

  return (
    <ToolFrame eyebrow="Generator" title="Passphrase Generator" description="Generate memorable multi-word passphrases locally for accounts, demos, and test credentials." actions={<button type="button" className="action-button" onClick={() => { setCount(4); setWords(4); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><KeyRound size={16} />Settings</span><span>Count and words</span></div><div className="stack-grid"><input className="tool-input" type="number" value={count} onChange={(event) => setCount(Number(event.target.value))} /><input className="tool-input" type="number" value={words} onChange={(event) => setWords(Number(event.target.value))} /></div></section><section className="editor-panel"><div className="editor-panel__head"><span>Generated passphrases</span><span>{result.output?.values.length ?? 0} values</span></div>{result.error ? <div className="editor-error"><strong>Passphrase issue</strong><p>{result.error}</p></div> : <div className="chip-list">{result.output?.values.map((value) => <span key={value} className="chip">{value}</span>)}</div>}</section></div>
    </ToolFrame>
  );
}
