import React, { useRef, useState, useEffect } from 'react';
import { FileUploader } from '../../common/FileUploader';
import { ResultCard } from '../../common/ResultCard';
import { downloadFile } from '../../../utils/download';
import { Trash2, Sliders, Check } from 'lucide-react';

export const SignatureStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'draw' | 'clean'>('draw');
  const [penColor, setPenColor] = useState<'#000000' | '#1e3a8a' | '#047857' | '#ffffff'>('#000000');
  const [penWidth, setPenWidth] = useState<number>(3);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [cleanPhotoSrc, setCleanPhotoSrc] = useState<string | null>(null);
  const [contrastThreshold, setContrastThreshold] = useState<number>(140);
  const [cleanResultUrl, setCleanResultUrl] = useState<string | null>(null);

  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    if (activeTab === 'draw') {
      const canvas = drawCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    setHasDrawn(true);
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const downloadDrawnSignature = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (blob) downloadFile(blob, 'transparent_signature.png');
    }, 'image/png');
  };

  const handlePhotoFiles = (files: File[]) => {
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        setCleanPhotoSrc(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  useEffect(() => {
    if (!cleanPhotoSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

        if (brightness > contrastThreshold) {
          data[i + 3] = 0;
        } else {
          data[i] = 10;
          data[i + 1] = 15;
          data[i + 2] = 25;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      canvas.toBlob(blob => {
        if (blob) setCleanResultUrl(URL.createObjectURL(blob));
      }, 'image/png');
    };
    img.src = cleanPhotoSrc;
  }, [cleanPhotoSrc, contrastThreshold]);

  const downloadCleanSignature = () => {
    if (cleanResultUrl) {
      fetch(cleanResultUrl)
        .then(r => r.blob())
        .then(blob => downloadFile(blob, 'clean_paper_signature.png'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex rounded-2xl bg-theme-surface p-1.5 border border-theme-border max-w-md">
        <button
          onClick={() => setActiveTab('draw')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'draw' ? 'bg-theme-accent text-white shadow-md' : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          Draw Digital Signature
        </button>
        <button
          onClick={() => setActiveTab('clean')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'clean' ? 'bg-theme-accent text-white shadow-md' : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          Clean Paper Signature Photo
        </button>
      </div>

      {activeTab === 'draw' ? (
        <div className="space-y-6">
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-theme-text">Ink Color:</span>
              {[
                { id: '#000000', label: 'Black' },
                { id: '#1e3a8a', label: 'Dark Blue' },
                { id: '#047857', label: 'Green' },
                { id: '#ffffff', label: 'White' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setPenColor(c.id as any)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform ${
                    penColor === c.id ? 'scale-110 border-theme-accent' : 'border-gray-500'
                  }`}
                  style={{ backgroundColor: c.id }}
                >
                  {penColor === c.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-theme-text">Stroke: {penWidth}px</span>
              <input
                type="range"
                min="1"
                max="8"
                value={penWidth}
                onChange={e => setPenWidth(parseInt(e.target.value))}
                className="w-24 accent-theme-accent"
              />
            </div>

            <button
              onClick={clearCanvas}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-rose-500/10 border border-theme-border hover:border-rose-500/30 text-xs text-rose-400 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Pad</span>
            </button>
          </div>

          <div className="relative border-2 border-dashed border-theme-border rounded-2xl p-4 bg-transparent overflow-hidden shadow-inner flex items-center justify-center">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, #888 25%, transparent 25%), linear-gradient(-45deg, #888 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #888 75%), linear-gradient(-45deg, transparent 75%, #888 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            />
            <canvas
              ref={drawCanvasRef}
              width={900}
              height={360}
              onMouseDown={startDrawing}
              onMouseMove={drawMove}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={drawMove}
              onTouchEnd={stopDrawing}
              className="relative z-10 w-full max-w-2xl h-64 sm:h-80 cursor-crosshair touch-none"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-theme-text-muted/40 font-mono text-sm">
                Sign here with mouse, stylus, or touch
              </div>
            )}
          </div>

          <ResultCard
            title="Digital Transparent Signature"
            description="Exports with high-resolution alpha channel for direct embedding into PDFs and Word docs."
            onDownload={hasDrawn ? downloadDrawnSignature : undefined}
            downloadLabel="Download Transparent PNG"
          >
            <p className="text-xs text-theme-text-muted">
              Zero compression artifacts. Ideal for college applications, internship letters, and contracts.
            </p>
          </ResultCard>
        </div>
      ) : (
        <div className="space-y-6">
          {!cleanPhotoSrc ? (
            <FileUploader
              accept="image/*"
              onFilesSelected={handlePhotoFiles}
              title="Upload photo of signature written on white paper"
              subtitle="We will automatically strip the paper texture, lighting shadows, and convert to transparent PNG."
            />
          ) : (
            <div className="space-y-6">
              <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 text-theme-accent" />
                  <span className="text-xs font-bold text-theme-text">Background Clean Sensitivity:</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="80"
                    max="220"
                    value={contrastThreshold}
                    onChange={e => setContrastThreshold(parseInt(e.target.value))}
                    className="w-48 accent-theme-accent"
                  />
                  <span className="text-xs font-mono text-theme-text">{contrastThreshold}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-semibold text-theme-text-muted">Original Paper Photo</span>
                  <div className="h-56 rounded-xl bg-black/40 border border-theme-border flex items-center justify-center overflow-hidden">
                    <img src={cleanPhotoSrc} alt="Original" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>

                <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 space-y-2">
                  <span className="text-xs font-semibold text-theme-accent">Extracted Transparent PNG</span>
                  <div
                    className="h-56 rounded-xl border border-theme-border flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)',
                      backgroundSize: '16px 16px',
                    }}
                  >
                    {cleanResultUrl && (
                      <img src={cleanResultUrl} alt="Cleaned" className="max-w-full max-h-full object-contain" />
                    )}
                  </div>
                </div>
              </div>

              <ResultCard
                title="Signature Cleaned"
                description="Background extracted and smoothed to transparent PNG"
                onDownload={downloadCleanSignature}
                onReset={() => setCleanPhotoSrc(null)}
                downloadLabel="Download Extracted Signature"
              >
                <div className="text-xs text-theme-text-muted">
                  Ready to be stamped on assignments, lab records, and application forms.
                </div>
              </ResultCard>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
