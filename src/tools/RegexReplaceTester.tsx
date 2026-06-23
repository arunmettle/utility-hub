import { useMemo, useState } from 'react';
import { FlaskConical, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { runRegexReplace } from '../lib/privacyTools';

export default function RegexReplaceTester() {
  const [pattern, setPattern] = useState('\\s+');
  const [replacement, setReplacement] = useState('-');
  const [flags, setFlags] = useState('g');
  const [input, setInput] = useState('utility hub tools');
  const result = useMemo(() => runRegexReplace(pattern, replacement, input, flags), [pattern, replacement, input, flags]);

  return (
    <ToolFrame eyebrow="Tester" title="Regex Replace Tester" description="Preview regex replacements locally before using them in scripts, editors, or code migrations." actions={<button type="button" className="action-button" onClick={() => { setPattern('\\s+'); setReplacement('-'); setFlags('g'); setInput('utility hub tools'); }}><RotateCcw size={16} />Reset sample</button>}>
      <div className="stack-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><FlaskConical size={16} />Replace settings</span><span>Pattern and replacement</span></div><div className="stack-grid"><input className="tool-input" value={pattern} onChange={(event) => setPattern(event.target.value)} /><input className="tool-input" value={replacement} onChange={(event) => setReplacement(event.target.value)} /><input className="tool-input" value={flags} onChange={(event) => setFlags(event.target.value)} /></div></section><div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span>Source text</span><span>Replacement input</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section><section className="stack-grid">{result.error ? <div className="editor-error"><strong>Regex issue</strong><p>{result.error}</p></div> : result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Replacements</span><strong>{result.output.replacements}</strong></article></div><section className="editor-panel"><div className="editor-panel__head"><span>Output</span><span>Preview result</span></div><textarea readOnly value={result.output.output} className="editor-textarea editor-textarea--output" /></section></> : null}</section></div></div>
    </ToolFrame>
  );
}
