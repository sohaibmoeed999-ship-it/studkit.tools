import React, { useState } from 'react';
import JSZip from 'jszip';
import { ResultCard } from '../../common/ResultCard';
import { FileUploader } from '../../common/FileUploader';
import { downloadFile, formatBytes } from '../../../utils/download';
import { Images, Download, Sparkles, Sliders } from 'lucide-react';

export const BatchImageResizerCompressor: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [targetWidth, setTargetWidth] = useState<number>(1280);
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (selected: File[]) => {
    setFiles(prev => [...prev, ...selected]);
  };

  const processAndDownloadZip = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    const zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const img = new Image();
      const url = URL.createObjectURL(file);

      await new Promise<void>(resolve => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = targetWidth / img.width;
          canvas.width = targetWidth;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(blob => {
            if (blob) {
              zip.file(`resized_${file.name.replace(/\.[^/.]+$/, '')}.jpg`, blob);
            }
            resolve();
          }, 'image/jpeg', quality / 100);
        };
        img.src = url;
      });
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadFile(zipBlob, 'STUDKIT_batch_optimized_images.zip');
    setIsProcessing(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Images className="w-5 h-5 text-theme-accent" />
            <h3 className="text-base sm:text-lg font-bold text-theme-text">Batch Image Resizer & Compressor</h3>
          </div>
          <span className="text-xs font-mono text-theme-text-muted">{files.length} images queued</span>
        </div>

        <FileUploader
          accept="image/*"
          multiple
          onFilesSelected={handleFiles}
          title="Upload multiple photos (JPG, PNG, WebP)"
          subtitle="Batch resize and compress all images simultaneously into a single ZIP archive."
        />

        {files.length > 0 && (
          <div className="space-y-4 pt-2 border-t border-theme-border">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-theme-text-muted font-semibold">
                  <span>Target Max Width</span>
                  <span className="font-mono text-theme-text">{targetWidth}px</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="2560"
                  step="80"
                  value={targetWidth}
                  onChange={e => setTargetWidth(parseInt(e.target.value))}
                  className="w-full accent-theme-accent"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-theme-text-muted font-semibold">
                  <span>Compression Quality</span>
                  <span className="font-mono text-theme-text">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={quality}
                  onChange={e => setQuality(parseInt(e.target.value))}
                  className="w-full accent-theme-accent"
                />
              </div>
            </div>

            <button
              onClick={processAndDownloadZip}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isProcessing ? 'Optimizing Images & Zipping...' : `Process & Download ${files.length} Images (.ZIP)`}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
