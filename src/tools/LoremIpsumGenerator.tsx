import { useMemo, useState } from 'react';
import { Check, Copy, FileText, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { generateLoremIpsum } from '../lib/privacyTools';

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => generateLoremIpsum(paragraphs), [paragraphs]);

  return (
    <ToolFrame eyebrow="Generator" title="Lorem Ipsum Generator" description="Generate placeholder copy locally for layouts, cards, skeleton content, and demos." actions={<><button type="button" className="action-button action-button--primary" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output?.output ?? ''); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button><button type="button" className="action-button" onClick={() => setParagraphs(3)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><FileText size={16} />Paragraphs</span><span>Placeholder volume</span></div><input className="tool-input" type="number" value={paragraphs} onChange={(event) => setParagraphs(Number(event.target.value))} /></section><section className="stack-grid">{result.error ? <div className="editor-error"><strong>Lorem issue</strong><p>{result.error}</p></div> : result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Paragraphs</span><strong>{result.output.paragraphCount}</strong></article><article className="stat-card"><span className="stat-card__label">Words</span><strong>{result.output.wordCount}</strong></article></div><section className="editor-panel"><div className="editor-panel__head"><span>Generated text</span><span>Placeholder copy</span></div><textarea readOnly value={result.output.output} className="editor-textarea editor-textarea--output" /></section></> : null}</section></div>
    </ToolFrame>
  );
}
