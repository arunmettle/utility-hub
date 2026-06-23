import { useMemo, useState } from 'react';
import { RotateCcw, Terminal } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { buildGitignoreTemplate } from '../lib/privacyTools';

export default function GitignoreBuilder() {
  const [input, setInput] = useState('node\nvscode\nlogs');
  const result = useMemo(() => buildGitignoreTemplate(input), [input]);

  return (
    <ToolFrame eyebrow="Developer" title="Gitignore Builder" description="Generate a starter .gitignore locally from common stack sections like node, python, dotnet, vscode, and logs." actions={<button type="button" className="action-button" onClick={() => setInput('node\nvscode\nlogs')}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Terminal size={16} />Requested sections</span><span>One section per line</span></div>
          <textarea className="editor-textarea" value={input} onChange={(event) => setInput(event.target.value)} />
        </section>
        <section className="editor-panel">
          <div className="editor-panel__head"><span>Generated .gitignore</span><span>{result.output?.sections.length ?? 0} sections</span></div>
          {result.error ? <div className="editor-error"><strong>Template issue</strong><p>{result.error}</p></div> : <textarea className="editor-textarea editor-textarea--output" readOnly value={result.output?.output ?? ''} />}
        </section>
      </div>
    </ToolFrame>
  );
}
