import { useMemo, useState } from 'react';
import { Fingerprint, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { extractUuids } from '../lib/privacyTools';

const sampleText = `request a4f03f9f-4cf6-4da6-a68f-bb3b3a41ad5a failed
retry with a4f03f9f-4cf6-4da6-a68f-bb3b3a41ad5a
trace 6d2c7436-b5f7-4e49-bc4c-92f9bb87a923`;

export default function UuidExtractor() {
  const [input, setInput] = useState(sampleText);
  const result = useMemo(() => extractUuids(input), [input]);

  return (
    <ToolFrame eyebrow="Developer" title="UUID Extractor" description="Pull UUIDs out of noisy logs or pasted text so identifiers are easier to reuse or compare." actions={<button type="button" className="action-button" onClick={() => setInput(sampleText)}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>Source text</span><span>Logs or notes</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="stack-grid">{result.output ? <><div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Unique UUIDs</span><strong>{result.output.uniqueCount}</strong></article></div><section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><Fingerprint size={16} />Extracted UUIDs</span><span>{result.output.uuids.length}</span></div><div className="chip-list">{result.output.uuids.map((uuid) => <span key={uuid} className="chip">{uuid}</span>)}</div></section></> : null}</section>
      </div>
    </ToolFrame>
  );
}
