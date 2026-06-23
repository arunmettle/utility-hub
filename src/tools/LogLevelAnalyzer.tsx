import { useMemo, useState } from 'react';
import { BarChart3, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import { analyzeLogLevels } from '../lib/privacyTools';

const sampleLog = `[INFO] boot completed
[WARN] cache miss
[ERROR] deploy failed
[DEBUG] retrying request`;

export default function LogLevelAnalyzer() {
  const [input, setInput] = useState(sampleLog);
  const result = useMemo(() => analyzeLogLevels(input), [input]);

  return (
    <ToolFrame eyebrow="Developer" title="Log Level Analyzer" description="Count error, warning, info, and debug lines in pasted logs so noisy output becomes easier to triage." actions={<button type="button" className="action-button" onClick={() => setInput(sampleLog)}><RotateCcw size={16} />Reset sample</button>}>
      <div className="editor-grid">
        <section className="editor-panel"><div className="editor-panel__head"><span>Log output</span><span>Paste raw logs</span></div><textarea value={input} onChange={(event) => setInput(event.target.value)} className="editor-textarea" /></section>
        <section className="stack-grid">
          {result.output ? (
            <>
              <div className="stat-grid"><article className="stat-card"><span className="stat-card__label">Errors</span><strong>{result.output.counts.error}</strong></article><article className="stat-card"><span className="stat-card__label">Warnings</span><strong>{result.output.counts.warn}</strong></article><article className="stat-card"><span className="stat-card__label">Info</span><strong>{result.output.counts.info}</strong></article><article className="stat-card"><span className="stat-card__label">Debug</span><strong>{result.output.counts.debug}</strong></article></div>
              <section className="editor-panel"><div className="editor-panel__head"><span className="editor-panel__heading-with-icon"><BarChart3 size={16} />Findings</span><span>{result.output.totalLines} lines</span></div><div className="insight-list">{result.output.findings.map((finding) => <article key={finding} className="insight-row"><p>{finding}</p></article>)}</div></section>
            </>
          ) : null}
        </section>
      </div>
    </ToolFrame>
  );
}
