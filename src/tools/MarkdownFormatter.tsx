import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Sparkles } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { formatMarkdownDocument } from '../lib/privacyTools';

const sampleMarkdown = `# utility hub

• ship formatter tools
• normalize bullets`;

export default function MarkdownFormatter() {
  const [input, setInput] = useState(sampleMarkdown);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => formatMarkdownDocument(input), [input]);

  return (
    <ToolFrame eyebrow="Formatter" title="Markdown Formatter" description="Normalize spacing, bullets, and blank lines in markdown before you paste it into PRs, issues, or docs." actions={<><button type="button" className="action-button action-button--primary" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button><button type="button" className="action-button" onClick={() => setInput(sampleMarkdown)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>Markdown input</span><span>Paste rough markdown</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Sparkles size={16} />Normalized output</span><span>Clean markdown</span></div><textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" /></section>
      </div>
    </ToolFrame>
  );
}
