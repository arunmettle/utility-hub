import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import ToolPage from '../components/ToolPage';

export default function QRCodeGenerator() {
  const [input, setInput] = useState('');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!input || !canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas?.getContext('2d');
      if (canvas && context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    QRCode.toCanvas(
      canvasRef.current,
      input,
      {
        width: size,
        errorCorrectionLevel: errorLevel,
        margin: 2,
        color: { dark: '#191c1e', light: '#ffffff' },
      },
      (renderError) => {
        if (renderError) {
          console.error(renderError);
        }
      },
    );
  }, [errorLevel, input, size]);

  const getQRCodeDataUrl = () => canvasRef.current?.toDataURL('image/png') ?? '';

  const copyQRCode = async () => {
    const dataUrl = getQRCodeDataUrl();
    if (!dataUrl) return;

    await navigator.clipboard.writeText(dataUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = () => {
    const dataUrl = getQRCodeDataUrl();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = 'utility-hub-qrcode.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <ToolPage
      title="QR Code Generator"
      description="Generate downloadable QR codes from text or URLs with precise sizing and correction-level controls."
      category="Generators"
      icon={QrCode}
      actions={
        <>
          <button type="button" onClick={copyQRCode} className="button-secondary" disabled={!input}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button type="button" onClick={downloadQRCode} className="button-primary" disabled={!input}>
            <Download size={16} />
            Download PNG
          </button>
          <button type="button" onClick={() => setInput('')} className="button-secondary">
            Clear
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-gutter xl:grid-cols-[1fr_420px]">
        <section className="app-panel p-6">
          <label className="field-label">Content</label>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Enter a URL, token, or plain text string…"
            className="field-textarea min-h-[180px]"
          />

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <div className="flex items-center justify-between gap-3">
                <label className="field-label mb-0">Size</label>
                <span className="font-mono text-label-md text-text-primary">{size}px</span>
              </div>
              <input
                type="range"
                min="128"
                max="512"
                step="64"
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="field-range mt-3"
              />
            </div>

            <div>
              <label className="field-label">Error Correction</label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setErrorLevel(level)}
                    className={`rounded border px-3 py-2 text-sm font-medium transition ${
                      errorLevel === level
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-background text-text-secondary hover:border-primary hover:text-primary'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="mt-2 font-mono text-[11px] text-text-secondary">L 7% / M 15% / Q 25% / H 30%</p>
            </div>
          </div>
        </section>

        <section className="app-panel flex items-center justify-center p-6">
          <div className="flex w-full flex-col items-center gap-4">
            <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
              {input ? (
                <canvas ref={canvasRef} className="block max-w-full" />
              ) : (
                <div
                  className="flex items-center justify-center rounded-md border border-dashed border-border bg-surface px-6 text-center text-body-md text-text-secondary"
                  style={{ width: size, height: size }}
                >
                  Add content to render the QR preview.
                </div>
              )}
            </div>
            <p className="font-mono text-label-sm uppercase text-text-secondary">PNG export ready</p>
          </div>
        </section>
      </div>
    </ToolPage>
  );
}
