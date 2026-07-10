import { useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import CompareAuditTool from '../components/CompareAuditTool';
import ToolFrame from '../components/ToolFrame';
import {
  analyzeDrawingInspectionReconciliation,
  analyzeToleranceChangeImpact,
  calculateFastenerClampLoad,
} from '../lib/workspaceWedgeTools';

const oldStack = `label,nominal,plusTol,minusTol,direction
Housing width,50,0.10,0.10,+
Spacer,10,0.05,0.05,+
Shoulder,60,0.03,0.03,-`;

const newStack = `label,nominal,plusTol,minusTol,direction
Housing width,50.15,0.10,0.10,+
Spacer,10,0.08,0.05,+
Shoulder,60,0.03,0.03,-
Shim,0.20,0.02,0.02,+`;

export function ToleranceChangeImpactChecker() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="Tolerance Change Impact Checker"
      description="Compare two tolerance stack tables and show which contributors widened the assembly window or shifted the nominal stack the most."
      note={{
        title: 'Mechanical wedge',
        body: 'This is deliberately narrower than CAD tolerance analysis. It helps during revision review, quoting, and design-change discussions where the spreadsheet layer is still the source of truth.',
      }}
      leftLabel="Old stack"
      rightLabel="New stack"
      leftHint="Released or baseline stack"
      rightHint="Current revision stack"
      leftSample={oldStack}
      rightSample={newStack}
      analyze={analyzeToleranceChangeImpact}
    />
  );
}

const drawingChars = `id,dimension,tolerance,unit,criticality
CH-01,Shaft diameter 25,+/-0.01,mm,Critical
CH-02,Boss width 12,+/-0.05,mm,Major
CH-03,Thread depth 18,+/-0.20,mm,Major`;

const inspectionPlan = `id,method,sampleSize,lower,upper,unit
CH-01,Air gauge,5,24.99,25.01,mm
CH-02,Caliper,,11.95,12.05,in
CH-04,CMM,3,17.80,18.20,mm`;

export function DrawingInspectionReconciler() {
  return (
    <CompareAuditTool
      eyebrow="Tester"
      title="Drawing Inspection Reconciler"
      description="Reconcile a drawing characteristic list against an inspection plan so missing checks, unit drift, and uncovered critical features stand out immediately."
      note={{
        title: 'What this replaces',
        body: 'Most teams still do this by eye across ballooned drawings, FAIR sheets, and Excel exports. This tool compresses that review into one screen.',
      }}
      leftLabel="Drawing characteristics"
      rightLabel="Inspection plan"
      leftHint="Characteristic register"
      rightHint="Inspection or FAIR setup"
      leftSample={drawingChars}
      rightSample={inspectionPlan}
      analyze={analyzeDrawingInspectionReconciliation}
    />
  );
}

const defaultClampInputs = {
  nominalDiameterMm: '12',
  pitchMm: '1.75',
  proofStrengthMpa: '600',
  preloadFactor: '0.75',
  nutFactor: '0.20',
  separationLoadN: '28000',
};

export function FastenerClampLoadChecker() {
  const [values, setValues] = useState(defaultClampInputs);
  const [copied, setCopied] = useState(false);
  const result = calculateFastenerClampLoad({
    nominalDiameterMm: Number(values.nominalDiameterMm),
    pitchMm: Number(values.pitchMm),
    proofStrengthMpa: Number(values.proofStrengthMpa),
    preloadFactor: Number(values.preloadFactor),
    nutFactor: Number(values.nutFactor),
    separationLoadN: Number(values.separationLoadN),
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.report);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <ToolFrame
      eyebrow="Converter"
      title="Fastener Clamp Load Checker"
      description="Estimate proof load, target preload, torque, and separation margin from a small set of fastener inputs without reopening an old bolt spreadsheet."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={handleCopy}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy summary'}
          </button>
          <button type="button" className="action-button" onClick={() => setValues(defaultClampInputs)}>
            <RotateCcw size={16} />
            Reset sample
          </button>
        </>
      }
      note={{
        title: 'Scope',
        body: 'This is a first-pass clamp and torque screen for common threaded joints. It does not replace detailed joint stiffness or fatigue design.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Fastener inputs</span>
            <span>Proof-based clamp check</span>
          </div>
          <div className="form-grid-two">
            {[
              ['nominalDiameterMm', 'Nominal diameter (mm)'],
              ['pitchMm', 'Pitch (mm)'],
              ['proofStrengthMpa', 'Proof strength (MPa)'],
              ['preloadFactor', 'Preload factor'],
              ['nutFactor', 'Nut factor K'],
              ['separationLoadN', 'Separation load (N)'],
            ].map(([key, label]) => (
              <label key={key} className="tool-field">
                <span>{label}</span>
                <input
                  className="tool-input"
                  type="number"
                  step="0.01"
                  value={values[key as keyof typeof values]}
                  onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="stack-grid">
          <div className="stat-grid">
            {result.stats.map((stat) => (
              <article key={stat.label} className="stat-card">
                <span className="stat-card__label">{stat.label}</span>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </div>

          <section className="editor-panel">
            <div className="editor-panel__head">
              <span>Findings</span>
              <span>{result.findings.length} flagged items</span>
            </div>
            <div className="insight-list">
              {result.findings.length > 0 ? (
                result.findings.map((finding, index) => (
                  <article key={`${finding.title}-${index}`} className={`insight-row insight-row--${finding.severity}`}>
                    <strong>{finding.title}</strong>
                    <p>{finding.detail}</p>
                  </article>
                ))
              ) : (
                <article className="insight-row insight-row--low">
                  <strong>Clamp margin looks reasonable</strong>
                  <p>The current sample did not trigger any margin or preload warnings.</p>
                </article>
              )}
            </div>
          </section>
        </section>
      </div>
    </ToolFrame>
  );
}
