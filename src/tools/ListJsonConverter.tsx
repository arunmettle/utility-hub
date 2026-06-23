import { useMemo, useState } from 'react';
import { ArrowLeftRight, Check, Copy, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { transformListJson, type ListJsonMode } from '../lib/privacyTools';

const sampleList = 'markdown\nprompt\ndiff';

export default function ListJsonConverter() {
  const [mode, setMode] = useState<ListJsonMode>('list-to-json');
  const [input, setInput] = useState(sampleList);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => transformListJson(input, mode), [input, mode]);

  return (
    <ToolFrame eyebrow="Converter" title="List JSON Converter" description="Convert simple line lists into JSON arrays or turn JSON arrays back into one-item-per-line lists." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'list-to-json' ? 'json-to-list' : 'list-to-json')}><ArrowLeftRight size={16} />Switch to {mode === 'list-to-json' ? 'JSON to List' : 'List to JSON'}</button><button type="button" className="action-button" disabled={!result.output} onClick={async () => { await navigator.clipboard.writeText(result.output); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button><button type="button" className="action-button" onClick={() => setInput(sampleList)}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span>Input</span><span>{mode === 'list-to-json' ? 'One item per line' : 'JSON array'}</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section><section className="editor-panel"><div className="editor-panel__head"><span>Output</span><span>{mode === 'list-to-json' ? 'JSON array' : 'Line list'}</span></div>{result.error ? <div className="editor-error"><strong>List issue</strong><p>{result.error}</p></div> : <textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" />}</section></div>
    </ToolFrame>
  );
}
