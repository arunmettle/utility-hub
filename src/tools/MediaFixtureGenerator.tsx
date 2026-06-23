import { useEffect, useMemo, useState } from 'react';
import { Download, FileArchive, Film, Image, Music4, RotateCcw } from 'lucide-react';
import ToolFrame from '../components/ToolFrame';
import {
  formatFixtureBytes,
  fixtureFormatsByKind,
  generateFixture,
  getDefaultFormatForKind,
  getFixtureFormatOption,
  getMaxFixtureBytes,
  mediaFixtureSizeLimits,
  mediaSizePresets,
  type FixtureFormat,
  type FixtureKind,
  type GeneratedFixture,
  type MediaFixtureSizeUnit,
  validateCustomFixtureSize,
} from '../lib/mediaFixtures';

function kindIcon(kind: FixtureKind) {
  if (kind === 'image') return <Image size={16} />;
  if (kind === 'audio') return <Music4 size={16} />;
  if (kind === 'video') return <Film size={16} />;
  return <FileArchive size={16} />;
}

export default function MediaFixtureGenerator() {
  const [kind, setKind] = useState<FixtureKind>('image');
  const [format, setFormat] = useState<FixtureFormat>(getDefaultFormatForKind('image'));
  const [sizeMode, setSizeMode] = useState<'preset' | 'custom'>('preset');
  const [presetId, setPresetId] = useState(mediaSizePresets[1].id);
  const [customAmount, setCustomAmount] = useState('2');
  const [customUnit, setCustomUnit] = useState<MediaFixtureSizeUnit>('MB');
  const [fixture, setFixture] = useState<GeneratedFixture | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [status, setStatus] = useState('Choose a file type, format, and size target, then generate a local fixture.');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedPreset = useMemo(
    () => mediaSizePresets.find((preset) => preset.id === presetId) ?? mediaSizePresets[1],
    [presetId],
  );

  const formatOptions = useMemo(() => fixtureFormatsByKind[kind], [kind]);
  const selectedFormat = useMemo(() => getFixtureFormatOption(kind, format), [format, kind]);
  const currentMaxBytes = useMemo(() => getMaxFixtureBytes(kind), [kind]);

  const customValidation = useMemo(
    () => validateCustomFixtureSize({ kind, amount: Number(customAmount), unit: customUnit }),
    [customAmount, customUnit, kind],
  );

  const selectedSize = useMemo(() => {
    if (sizeMode === 'preset') {
      return {
        targetBytes: selectedPreset.targetBytes,
        label: selectedPreset.label,
        helper: selectedPreset.helper,
      };
    }

    return {
      targetBytes: customValidation.ok ? customValidation.targetBytes : 0,
      label: customValidation.ok ? customValidation.label : `${customAmount || 0} ${customUnit}`,
      helper: customValidation.ok
        ? `Custom ${kind} fixture target for focused upload, edge-case, and regression testing.`
        : customValidation.error,
    };
  }, [customAmount, customUnit, customValidation, kind, selectedPreset, sizeMode]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const allowed = fixtureFormatsByKind[kind].some((option) => option.id === format);
    if (!allowed) {
      setFormat(getDefaultFormatForKind(kind));
    }
  }, [format, kind]);

  const reset = () => {
    setKind('image');
    setFormat(getDefaultFormatForKind('image'));
    setSizeMode('preset');
    setPresetId(mediaSizePresets[1].id);
    setCustomAmount('2');
    setCustomUnit('MB');
    setFixture(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl('');
    setStatus('Choose a file type, format, and size target, then generate a local fixture.');
  };

  const generateSelectedFixture = async () => {
    if (sizeMode === 'custom' && !customValidation.ok) {
      setStatus(customValidation.error);
      return;
    }

    setIsGenerating(true);
    setStatus(`Generating a ${kind} fixture in ${selectedFormat.label} around ${selectedSize.label}...`);

    try {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const nextFixture = await generateFixture(kind, format, selectedSize.targetBytes);
      const objectUrl = URL.createObjectURL(nextFixture.previewBlob ?? nextFixture.blob);
      setPreviewUrl(objectUrl);
      setFixture(nextFixture);
      setStatus(`Generated ${nextFixture.fileName} at ${formatFixtureBytes(nextFixture.actualBytes)}.`);
    } catch (error) {
      setFixture(null);
      setPreviewUrl('');
      setStatus(error instanceof Error ? error.message : 'Unable to generate the requested fixture.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFixture = () => {
    if (!fixture) return;
    const blobUrl = URL.createObjectURL(fixture.blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = fixture.fileName;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Fixture File Generator"
      description="Generate local image, audio, video, PDF, CSV, and Excel files in common formats so developers and testers can validate uploads, previews, parsing, and boundary scenarios without hunting for sample assets."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={generateSelectedFixture} disabled={isGenerating}>
            {kindIcon(kind)}
            {isGenerating ? 'Generating...' : 'Generate fixture'}
          </button>
          <button type="button" className="action-button" onClick={downloadFixture} disabled={!fixture}>
            <Download size={16} />
            Download file
          </button>
          <button type="button" className="action-button" onClick={reset}>
            <RotateCcw size={16} />
            Reset
          </button>
        </>
      }
      note={{
        title: 'Testing note',
        body: 'Everything is generated locally in the browser. For compressed formats, preview uses a clean playable or viewable base artifact while the downloaded file can be padded to the requested size for upload-boundary testing.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Fixture type</span>
            <span>Media and document test assets</span>
          </div>
          <div className="mode-toggle" role="tablist" aria-label="Fixture type">
            {(['image', 'audio', 'video', 'document'] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={kind === item ? 'is-active' : ''}
                onClick={() => setKind(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="editor-panel__head editor-panel__head--spaced">
            <span>Format</span>
            <span>{selectedFormat.label}</span>
          </div>
          <div className="stack-grid">
            {formatOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`action-button ${format === option.id ? 'action-button--primary' : ''}`}
                onClick={() => setFormat(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="editor-panel__head editor-panel__head--spaced">
            <span>Size mode</span>
            <span>{sizeMode === 'preset' ? 'Preset shortcuts' : 'Custom target'}</span>
          </div>
          <div className="mode-toggle" role="tablist" aria-label="Fixture size mode">
            <button type="button" className={sizeMode === 'preset' ? 'is-active' : ''} onClick={() => setSizeMode('preset')}>
              Preset
            </button>
            <button type="button" className={sizeMode === 'custom' ? 'is-active' : ''} onClick={() => setSizeMode('custom')}>
              Custom
            </button>
          </div>

          <div className="editor-panel__head editor-panel__head--spaced">
            <span>{sizeMode === 'preset' ? 'Preset size' : 'Custom size'}</span>
            <span>{selectedSize.label}</span>
          </div>

          {sizeMode === 'preset' ? (
            <div className="stack-grid">
              {mediaSizePresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`action-button ${presetId === preset.id ? 'action-button--primary' : ''}`}
                  onClick={() => setPresetId(preset.id)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="stack-grid">
              <label htmlFor="custom-fixture-size" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                Target size
              </label>
              <div className="stack-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}>
                <input
                  id="custom-fixture-size"
                  data-testid="custom-fixture-size"
                  className="tool-input"
                  type="number"
                  min={1}
                  step={customUnit === 'MB' ? '0.1' : '1'}
                  value={customAmount}
                  onChange={(event) => setCustomAmount(event.target.value)}
                  aria-describedby="custom-fixture-size-helper"
                />
                <div className="mode-toggle" role="tablist" aria-label="Custom fixture size unit">
                  {(['KB', 'MB'] as const).map((unit) => (
                    <button key={unit} type="button" className={customUnit === unit ? 'is-active' : ''} onClick={() => setCustomUnit(unit)}>
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
              <p id="custom-fixture-size-helper" style={{ margin: 0, color: 'var(--text-muted)' }}>
                Set any size between {formatFixtureBytes(mediaFixtureSizeLimits.minBytes)} and {formatFixtureBytes(currentMaxBytes)} for {kind} fixtures.
              </p>
              {!customValidation.ok ? (
                <div className="editor-error">
                  <strong>Custom size issue</strong>
                  <p>{customValidation.error}</p>
                </div>
              ) : null}
            </div>
          )}

          <div className="tool-note" style={{ marginTop: '1rem' }}>
            <h2>{selectedFormat.label}</h2>
            <p>{selectedFormat.helper}</p>
            <p>{selectedSize.helper}</p>
          </div>
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Fixture output</span>
            <span>{fixture ? fixture.fileName : 'No file yet'}</span>
          </div>

          <div className="stack-grid">
            <article className="insight-row">
              <strong>Status</strong>
              <p>{status}</p>
            </article>

            {fixture ? (
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">Format</span>
                  <strong>{fixture.format.toUpperCase()}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Target size</span>
                  <strong>{formatFixtureBytes(fixture.targetBytes)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Actual size</span>
                  <strong>{formatFixtureBytes(fixture.actualBytes)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">MIME type</span>
                  <strong>{fixture.mimeType}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Duration</span>
                  <strong>{fixture.durationSeconds ? `${fixture.durationSeconds.toFixed(1)}s` : 'n/a'}</strong>
                </article>
              </div>
            ) : null}

            <div className="qr-preview-shell" data-testid="media-fixture-preview">
              {fixture && previewUrl && fixture.kind === 'image' ? <img src={previewUrl} alt="Generated image fixture preview" className="qr-preview-canvas" /> : null}
              {fixture && previewUrl && fixture.kind === 'audio' ? <audio controls src={previewUrl} style={{ width: '100%' }} /> : null}
              {fixture && previewUrl && fixture.kind === 'video' ? <video controls muted src={previewUrl} style={{ width: '100%', borderRadius: '1rem' }} /> : null}
              {fixture && previewUrl && fixture.kind === 'document' && fixture.format === 'pdf' ? (
                <iframe title="Generated PDF fixture preview" src={previewUrl} style={{ width: '100%', minHeight: '360px', border: 'none', borderRadius: '1rem' }} />
              ) : null}
              {fixture && fixture.kind === 'document' && fixture.format === 'csv' ? (
                <pre style={{ margin: 0, width: '100%', whiteSpace: 'pre-wrap', fontFamily: 'IBM Plex Mono, monospace' }}>{fixture.previewText}</pre>
              ) : null}
              {fixture && fixture.kind === 'document' && fixture.format === 'xlsx' ? (
                <div className="empty-panel-copy">{fixture.previewText ?? 'Workbook generated and ready to download.'}</div>
              ) : null}
              {!fixture ? <div className="empty-panel-copy">Generate a fixture to preview and download the file.</div> : null}
            </div>
          </div>
        </section>
      </div>
    </ToolFrame>
  );
}
