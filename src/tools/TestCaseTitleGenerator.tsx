import { useMemo, useState } from 'react';
import { FlaskConical, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateTestCaseTitles } from '../lib/privacyTools';

export default function TestCaseTitleGenerator() {
  const [input, setInput] = useState('the markdown table builder');
  const result = useMemo(() => generateTestCaseTitles(input), [input]);

  return (
    <ToolFrame eyebrow="Generator" title="Test Case Title Generator" description="Generate BDD-style test titles from a feature phrase for specs, PR notes, and test planning." actions={<button type="button" className="action-button" onClick={() => setInput('the markdown table builder')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><FlaskConical size={16} />Feature phrase</span></div><input className="tool-input" value={input} onChange={(event) => setInput(event.target.value)} /></section>
        <section className="stack-grid">{result.output?.values.map((item) => <article key={item} className="insight-row"><strong>{item}</strong></article>)}</section>
      </div>
    </ToolFrame>
  );
}
