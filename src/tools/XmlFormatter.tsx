import { useMemo, useState } from 'react';
import { Check, Copy, RotateCcw, Sparkles } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { formatXml } from '../lib/privacyTools';

const sampleXml = '<note><to>Arun</to><from>Utility Hub</from><body>Format this</body></note>';

export default function XmlFormatter() {
  const [input, setInput] = useState(sampleXml);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => formatXml(input), [input]);

  return (
    <ToolFrame eyebrow="Formatter" title="XML Formatter" description="Prettify compact XML into a cleaner review layout before you paste it into docs or tickets." actions={<><button type="button" className="action-button action-button--primary" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button><button type="button" className="action-button" onClick={() => setInput(sampleXml)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>XML input</span><span>Paste raw XML</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Sparkles size={16} />Formatted output</span><span>Pretty XML</span></div>{result.error ? <div className="editor-error"><strong>XML issue</strong><p>{result.error}</p></div> : <textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" />}</section>
      </div>
    </ToolFrame>
  );
}
