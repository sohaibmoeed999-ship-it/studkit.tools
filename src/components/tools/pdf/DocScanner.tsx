import React, { useState, useRef, useEffect } from 'react';
import { ResultCard } from '../../common/ResultCard';
import { downloadBlob, downloadFile } from '../../../utils/download';
import { PDFDocument } from 'pdf-lib';
import {
  Camera,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FlipHorizontal,
  Upload,
  Download,
  FileText,
  Sparkles,
  Maximize2,
  Zap,
} from 'lucide-react';

export const DocScanner: React.FC = () => {
  const [streamActive, setStreamActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'bw' | 'grayscale' | 'enhanced' | 'original'>('enhanced');
  const [contrast, setContrast] = useState(125);
  const [brightness, setBrightness] = useState(105);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera tracks safely
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    setStreamActive(false);
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    stopCameraStream();
    setErrorMessage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Your browser or device does not support direct camera capture. Please upload an image instead.');
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera access was denied. Please allow camera permission in your browser settings and try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera was detected on this device. You can upload document photos directly.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMessage('Camera is currently in use by another application. Please close other camera apps and retry.');
      } else {
        setErrorMessage('Could not initialize camera stream. Please use the image upload option.');
      }
    }
  };

  const handleSwitchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const src = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(src);

    stopCameraStream();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setErrorMessage('Image is too large. Maximum supported image size is 100 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        setCapturedImage(ev.target?.result as string);
        stopCameraStream();
      };
      reader.readAsDataURL(file);
    }
  };

  const processFilterToBlob = (): Promise<Blob | null> => {
    return new Promise(resolve => {
      if (!capturedImage) return resolve(null);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          if (filterMode === 'bw') {
            const threshold = (255 * (200 - contrast)) / 100;
            const val = lum > threshold ? 255 : 0;
            d[i] = val;
            d[i + 1] = val;
            d[i + 2] = val;
          } else if (filterMode === 'grayscale') {
            d[i] = lum;
            d[i + 1] = lum;
            d[i + 2] = lum;
          } else if (filterMode === 'enhanced') {
            // Document text whitening & ink darkening
            const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
            const adjR = Math.min(255, Math.max(0, factor * (r - 128) + 128));
            const adjG = Math.min(255, Math.max(0, factor * (g - 128) + 128));
            const adjB = Math.min(255, Math.max(0, factor * (b - 128) + 128));
            d[i] = adjR;
            d[i + 1] = adjG;
            d[i + 2] = adjB;
          }
        }

        ctx.putImageData(imgData, 0, 0);
        canvas.toBlob(blob => resolve(blob), 'image/jpeg', 0.95);
      };
      img.src = capturedImage;
    });
  };

  const handleDownloadPdf = async () => {
    setIsProcessingPdf(true);
    try {
      const blob = await processFilterToBlob();
      if (!blob) return;
      const arrayBuffer = await blob.arrayBuffer();

      const pdfDoc = await PDFDocument.create();
      const image = await pdfDoc.embedJpg(arrayBuffer);
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      downloadBlob(pdfBlob, `STUDKIT_Scanned_Doc_${Date.now()}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Failed to generate PDF document.');
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleDownloadJpg = async () => {
    const blob = await processFilterToBlob();
    if (blob) {
      downloadBlob(blob, `STUDKIT_Scan_${Date.now()}.jpg`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Studio Header Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Document Camera Scanner & PDF Enhancer</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                Live HD Scanner
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Position handwritten notes, assignments, or textbook pages to capture, auto-crop, enhance and export to A4 PDF.
            </p>
          </div>
        </div>
      </div>

      {/* Main Scanner Container */}
      {!capturedImage ? (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-5">
          {!streamActive ? (
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-theme-bg border border-dashed border-theme-border space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-theme-text">Start Live Document Camera</h3>
                <p className="text-xs text-theme-text-muted max-w-md mx-auto">
                  Click below to grant camera access and scan syllabus documents, receipts, or notes.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => startCamera('environment')}
                  className="px-6 py-3 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs sm:text-sm font-bold shadow-xl shadow-theme-accent/25 flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>Allow & Open Camera</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-3 rounded-2xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs sm:text-sm font-semibold text-theme-text flex items-center gap-2 active:scale-95"
                >
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Upload Document Photo</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />
              </div>

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 text-left max-w-lg mx-auto animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          ) : (
            /* Live Camera Viewfinder Frame with Scanner Overlay */
            <div className="space-y-4 animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video sm:aspect-[4/3] max-h-[500px] flex items-center justify-center shadow-2xl border-2 border-theme-border">
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Document Viewfinder Frame Guides */}
                <div className="absolute inset-8 sm:inset-12 pointer-events-none border-2 border-cyan-400/80 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  {/* Corner Reticles */}
                  <span className="absolute -top-2 -left-2 w-5 h-5 border-t-4 border-l-4 border-cyan-400" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 border-t-4 border-r-4 border-cyan-400" />
                  <span className="absolute -bottom-2 -left-2 w-5 h-5 border-b-4 border-l-4 border-cyan-400" />
                  <span className="absolute -bottom-2 -right-2 w-5 h-5 border-b-4 border-r-4 border-cyan-400" />

                  {/* Animated Laser Scanning Line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-bounce opacity-80" />
                </div>
              </div>

              {/* Viewfinder Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-theme-bg p-4 rounded-2xl border border-theme-border">
                <button
                  onClick={handleSwitchCamera}
                  className="px-4 py-2.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1.5 active:scale-95"
                >
                  <FlipHorizontal className="w-4 h-4 text-cyan-400" />
                  <span>Switch Camera</span>
                </button>

                <button
                  onClick={capturePhoto}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-black tracking-wide shadow-xl shadow-cyan-500/25 flex items-center gap-2 active:scale-95 transition-all"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Document</span>
                </button>

                <button
                  onClick={stopCameraStream}
                  className="px-4 py-2.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-text-muted hover:text-theme-text active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Captured Document Processing Canvas */
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-5 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-theme-border">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-accent flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Captured Document Preview
            </span>

            <button
              onClick={() => {
                setCapturedImage(null);
                startCamera('environment');
              }}
              className="px-3 py-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Photo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Filter Controls */}
            <div className="md:col-span-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-theme-text block">Document Enhancement Filter</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'enhanced', label: 'Magic Enhance' },
                    { id: 'bw', label: 'Crisp B&W' },
                    { id: 'grayscale', label: 'Grayscale' },
                    { id: 'original', label: 'Original' },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFilterMode(f.id as any)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                        filterMode === f.id
                          ? 'bg-theme-accent text-white border-theme-accent shadow-sm'
                          : 'bg-theme-bg border-theme-border text-theme-text hover:bg-theme-surface-hover'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-theme-border">
                <div className="flex justify-between text-xs text-theme-text">
                  <span>Text Contrast</span>
                  <span className="font-mono text-theme-text-muted">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={contrast}
                  onChange={e => setContrast(Number(e.target.value))}
                  className="w-full accent-theme-accent cursor-pointer"
                />
              </div>

              <div className="space-y-2 pt-3 border-t border-theme-border">
                <button
                  onClick={handleDownloadPdf}
                  disabled={isProcessingPdf}
                  className="w-full py-3 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isProcessingPdf ? 'Generating PDF...' : 'Download as A4 PDF'}</span>
                </button>

                <button
                  onClick={handleDownloadJpg}
                  className="w-full py-2.5 rounded-2xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-semibold text-theme-text flex items-center justify-center gap-2 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Clean Image (JPG)</span>
                </button>
              </div>
            </div>

            {/* Document Image View */}
            <div className="md:col-span-8 flex items-center justify-center p-3 rounded-2xl bg-theme-bg border border-theme-border">
              <img
                src={capturedImage}
                alt="Captured Document"
                className={`max-h-[480px] max-w-full rounded-xl object-contain shadow-md transition-all ${
                  filterMode === 'bw'
                    ? 'filter contrast-200 grayscale'
                    : filterMode === 'grayscale'
                    ? 'filter grayscale'
                    : filterMode === 'enhanced'
                    ? 'filter contrast-125 brightness-105'
                    : ''
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
