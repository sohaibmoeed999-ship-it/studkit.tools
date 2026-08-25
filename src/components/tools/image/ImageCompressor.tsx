import React, { useState } from 'react';
import { FileUploader } from '../../common/FileUploader';
import { ResultCard } from '../../common/ResultCard';
import { downloadFile, formatBytes } from '../../../utils/download';
import { Sliders, CheckCircle2 } from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [targetSize, setTargetSize] = useState<number>(50);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (files: File[]) => {
    if (files[0]) {
      const f = files[0];
      setFile(f);
      setOriginalUrl(URL.createObjectURL(f));
      compressToTarget(f, targetSize, targetUnit);
    }
  };

  const compressToTarget = async (sourceFile: File, targetVal: number, unit: 'KB' | 'MB') => {
    setIsProcessing(true);
    const targetBytes = unit === 'KB' ? targetVal * 1024 : targetVal * 1024 * 1024;

    const img = new Image();
    img.src = URL.createObjectURL(sourceFile);
    await new Promise(res => (img.onload = res));

    const canvas = document.createElement('canvas');
    let { width, height } = img;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, width, height);

    let minQ = 0.05;
    let maxQ = 0.98;
    let bestBlob: Blob | null = null;
    let bestDiff = Infinity;

    for (let i = 0; i < 8; i++) {
      const midQ = (minQ + maxQ) / 2;
      const blob = await new Promise<Blob | null>(resolve =>
        canvas.toBlob(resolve, 'image/jpeg', midQ)
      );
      if (!blob) break;

      const diff = Math.abs(blob.size - targetBytes);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestBlob = blob;
      }

      if (blob.size > targetBytes) {
        maxQ = midQ;
      } else {
        minQ = midQ;
      }
    }

    if (bestBlob && bestBlob.size > targetBytes * 1.15) {
      const scaleFactor = Math.sqrt(targetBytes / bestBlob.size);
      const scaledCanvas = document.createElement('canvas');
      scaledCanvas.width = Math.max(100, Math.floor(width * scaleFactor));
      scaledCanvas.height = Math.max(100, Math.floor(height * scaleFactor));
      const sCtx = scaledCanvas.getContext('2d');
      if (sCtx) {
        sCtx.drawImage(img, 0, 0, scaledCanvas.width, scaledCanvas.height);
        bestBlob = await new Promise<Blob | null>(resolve =>
          scaledCanvas.toBlob(resolve, 'image/jpeg', 0.82)
        );
      }
    }

    if (bestBlob) {
      setCompressedBlob(bestBlob);
      setCompressedUrl(URL.createObjectURL(bestBlob));
    }
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (compressedBlob && file) {
      const nameParts = file.name.split('.');
      const ext = nameParts.pop() || 'jpg';
      downloadFile(compressedBlob, `${nameParts.join('.')}_compressed.${ext}`);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUploader
          accept="image/*"
          onFilesSelected={handleFiles}
          title="Upload image to compress to exact KB/MB"
          subtitle="Ideal for government portals, college admission forms, and exam registration uploads."
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
                <Sliders className="w-4 h-4 text-theme-accent" />
                <span>Target File Size</span>
              </label>
              <p className="text-xs text-theme-text-muted">Enter the exact required size (e.g. 50 KB, 100 KB, 1 MB)</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="5"
                max="50000"
                value={targetSize}
                onChange={e => {
                  const val = parseInt(e.target.value) || 10;
                  setTargetSize(val);
                  if (file) compressToTarget(file, val, targetUnit);
                }}
                className="w-28 px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text text-sm font-mono font-bold text-center focus:border-theme-accent outline-none"
              />

              <div className="flex rounded-xl bg-theme-bg p-1 border border-theme-border">
                {(['KB', 'MB'] as const).map(u => (
                  <button
                    key={u}
                    onClick={() => {
                      setTargetUnit(u);
                      if (file) compressToTarget(file, targetSize, u);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      targetUnit === u ? 'bg-theme-accent text-white' : 'text-theme-text-muted hover:text-theme-text'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-theme-border">
                {[20, 50, 100, 200, 500].map(preset => (
                  <button
                    key={preset}
                    onClick={() => {
                      setTargetSize(preset);
                      setTargetUnit('KB');
                      if (file) compressToTarget(file, preset, 'KB');
                    }}
                    className="px-2 py-1 rounded-lg bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-[11px] font-mono text-theme-text"
                  >
                    {preset}KB
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-theme-text">Original Image</span>
                <span className="font-mono text-theme-text-muted bg-theme-bg px-2 py-0.5 rounded border border-theme-border">
                  {formatBytes(file.size)}
                </span>
              </div>
              <div className="h-64 rounded-xl bg-black/40 border border-theme-border flex items-center justify-center overflow-hidden">
                {originalUrl && (
                  <img src={originalUrl} alt="Original" className="max-w-full max-h-full object-contain" />
                )}
              </div>
            </div>

            <div className="bg-theme-surface border border-theme-border rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-theme-accent flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Compressed Output</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold bg-theme-bg px-2 py-0.5 rounded border border-emerald-500/30">
                  {compressedBlob ? formatBytes(compressedBlob.size) : 'Calculating...'}
                </span>
              </div>
              <div className="h-64 rounded-xl bg-black/40 border border-theme-border flex items-center justify-center overflow-hidden">
                {compressedUrl ? (
                  <img src={compressedUrl} alt="Compressed" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="text-xs text-theme-text-muted animate-pulse">Compressing image...</div>
                )}
              </div>
            </div>
          </div>

          <ResultCard
            title="Image Compression Complete"
            description={`Reduced from ${formatBytes(file.size)} to ${compressedBlob ? formatBytes(compressedBlob.size) : '...'}`}
            onDownload={handleDownload}
            onReset={() => {
              setFile(null);
              setCompressedBlob(null);
            }}
            downloadLabel="Download Compressed Image"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-theme-text-muted">
              <span>Savings: {compressedBlob ? ((1 - compressedBlob.size / file.size) * 100).toFixed(1) : 0}%</span>
              <span>100% Client-side conversion. Safe & private.</span>
            </div>
          </ResultCard>
        </div>
      )}
    </div>
  );
};
