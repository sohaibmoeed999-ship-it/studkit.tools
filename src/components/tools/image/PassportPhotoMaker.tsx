import React, { useState, useRef, useEffect } from 'react';
import { FileUploader } from '../../common/FileUploader';
import { ResultCard } from '../../common/ResultCard';
import { downloadFile } from '../../../utils/download';
import { Sliders, RefreshCw } from 'lucide-react';

export const PassportPhotoMaker: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [formatPreset, setFormatPreset] = useState<'us' | 'eu' | 'custom'>('us');
  const [bgColor, setBgColor] = useState<'original' | 'white' | 'light_blue' | 'light_gray'>('white');
  const [copies, setCopies] = useState<number>(6);
  const [paperSize, setPaperSize] = useState<'single' | '4x6' | 'a4'>('4x6');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files[0]) {
      const reader = new FileReader();
      reader.onload = e => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  useEffect(() => {
    if (!imageSrc) return;
    generatePassportSheet();
  }, [imageSrc, formatPreset, bgColor, copies, paperSize]);

  const generatePassportSheet = () => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const photoWidth = formatPreset === 'us' ? 600 : 420;
      const photoHeight = formatPreset === 'us' ? 600 : 540;

      const singleCanvas = document.createElement('canvas');
      singleCanvas.width = photoWidth;
      singleCanvas.height = photoHeight;
      const sCtx = singleCanvas.getContext('2d');
      if (!sCtx) return;

      if (bgColor === 'white') {
        sCtx.fillStyle = '#ffffff';
        sCtx.fillRect(0, 0, photoWidth, photoHeight);
      } else if (bgColor === 'light_blue') {
        sCtx.fillStyle = '#dbeafe';
        sCtx.fillRect(0, 0, photoWidth, photoHeight);
      } else if (bgColor === 'light_gray') {
        sCtx.fillStyle = '#f1f5f9';
        sCtx.fillRect(0, 0, photoWidth, photoHeight);
      }

      const scale = Math.max(photoWidth / img.width, photoHeight / img.height);
      const scaledW = img.width * scale;
      const scaledH = img.height * scale;
      const offsetX = (photoWidth - scaledW) / 2;
      const offsetY = (photoHeight - scaledH) / 2;

      sCtx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
      sCtx.strokeStyle = '#cbd5e1';
      sCtx.lineWidth = 2;
      sCtx.strokeRect(0, 0, photoWidth, photoHeight);

      if (paperSize === 'single') {
        canvas.width = photoWidth;
        canvas.height = photoHeight;
        ctx.drawImage(singleCanvas, 0, 0);
      } else if (paperSize === '4x6') {
        canvas.width = 1800;
        canvas.height = 1200;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cols = 3;
        const rows = 2;
        const startX = 120;
        const startY = 80;
        const gapX = 40;
        const gapY = 40;

        let rendered = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (rendered < copies) {
              const x = startX + c * (photoWidth + gapX);
              const y = startY + r * (photoHeight + gapY);
              ctx.drawImage(singleCanvas, x, y, photoWidth, photoHeight);
              rendered++;
            }
          }
        }
      } else {
        canvas.width = 2480;
        canvas.height = 3508;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cols = 4;
        const rows = 4;
        const startX = 160;
        const startY = 160;
        const gapX = 60;
        const gapY = 60;

        let rendered = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (rendered < copies) {
              const x = startX + c * (photoWidth + gapX);
              const y = startY + r * (photoHeight + gapY);
              ctx.drawImage(singleCanvas, x, y, photoWidth, photoHeight);
              rendered++;
            }
          }
        }
      }

      canvas.toBlob(blob => {
        if (blob) {
          setResultBlob(blob);
          setPreviewUrl(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 0.95);
    };
    img.src = imageSrc;
  };

  const handleDownload = () => {
    if (resultBlob) {
      downloadFile(resultBlob, `passport_photo_sheet_${paperSize}.jpg`);
    }
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <FileUploader
          accept="image/*"
          onFilesSelected={handleFiles}
          title="Upload your portrait or headshot"
          subtitle="Supports JPG, PNG, WebP format. Clean background photo works best."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
              <Sliders className="w-4 h-4 text-theme-accent" />
              <span>Passport Specifications</span>
            </h3>

            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-2">Standard Preset</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFormatPreset('us')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    formatPreset === 'us'
                      ? 'bg-theme-accent text-white border-theme-accent'
                      : 'bg-theme-bg border-theme-border text-theme-text hover:bg-theme-surface-hover'
                  }`}
                >
                  US / India (2 x 2 in)
                </button>
                <button
                  onClick={() => setFormatPreset('eu')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                    formatPreset === 'eu'
                      ? 'bg-theme-accent text-white border-theme-accent'
                      : 'bg-theme-bg border-theme-border text-theme-text hover:bg-theme-surface-hover'
                  }`}
                >
                  UK / EU (35 x 45 mm)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-2">Background Tint</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'white', label: 'White', color: '#ffffff' },
                  { id: 'light_blue', label: 'Light Blue', color: '#dbeafe' },
                  { id: 'light_gray', label: 'Light Gray', color: '#f1f5f9' },
                ].map(b => (
                  <button
                    key={b.id}
                    onClick={() => setBgColor(b.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border transition-all ${
                      bgColor === b.id
                        ? 'border-theme-accent bg-theme-accent/15 text-theme-accent font-semibold'
                        : 'border-theme-border bg-theme-bg text-theme-text'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-gray-400" style={{ backgroundColor: b.color }} />
                    <span>{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-theme-text-muted block mb-2">Print Layout</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: '4x6', label: '4x6 Photo' },
                  { id: 'a4', label: 'A4 Sheet' },
                  { id: 'single', label: 'Single ID' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPaperSize(p.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                      paperSize === p.id
                        ? 'bg-theme-accent text-white border-theme-accent'
                        : 'bg-theme-bg border-theme-border text-theme-text'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {paperSize !== 'single' && (
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-2">
                  Number of Copies ({copies})
                </label>
                <input
                  type="range"
                  min="1"
                  max={paperSize === '4x6' ? 6 : 16}
                  value={copies}
                  onChange={e => setCopies(parseInt(e.target.value))}
                  className="w-full accent-theme-accent"
                />
              </div>
            )}

            <button
              onClick={() => setImageSrc(null)}
              className="w-full py-2.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-medium text-theme-text-muted hover:text-theme-text flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Choose Another Photo</span>
            </button>
          </div>

          <div className="lg:col-span-2">
            <ResultCard
              title="Printable Passport Grid Ready"
              description={`Formatted as ${formatPreset.toUpperCase()} standard layout on ${paperSize.toUpperCase()}`}
              onDownload={handleDownload}
              downloadLabel="Download High-Res Sheet"
            >
              <div className="flex items-center justify-center p-4 bg-black/40 rounded-xl border border-theme-border overflow-hidden max-h-[500px]">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Passport Preview"
                    className="max-w-full max-h-[440px] object-contain rounded-lg shadow-2xl"
                  />
                )}
              </div>
            </ResultCard>
          </div>
        </div>
      )}
    </div>
  );
};
