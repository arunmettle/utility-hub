import { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import QRCode from 'qrcode';

export default function QRCodeGenerator() {
  const [input, setInput] = useState('');
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!input || !canvasRef.current) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
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
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      },
      (error) => {
        if (error) console.error(error);
      }
    );
  }, [input, size, errorLevel]);

  const downloadQRCode = () => {
    if (!canvasRef.current) return;
    
    const url = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = url;
    link.click();
  };

  const clear = () => {
    setInput('');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">QR Code Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">Create QR codes from text or URLs</p>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex gap-2">
        <button
          onClick={downloadQRCode}
          disabled={!input}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={16} />
          Download PNG
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
          {/* Settings */}
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Content
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text or URL..."
                rows={6}
                className="w-full p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Size: {size}px
              </label>
              <input
                type="range"
                min="128"
                max="512"
                step="64"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>128px</span>
                <span>512px</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Error Correction Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setErrorLevel(level)}
                    className={`py-2 rounded-lg transition-colors ${
                      errorLevel === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                L: 7% | M: 15% | Q: 25% | H: 30%
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg p-8">
              {input ? (
                <canvas ref={canvasRef} className="max-w-full" />
              ) : (
                <div 
                  className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded"
                  style={{ width: size, height: size }}
                >
                  <p className="text-gray-400 dark:text-gray-600 text-center px-4">
                    Enter content to generate QR code
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
