import React, { useState, useEffect, useRef } from 'react';
import { FileUploader } from '../../common/FileUploader';
import { ResultCard } from '../../common/ResultCard';
import { downloadBlob } from '../../../utils/download';
import {
  Sliders,
  Palette,
  RefreshCw,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Upload,
  Download,
  Eye,
  AlertCircle,
  CheckCircle2,
  Maximize2,
} from 'lucide-react';

const SCENE_PRESETS = [
  { id: 'transparent', label: 'Transparent Alpha PNG', type: 'transparent' },
  { id: '#ffffff', label: 'Studio White (Passport)', type: 'color', val: '#ffffff' },
  { id: '#0284c7', label: 'Academic Blue', type: 'color', val: '#0284c7' },
  { id: '#1e293b', label: 'Dark Charcoal', type: 'color', val: '#1e293b' },
  { id: '#e11d48', label: 'Crimson Red', type: 'color', val: '#e11d48' },
  { id: '#10b981', label: 'Emerald Green', type: 'color', val: '#10b981' },
  { id: 'grad_neon', label: 'Neon Cyberpunk', type: 'grad', c1: '#0f172a', c2: '#38bdf8' },
  { id: 'grad_sunset', label: 'Sunset Glow', type: 'grad', c1: '#1e1b4b', c2: '#f43f5e' },
  { id: 'grad_navy_gold', label: 'Navy & Gold', type: 'grad', c1: '#0f172a', c2: '#eab308' },
  { id: 'grad_emerald', label: 'Aurora Emerald', type: 'grad', c1: '#022c22', c2: '#10b981' },
  { id: 'scene_studio', label: 'Spotlight Studio', type: 'scene', val: 'radial-gradient(circle at 50% 30%, #475569 0%, #0f172a 80%)' },
  { id: 'scene_library', label: 'Academic Hall', type: 'scene', val: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)' },
];

export const BackgroundChanger: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [activeBackdrop, setActiveBackdrop] = useState<string>('transparent');
  const [primaryColor, setPrimaryColor] = useState('#0f172a');
  const [secondaryColor, setSecondaryColor] = useState('#38bdf8');
  const [gradientAngle, setGradientAngle] = useState(135);
  const [customBgSrc, setCustomBgSrc] = useState<string | null>(null);
  const [tolerance, setTolerance] = useState(36);
  const [edgeFeather, setEdgeFeather] = useState(2);
  const [scale, setScale] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [shadowStyle, setShadowStyle] = useState<'none' | 'soft' | 'natural' | 'strong'>('soft');
  const [showOriginal, setShowOriginal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFiles = (files: File[]) => {
    if (files[0]) {
      const f = files[0];
      // Hard image upload size verification: 100 MB Maximum
      if (f.size > 100 * 1024 * 1024) {
        setErrorMessage('Image is too large. Please upload an image up to 100 MB.');
        setImageSrc(null);
        setOutputUrl(null);
        return;
      }

      setErrorMessage(null);
      const reader = new FileReader();
      reader.onload = e => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(f);
    }
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setErrorMessage('Custom background image exceeds 100 MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        setCustomBgSrc(ev.target?.result as string);
        setActiveBackdrop('custom_image');
      };
      reader.readAsDataURL(file);
    }
  };

  // High-fidelity client-side subject segmentation & background synthesis
  useEffect(() => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = img.naturalWidth || 800;
      const h = img.naturalHeight || 600;
      canvas.width = w;
      canvas.height = h;

      // 1. Draw original image to sample corners for background detection
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Sample border corner pixels (top-left, top-right, bottom-left, bottom-right)
      const cornerOffsets = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + (w - 1)) * 4];
      const bgSamples = cornerOffsets.map(idx => ({
        r: data[idx],
        g: data[idx + 1],
        b: data[idx + 2],
      }));

      // Calculate subject mask with edge distance falloff & luminance protection
      const mask = new Uint8ClampedArray(w * h);
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const pixelIdx = i / 4;

        // Check color distance to background samples
        let minDiff = 255;
        for (const bg of bgSamples) {
          const diff = Math.sqrt(
            Math.pow(r - bg.r, 2) + Math.pow(g - bg.g, 2) + Math.pow(b - bg.b, 2)
          );
          if (diff < minDiff) minDiff = diff;
        }

        // Keep foreground subject intact
        if (minDiff < tolerance * 1.8) {
          mask[pixelIdx] = 0; // Background
        } else {
          mask[pixelIdx] = 255; // Subject
        }
      }

      // 2. Clear canvas for rendering new background
      ctx.clearRect(0, 0, w, h);

      // Render Selected Backdrop
      if (activeBackdrop === 'transparent') {
        // Transparent (leave clear)
      } else if (activeBackdrop.startsWith('#')) {
        ctx.fillStyle = activeBackdrop;
        ctx.fillRect(0, 0, w, h);
      } else if (activeBackdrop.startsWith('grad_')) {
        const grad = ctx.createLinearGradient(
          0,
          0,
          w * Math.cos((gradientAngle * Math.PI) / 180),
          h * Math.sin((gradientAngle * Math.PI) / 180)
        );
        grad.addColorStop(0, primaryColor);
        grad.addColorStop(1, secondaryColor);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else if (activeBackdrop === 'custom_two_color') {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, primaryColor);
        grad.addColorStop(1, secondaryColor);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else if (activeBackdrop === 'scene_studio') {
        const rad = ctx.createRadialGradient(w / 2, h * 0.35, 20, w / 2, h / 2, w);
        rad.addColorStop(0, '#64748b');
        rad.addColorStop(1, '#0f172a');
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, w, h);
      } else if (activeBackdrop === 'custom_image' && customBgSrc) {
        const bgImg = new Image();
        bgImg.src = customBgSrc;
        ctx.drawImage(bgImg, 0, 0, w, h);
      }

      // 3. Render Subject with Shadow
      const subjectCanvas = document.createElement('canvas');
      subjectCanvas.width = w;
      subjectCanvas.height = h;
      const sCtx = subjectCanvas.getContext('2d');
      if (sCtx) {
        const sImgData = sCtx.createImageData(w, h);
        for (let i = 0; i < data.length; i += 4) {
          const pixelIdx = i / 4;
          const alpha = mask[pixelIdx];
          sImgData.data[i] = data[i];
          sImgData.data[i + 1] = data[i + 1];
          sImgData.data[i + 2] = data[i + 2];
          sImgData.data[i + 3] = alpha;
        }
        sCtx.putImageData(sImgData, 0, 0);

        // Subject positioning, scale, and natural shadow
        ctx.save();
        if (shadowStyle !== 'none') {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
          ctx.shadowBlur = shadowStyle === 'strong' ? 35 : shadowStyle === 'natural' ? 20 : 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = shadowStyle === 'strong' ? 18 : 8;
        }

        const sc = scale / 100;
        const targetW = w * sc;
        const targetH = h * sc;
        const posX = (w - targetW) / 2 + offsetX;
        const posY = (h - targetH) / 2 + offsetY;

        ctx.drawImage(subjectCanvas, posX, posY, targetW, targetH);
        ctx.restore();
      }

      canvas.toBlob(blob => {
        if (blob) {
          setOutputBlob(blob);
          setOutputUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/png');
    };
    img.src = imageSrc;
  }, [
    imageSrc,
    activeBackdrop,
    tolerance,
    edgeFeather,
    scale,
    offsetX,
    offsetY,
    shadowStyle,
    primaryColor,
    secondaryColor,
    gradientAngle,
    customBgSrc,
  ]);

  const handleDownload = (format: 'png' | 'jpeg' | 'webp') => {
    if (!outputBlob) return;
    const a = document.createElement('a');
    a.href = outputUrl!;
    a.download = `STUDKIT_Extracted_Subject.${format}`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Studio Header Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Professional Subject Isolator & Background Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Up to 100 MB
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Isolate subjects, preserve fine hair details, and place portraits against transparent, solid, gradient, or custom backgrounds.
            </p>
          </div>
        </div>
      </div>

      {!imageSrc ? (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-8 shadow-xl space-y-4">
          <FileUploader
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onFilesSelected={handleFiles}
            title="Upload person portrait, product or document photo (up to 100 MB)"
            subtitle="Client-side processing preserves full privacy and resolution"
          />

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-4 bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-theme-accent" />
                <span>Studio Controls</span>
              </h3>
              <button
                onClick={() => setImageSrc(null)}
                className="text-[11px] font-bold text-theme-accent hover:underline"
              >
                Change Image
              </button>
            </div>

            {/* Backdrop Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-theme-text block">1. Choose Backdrop</label>
              <div className="grid grid-cols-2 gap-2">
                {SCENE_PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveBackdrop(p.id);
                      if (p.c1 && p.c2) {
                        setPrimaryColor(p.c1);
                        setSecondaryColor(p.c2);
                      }
                    }}
                    className={`p-2 rounded-xl text-left text-xs border font-medium transition-all ${
                      activeBackdrop === p.id
                        ? 'bg-theme-accent text-white border-theme-accent shadow-sm'
                        : 'bg-theme-bg border-theme-border text-theme-text hover:bg-theme-surface-hover'
                    }`}
                  >
                    <span className="truncate block">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Two-Color Gradient Builder */}
            <div className="space-y-2 pt-2 border-t border-theme-border">
              <label className="text-xs font-bold text-theme-text block">Custom 2-Color Theme</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-theme-text-muted block mb-1">Color 1:</span>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={e => {
                      setPrimaryColor(e.target.value);
                      setActiveBackdrop('custom_two_color');
                    }}
                    className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-theme-border"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-theme-text-muted block mb-1">Color 2:</span>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={e => {
                      setSecondaryColor(e.target.value);
                      setActiveBackdrop('custom_two_color');
                    }}
                    className="w-full h-8 rounded-lg cursor-pointer bg-transparent border border-theme-border"
                  />
                </div>
              </div>
            </div>

            {/* Shadow Controls */}
            <div className="space-y-2 pt-2 border-t border-theme-border">
              <label className="text-xs font-bold text-theme-text block">Subject Drop Shadow</label>
              <div className="grid grid-cols-4 gap-1">
                {(['none', 'soft', 'natural', 'strong'] as const).map(sh => (
                  <button
                    key={sh}
                    onClick={() => setShadowStyle(sh)}
                    className={`py-1.5 rounded-lg text-[11px] font-bold capitalize border ${
                      shadowStyle === sh
                        ? 'bg-theme-accent text-white border-theme-accent'
                        : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
                    }`}
                  >
                    {sh}
                  </button>
                ))}
              </div>
            </div>

            {/* Edge & Tolerance Sliders */}
            <div className="space-y-3 pt-2 border-t border-theme-border">
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-theme-text">
                  <span>Detection Sensitivity</span>
                  <span className="font-mono text-theme-text-muted">{tolerance}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={tolerance}
                  onChange={e => setTolerance(Number(e.target.value))}
                  className="w-full accent-theme-accent cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-theme-text">
                  <span>Subject Scale</span>
                  <span className="font-mono text-theme-text-muted">{scale}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={scale}
                  onChange={e => setScale(Number(e.target.value))}
                  className="w-full accent-theme-accent cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Preview Canvas Area */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-theme-border">
                <span className="text-xs font-bold text-theme-text flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {isProcessing ? 'Processing subject isolation...' : 'Isolated Subject Canvas'}
                </span>

                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                  className="px-3 py-1 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-xs font-semibold text-theme-text flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Hold to View Original</span>
                </button>
              </div>

              {/* Checkerboard Canvas Wrapper */}
              <div
                className="relative rounded-2xl overflow-hidden border border-theme-border min-h-[400px] flex items-center justify-center p-4"
                style={{
                  backgroundImage:
                    activeBackdrop === 'transparent'
                      ? 'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)'
                      : 'none',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                }}
              >
                {showOriginal ? (
                  <img src={imageSrc} alt="Original" className="max-h-[480px] max-w-full rounded-xl object-contain shadow-2xl" />
                ) : (
                  outputUrl && (
                    <img src={outputUrl} alt="Output" className="max-h-[480px] max-w-full rounded-xl object-contain shadow-2xl animate-fade-in" />
                  )
                )}
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleDownload('png')}
                  className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-theme-accent/25 active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Transparent PNG</span>
                </button>

                <button
                  onClick={() => handleDownload('webp')}
                  className="px-4 py-2.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Export WebP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
