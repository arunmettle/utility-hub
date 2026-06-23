import { useMemo, useState } from 'react';
import { ArrowLeftRight, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { convertTabsAndSpaces, type TabSpaceMode } from '../lib/privacyTools';

const sampleIndent = 'function demo() {\n\treturn true;\n}';

export default function TabsSpacesConverter() {
  const [mode, setMode] = useState<TabSpaceMode>('tabs-to-spaces');
  const [size, setSize] = useState(2);
  const [input, setInput] = useState(sampleIndent);
  const result = useMemo(() => convertTabsAndSpaces(input, mode, size), [input, mode, size]);

  return (
    <ToolFrame eyebrow="Converter" title="Tabs Spaces Converter" description="Convert indentation between tabs and spaces when normalizing snippets or code blocks." actions={<><button type="button" className="action-button action-button--primary" onClick={() => setMode(mode === 'tabs-to-spaces' ? 'spaces-to-tabs' : 'tabs-to-spaces')}><ArrowLeftRight size={16} />Switch to {mode === 'tabs-to-spaces' ? 'Spaces to Tabs' : 'Tabs to Spaces'}</button><button type="button" className="action-button" onClick={() => { setInput(sampleIndent); setSize(2); }}><RotateCcw size={16} />Reset sample</button></>}>
      <div className="editor-grid"><section className="editor-panel"><div className="editor-panel__head"><span>Input text</span><span>Indentation source</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /><input className="tool-input" type="number" value={size} onChange={(event) => setSize(Number(event.target.value))} /></section><section className="editor-panel"><div className="editor-panel__head"><span>Output</span><span>{mode === 'tabs-to-spaces' ? 'Spaces' : 'Tabs'} applied</span></div><textarea readOnly value={result.output} className="editor-textarea editor-textarea--output" /></section></div>
    </ToolFrame>
  );
}
