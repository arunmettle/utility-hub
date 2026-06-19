import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import ToolFrame from '../components/ToolFrame';

const sampleValue = 'https://cobalt.local/privacy-first';

export default function QRCodeGenerator() {
  const [input, setInput] = useState(sampleValue);
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!input.trim()) {
      const context = canvas.getContext('2d');
      context?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    QRCode.toCanvas(canvas, input, {
      width: size,
      margin: 2,
      errorCorrectionLevel: errorLevel,
      color: { dark: '#20312a', light: '#ffffff' },
    }).catch(() => undefined);
  }, [errorLevel, input, size]);

  const getDataUrl = () => canvasRef.current?.toDataURL('image/png') ?? '';

  const copyImage = async () => {
    const dataUrl = getDataUrl();
    if (!dataUrl) return;
    await navigator.clipboard.writeText(dataUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const downloadImage = () => {
    const dataUrl = getDataUrl();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = 'cobalt-qrcode.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <ToolFrame
      eyebrow="Generator"
      title="QR Code Generator"
      description="Generate QR codes entirely in the browser for URLs, tokens, or internal handoff strings."
      actions={
        <>
          <button type="button" className="action-button" onClick={copyImage} disabled={!input.trim()}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button type="button" className="action-button action-button--primary" onClick={downloadImage} disabled={!input.trim()}>
            <Download size={16} />
            Download PNG
          </button>
          <button type="button" className="action-button" onClick={() => setInput('')}>
            Clear
          </button>
        </>
      }
      note={{
        title: 'Privacy note',
        body: 'The QR payload is rendered locally on a canvas element and never needs to leave the device.',
      }}
    >
      <div className="editor-grid">
        <section className="editor-panel">
          <div className="editor-panel__head">
            <span>Content</span>
            <span>Text or URL</span>
          </div>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="editor-textarea editor-textarea--compact"
            placeholder="Enter the content to encode."
          />

          <div className="editor-panel__head editor-panel__head--spaced">
            <span>Size</span>
            <span>{size}px</span>
          </div>
          <input
            type="range"
            min="128"
            max="512"
            step="64"
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
            className="field-range"
          />

          <div className="editor-panel__head editor-panel__head--spaced">
            <span>Error correction</span>
            <span>{errorLevel}</span>
          </div>
          <div className="mode-toggle">
            {(['L', 'M', 'Q', 'H'] as const).map((level) => (
              <button
                key={level}
                type="button"
                className={errorLevel === level ? 'is-active' : ''}
                onClick={() => setErrorLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        <section className="editor-panel">
          <div className="editor-panel__head">
            <span className="editor-panel__heading-with-icon">
              <QrCode size={16} />
              Preview
            </span>
            <span>Canvas output</span>
          </div>
          <div className="qr-preview-shell">
            {input.trim() ? <canvas ref={canvasRef} className="qr-preview-canvas" /> : <div className="empty-panel-copy">Add content to render the QR preview.</div>}
          </div>
        </section>
      </div>
    </ToolFrame>
  );
}
