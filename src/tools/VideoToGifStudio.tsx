import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Film, RotateCcw, Sparkles, Upload } from 'lucide-react';
import { GIFEncoder, applyPalette, quantize } from 'gifenc';
import ToolFrame from '../components/ToolFrame';
import {
  buildVideoGifFileName,
  buildVideoGifPlan,
  formatVideoGifBytes,
  formatVideoGifDuration,
  nextMainThreadTick,
  seekVideo,
  slugifyVideoGifFileName,
  waitForVideoMetadata,
  type VideoGifProgress,
} from '../lib/videoGif';

interface SourceVideoMeta {
  duration: number;
  width: number;
  height: number;
  name: string;
  size: number;
  type: string;
}

interface GifOutput {
  blob: Blob;
  fileName: string;
  size: number;
  frameCount: number;
  duration: number;
  width: number;
  height: number;
  fps: number;
  colorCount: number;
}

const defaultStatus = 'Upload a local video, tune the trim and output settings, then export a GIF with no app-enforced 30-second cap.';

export default function VideoToGifStudio() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const outputUrlRef = useRef('');
  const sourceUrlRef = useRef('');

  const [sourceVideo, setSourceVideo] = useState<File | null>(null);
  const [sourceMeta, setSourceMeta] = useState<SourceVideoMeta | null>(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState('');
  const [output, setOutput] = useState<GifOutput | null>(null);
  const [outputPreviewUrl, setOutputPreviewUrl] = useState('');
  const [status, setStatus] = useState(defaultStatus);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<VideoGifProgress | null>(null);
  const [startTime, setStartTime] = useState('0');
  const [endTime, setEndTime] = useState('');
  const [fps, setFps] = useState('8');
  const [width, setWidth] = useState('480');
  const [colorCount, setColorCount] = useState('64');

  useEffect(() => {
    return () => {
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
    };
  }, []);

  const plan = useMemo(() => {
    if (!sourceMeta) return null;
    return buildVideoGifPlan(sourceMeta.duration, sourceMeta.width, sourceMeta.height, {
      startTime: Number(startTime),
      endTime: Number(endTime || sourceMeta.duration),
      fps: Number(fps),
      width: Number(width),
      colorCount: Number(colorCount),
    });
  }, [colorCount, endTime, fps, sourceMeta, startTime, width]);

  const handleFileSelection = async (file: File | null) => {
    setOutput(null);
    setProgress(null);
    if (outputUrlRef.current) {
      URL.revokeObjectURL(outputUrlRef.current);
      outputUrlRef.current = '';
      setOutputPreviewUrl('');
    }

    if (!file) {
      setSourceVideo(null);
      setSourceMeta(null);
      if (sourceUrlRef.current) {
        URL.revokeObjectURL(sourceUrlRef.current);
        sourceUrlRef.current = '';
      }
      setSourcePreviewUrl('');
      setStatus(defaultStatus);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    try {
      await waitForVideoMetadata(video);
      const nextMeta: SourceVideoMeta = {
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        name: file.name,
        size: file.size,
        type: file.type || 'video/*',
      };

      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      sourceUrlRef.current = objectUrl;
      setSourcePreviewUrl(objectUrl);
      setSourceVideo(file);
      setSourceMeta(nextMeta);
      setStartTime('0');
      setEndTime(nextMeta.duration.toFixed(2));
      setWidth(String(Math.min(nextMeta.width, 480)));
      setFps('8');
      setColorCount('64');
      setStatus(`Loaded ${file.name}. Adjust trim, frame rate, width, and colors before exporting.`);
    } catch (error) {
      URL.revokeObjectURL(objectUrl);
      setSourceVideo(null);
      setSourceMeta(null);
      setSourcePreviewUrl('');
      setStatus(error instanceof Error ? error.message : 'Unable to open that video file in this browser.');
    } finally {
      video.src = '';
    }
  };

  const reset = () => {
    void handleFileSelection(null);
    if (inputRef.current) inputRef.current.value = '';
    setStartTime('0');
    setEndTime('');
    setFps('8');
    setWidth('480');
    setColorCount('64');
  };

  const convertToGif = async () => {
    if (!sourceVideo || !sourceMeta || !plan) {
      setStatus('Choose a video file first.');
      return;
    }

    setIsConverting(true);
    setOutput(null);
    setProgress({
      completedFrames: 0,
      totalFrames: plan.frameCount,
      percent: 0,
      currentTime: plan.startTime,
    });
    setStatus(`Encoding ${plan.frameCount} frames locally. Longer clips are allowed, but larger exports will take more time and memory in your browser.`);

    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.src = sourcePreviewUrl;

    const canvas = document.createElement('canvas');
    canvas.width = plan.width;
    canvas.height = plan.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    if (!context) {
      setIsConverting(false);
      setStatus('Unable to create a canvas context for GIF rendering in this browser.');
      return;
    }

    try {
      await waitForVideoMetadata(video);
      const selectedFps = Math.max(1, Math.round(Number(fps)));
      const selectedColorCount = Math.max(8, Math.round(Number(colorCount)));
      const gif = GIFEncoder();

      for (let index = 0; index < plan.frameCount; index += 1) {
        const timestamp = Math.min(plan.startTime + index / selectedFps, Math.max(plan.endTime - 0.02, plan.startTime));
        await seekVideo(video, timestamp);
        context.clearRect(0, 0, plan.width, plan.height);
        context.drawImage(video, 0, 0, plan.width, plan.height);

        const imageData = context.getImageData(0, 0, plan.width, plan.height);
        const palette = quantize(imageData.data, selectedColorCount);
        const bitmap = applyPalette(imageData.data, palette);
        gif.writeFrame(bitmap, plan.width, plan.height, {
          palette,
          delay: plan.frameDelayMs,
          repeat: 0,
        });

        setProgress({
          completedFrames: index + 1,
          totalFrames: plan.frameCount,
          percent: Math.round(((index + 1) / plan.frameCount) * 100),
          currentTime: timestamp,
        });
        setStatus(`Encoding frame ${index + 1} of ${plan.frameCount} at ${formatVideoGifDuration(timestamp)}.`);

        if ((index + 1) % 5 === 0) {
          await nextMainThreadTick();
        }
      }

      gif.finish();
      const gifBytes = gif.bytes();
      const blobBytes = Uint8Array.from(gifBytes);
      const blob = new Blob([blobBytes], { type: 'image/gif' });
      const fileName = buildVideoGifFileName(sourceMeta.name, plan.width, selectedFps);
      const previewUrl = URL.createObjectURL(blob);
      if (outputUrlRef.current) URL.revokeObjectURL(outputUrlRef.current);
      outputUrlRef.current = previewUrl;
      setOutputPreviewUrl(previewUrl);

      setOutput({
        blob,
        fileName,
        size: blob.size,
        frameCount: plan.frameCount,
        duration: plan.endTime - plan.startTime,
        width: plan.width,
        height: plan.height,
        fps: selectedFps,
        colorCount: selectedColorCount,
      });
      setStatus(`GIF ready: ${fileName} (${formatVideoGifBytes(blob.size)}).`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'GIF export failed.');
    } finally {
      video.src = '';
      setIsConverting(false);
    }
  };

  const downloadGif = () => {
    if (!output) return;
    const anchor = document.createElement('a');
    anchor.href = outputPreviewUrl;
    anchor.download = output.fileName;
    anchor.click();
  };

  return (
    <ToolFrame
      eyebrow="Developer"
      title="Video to GIF Studio"
      description="Convert local videos into Azure DevOps-friendly GIFs with browser-side trim, frame rate, width, and color controls. There is no app-enforced 30-second ceiling here, so the practical limit is your device and browser memory."
      actions={
        <>
          <button type="button" className="action-button action-button--primary" onClick={convertToGif} disabled={!sourceMeta || isConverting}>
            <Sparkles size={16} />
            {isConverting ? 'Encoding...' : 'Convert to GIF'}
          </button>
          <button type="button" className="action-button" onClick={downloadGif} disabled={!output}>
            <Download size={16} />
            Download GIF
          </button>
          <button type="button" className="action-button" onClick={reset} disabled={isConverting}>
            <RotateCcw size={16} />
            Reset
          </button>
        </>
      }
      note={{
        title: 'Azure DevOps note',
        body: 'This tool keeps conversion local and removes the product-level 30-second cap. Very long or high-resolution videos can still take noticeable time in the browser, so lowering width, FPS, or color count is the fastest way to keep pull-request GIFs manageable.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Source video</span>
            <span>{sourceMeta ? sourceMeta.name : 'No file selected'}</span>
          </div>

          <div className="stack-grid">
            <label htmlFor="video-to-gif-input" className="tool-field-label">
              Upload video
            </label>
            <label htmlFor="video-to-gif-input" className={`upload-field ${sourceMeta ? 'upload-field--selected' : ''}`} data-testid="video-gif-upload-field">
              <input
                id="video-to-gif-input"
                ref={inputRef}
                className="upload-field__input"
                type="file"
                accept="video/*"
                onChange={(event) => void handleFileSelection(event.target.files?.[0] ?? null)}
                disabled={isConverting}
              />
              <span className="upload-field__icon" aria-hidden="true">
                <Upload size={18} />
              </span>
              <span className="upload-field__copy">
                <strong>{sourceMeta ? 'Replace selected video' : 'Choose a video file'}</strong>
                <span>
                  {sourceMeta
                    ? `${sourceMeta.name} • ${formatVideoGifBytes(sourceMeta.size)} • ${formatVideoGifDuration(sourceMeta.duration)}`
                    : 'Drop in an MP4 or WebM, or browse locally to start the conversion.'}
                </span>
              </span>
              <span className="upload-field__cta">{sourceMeta ? 'Swap file' : 'Browse video'}</span>
            </label>
            <div className="upload-field__meta">
              <span>{sourceMeta ? `Prepared as ${slugifyVideoGifFileName(sourceMeta.name)}` : 'MP4 and WebM are the most reliable options.'}</span>
              <span>The file stays in your browser.</span>
            </div>
          </div>

          {sourceMeta ? (
            <>
              <div className="stat-grid" style={{ marginTop: '1rem' }}>
                <article className="stat-card">
                  <span className="stat-card__label">Duration</span>
                  <strong>{formatVideoGifDuration(sourceMeta.duration)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Resolution</span>
                  <strong>
                    {sourceMeta.width} x {sourceMeta.height}
                  </strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Size</span>
                  <strong>{formatVideoGifBytes(sourceMeta.size)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Type</span>
                  <strong>{sourceMeta.type}</strong>
                </article>
              </div>

              <div className="stack-grid" style={{ marginTop: '1rem' }}>
                <label htmlFor="video-gif-start" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Start time (seconds)
                </label>
                <input
                  id="video-gif-start"
                  className="tool-input"
                  type="number"
                  min={0}
                  max={sourceMeta.duration}
                  step="0.1"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  disabled={isConverting}
                />

                <label htmlFor="video-gif-end" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  End time (seconds)
                </label>
                <input
                  id="video-gif-end"
                  className="tool-input"
                  type="number"
                  min={0}
                  max={sourceMeta.duration}
                  step="0.1"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  disabled={isConverting}
                />

                <label htmlFor="video-gif-fps" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Frame rate (1-20 FPS)
                </label>
                <input
                  id="video-gif-fps"
                  className="tool-input"
                  type="number"
                  min={1}
                  max={20}
                  step={1}
                  value={fps}
                  onChange={(event) => setFps(event.target.value)}
                  disabled={isConverting}
                />

                <label htmlFor="video-gif-width" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Output width (px)
                </label>
                <input
                  id="video-gif-width"
                  className="tool-input"
                  type="number"
                  min={96}
                  max={Math.min(960, sourceMeta.width)}
                  step={2}
                  value={width}
                  onChange={(event) => setWidth(event.target.value)}
                  disabled={isConverting}
                />

                <label htmlFor="video-gif-colors" style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Colors per frame
                </label>
                <select
                  id="video-gif-colors"
                  className="tool-input"
                  value={colorCount}
                  onChange={(event) => setColorCount(event.target.value)}
                  disabled={isConverting}
                >
                  {[32, 64, 128, 256].map((option) => (
                    <option key={option} value={option}>
                      {option} colors
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : null}

          <div className="tool-note" style={{ marginTop: '1rem' }}>
            <h2>Export planning</h2>
            <p>{plan ? `${plan.frameCount} frames, ${plan.width}x${plan.height}, about ${formatVideoGifDuration(plan.endTime - plan.startTime)} of video.` : 'Load a video to estimate frame count and output size.'}</p>
            <p>For smaller PR attachments, start around 480px wide, 8 FPS, and 64 colors.</p>
          </div>
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Preview and output</span>
            <span>{output ? output.fileName : 'Awaiting export'}</span>
          </div>

          <div className="stack-grid">
            <article className="insight-row">
              <strong>Status</strong>
              <p>{status}</p>
            </article>

            {progress ? (
              <article className="insight-row">
                <strong>Progress</strong>
                <p>
                  {progress.completedFrames}/{progress.totalFrames} frames ({progress.percent}%) at {formatVideoGifDuration(progress.currentTime)}
                </p>
              </article>
            ) : null}

            {output ? (
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__label">GIF size</span>
                  <strong>{formatVideoGifBytes(output.size)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Frames</span>
                  <strong>{output.frameCount}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Playback</span>
                  <strong>{formatVideoGifDuration(output.duration)}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Render</span>
                  <strong>
                    {output.width} x {output.height}
                  </strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">FPS</span>
                  <strong>{output.fps}</strong>
                </article>
                <article className="stat-card">
                  <span className="stat-card__label">Colors</span>
                  <strong>{output.colorCount}</strong>
                </article>
              </div>
            ) : null}

            <div className="qr-preview-shell" data-testid="video-to-gif-preview">
              {!sourcePreviewUrl && !outputPreviewUrl ? <div className="empty-panel-copy">Upload a video to preview the source and export a GIF.</div> : null}

              {outputPreviewUrl ? (
                <div className="stack-grid">
                  <strong>GIF preview</strong>
                  <img src={outputPreviewUrl} alt="Generated GIF preview" className="qr-preview-canvas" />
                </div>
              ) : null}

              {!outputPreviewUrl && sourcePreviewUrl ? (
                <div className="stack-grid">
                  <strong className="media-preview-heading">
                    <Film size={16} />
                    Source preview
                  </strong>
                  <video controls muted src={sourcePreviewUrl} style={{ width: '100%', borderRadius: '1rem' }} />
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </ToolFrame>
  );
}
