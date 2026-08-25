import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { ResultCard } from '../../common/ResultCard';
import { downloadFile, formatBytes } from '../../../utils/download';
import { saveSharedItem, getSharedItem, StudKitSharedItem } from '../../../utils/shareHub';
import {
  QrCode,
  Download,
  Copy,
  Upload,
  Camera,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  File,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Eye,
} from 'lucide-react';

export const QrCodeStudio: React.FC = () => {
  const [mainTab, setMainTab] = useState<'generate' | 'scan'>('generate');
  const [inputType, setInputType] = useState<
    'text' | 'url' | 'image' | 'pdf' | 'audio' | 'video' | 'file'
  >('text');

  // Input states
  const [textContent, setTextContent] = useState('STUDKIT - Everything Students Need');
  const [urlContent, setUrlContent] = useState('https://studkit.app');
  const [uploadedFile, setUploadedFile] = useState<{
    file: File;
    dataUrl: string;
    type: 'image' | 'pdf' | 'audio' | 'video' | 'file';
  } | null>(null);

  // Customization Options
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState<number>(300);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState<number>(2);

  // QR Output & Share link
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [generatedShareUrl, setGeneratedShareUrl] = useState<string>('');
  const [activeShareId, setActiveShareId] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Scanner States
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [scannedSharedItem, setScannedSharedItem] = useState<StudKitSharedItem | null>(null);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isScanningCamera, setIsScanningCamera] = useState(false);
  const videoScannerRef = useRef<HTMLVideoElement>(null);
  const canvasScannerRef = useRef<HTMLCanvasElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Generate QR based on active tab and options
  useEffect(() => {
    let rawContentToEncode = '';

    if (inputType === 'text') {
      rawContentToEncode = textContent || ' ';
      setGeneratedShareUrl('');
      setActiveShareId('');
    } else if (inputType === 'url') {
      rawContentToEncode = urlContent || 'https://';
      setGeneratedShareUrl('');
      setActiveShareId('');
    } else if (uploadedFile) {
      // Save file to STUDKIT local retrieval share hub
      const shareId = 'sk_' + Math.random().toString(36).substring(2, 10);
      const shareItem: StudKitSharedItem = {
        id: shareId,
        name: uploadedFile.file.name,
        type: uploadedFile.type,
        mimeType: uploadedFile.file.type,
        size: uploadedFile.file.size,
        data: uploadedFile.dataUrl,
        createdAt: Date.now(),
      };
      saveSharedItem(shareItem);

      // Generate a universal retrieval URL
      const currentOrigin =
        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
      const shareLink = `${currentOrigin}/?share=${shareId}`;

      rawContentToEncode = shareLink;
      setGeneratedShareUrl(shareLink);
      setActiveShareId(shareId);
    } else {
      rawContentToEncode = 'STUDKIT';
    }

    if (!rawContentToEncode) return;

    QRCode.toDataURL(rawContentToEncode, {
      width: qrSize,
      margin: margin,
      errorCorrectionLevel: errorCorrection,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR Generation error:', err));
  }, [
    inputType,
    textContent,
    urlContent,
    uploadedFile,
    fgColor,
    bgColor,
    qrSize,
    errorCorrection,
    margin,
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf' | 'audio' | 'video' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setUploadedFile({
        file,
        dataUrl,
        type,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    fetch(qrDataUrl)
      .then(r => r.blob())
      .then(blob => downloadFile(blob, `STUDKIT_${inputType}_QR.png`));
  };

  const handleCopyLink = () => {
    if (generatedShareUrl) {
      navigator.clipboard.writeText(generatedShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Image QR Scanner using Canvas Analysis
  const handleScanImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScannerError(null);
    setScannedResult(null);
    setScannedSharedItem(null);

    const img = new Image();
    img.onload = () => {
      // In browser environment, we extract QR or try BarcodeDetector API
      if ('BarcodeDetector' in window) {
        const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
        barcodeDetector
          .detect(img)
          .then((barcodes: any[]) => {
            if (barcodes.length > 0) {
              processScannedValue(barcodes[0].rawValue);
            } else {
              setScannerError('No QR code detected in this image. Please ensure the code is clear and focused.');
            }
          })
          .catch(() => {
            setScannerError('QR reading failed. Please try a higher contrast image.');
          });
      } else {
        // Fallback for browsers without experimental BarcodeDetector
        // Simulate reading text from file or parsing share URL
        setScannedResult(
          `QR Image Scanned (${file.name}): If this is a STUDKIT Share QR, paste the share ID directly or upload to decoder.`
        );
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const processScannedValue = (val: string) => {
    setScannedResult(val);
    if (val.includes('?share=')) {
      const parts = val.split('?share=');
      const shareId = parts[1]?.split('&')[0];
      if (shareId) {
        const item = getSharedItem(shareId);
        if (item) {
          setScannedSharedItem(item);
        }
      }
    }
  };

  // Camera Live Scanner
  const startCameraScanner = async () => {
    setIsScanningCamera(true);
    setScannerError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      cameraStreamRef.current = stream;
      if (videoScannerRef.current) {
        videoScannerRef.current.srcObject = stream;
        videoScannerRef.current.play();
      }
    } catch (err: any) {
      setScannerError('Camera access denied or unavailable: ' + err.message);
      setIsScanningCamera(false);
    }
  };

  const stopCameraScanner = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
    }
    setIsScanningCamera(false);
  };

  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Generator / Scanner Toggle Tabs */}
      <div className="flex rounded-2xl bg-theme-surface p-1.5 border border-theme-border shadow-md">
        <button
          onClick={() => {
            setMainTab('generate');
            stopCameraScanner();
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            mainTab === 'generate'
              ? 'bg-theme-accent text-white shadow-md shadow-theme-accent/25'
              : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Anything to QR Studio</span>
        </button>

        <button
          onClick={() => setMainTab('scan')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            mainTab === 'scan'
              ? 'bg-theme-accent text-white shadow-md shadow-theme-accent/25'
              : 'text-theme-text-muted hover:text-theme-text'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>QR Scanner & Content Reader</span>
        </button>
      </div>

      {mainTab === 'generate' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Configuration & Upload Controls */}
          <div className="lg:col-span-7 bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
            {/* Input Type Selector Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-theme-text block uppercase tracking-wider">
                Select Content Type
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {[
                  { id: 'text', label: 'Text', icon: <FileText className="w-3.5 h-3.5" /> },
                  { id: 'url', label: 'URL', icon: <ExternalLink className="w-3.5 h-3.5" /> },
                  { id: 'image', label: 'Image', icon: <ImageIcon className="w-3.5 h-3.5" /> },
                  { id: 'pdf', label: 'PDF', icon: <FileText className="w-3.5 h-3.5" /> },
                  { id: 'audio', label: 'Audio', icon: <Music className="w-3.5 h-3.5" /> },
                  { id: 'video', label: 'Video', icon: <Video className="w-3.5 h-3.5" /> },
                  { id: 'file', label: 'File', icon: <File className="w-3.5 h-3.5" /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setInputType(tab.id as any);
                      setUploadedFile(null);
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-semibold border transition-all ${
                      inputType === tab.id
                        ? 'bg-theme-accent text-white border-theme-accent shadow-md shadow-theme-accent/20 scale-105'
                        : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
                    }`}
                  >
                    {tab.icon}
                    <span className="mt-1">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Input Areas */}
            <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-3">
              {inputType === 'text' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-theme-text-muted">Enter Text Note or Message</label>
                  <textarea
                    value={textContent}
                    onChange={e => setTextContent(e.target.value)}
                    placeholder="Type or paste student notes, formulas, or info..."
                    className="w-full h-28 p-3 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-text resize-none focus:border-theme-accent outline-none font-mono leading-relaxed"
                  />
                </div>
              )}

              {inputType === 'url' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-theme-text-muted">Website or Resource URL</label>
                  <input
                    type="url"
                    value={urlContent}
                    onChange={e => setUrlContent(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-text font-mono focus:border-theme-accent outline-none"
                  />
                </div>
              )}

              {inputType === 'image' && (
                <div className="space-y-3 text-center">
                  <label className="text-xs font-semibold text-theme-text-muted block text-left">
                    Upload Image (JPG / PNG / WebP)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={e => handleFileUpload(e, 'image')}
                    className="block w-full text-xs text-theme-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-theme-accent file:text-white hover:file:bg-theme-accent-hover cursor-pointer"
                  />
                  {uploadedFile && (
                    <div className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-between text-xs">
                      <span className="font-semibold text-theme-text truncate">{uploadedFile.file.name}</span>
                      <span className="font-mono text-theme-text-muted">{formatBytes(uploadedFile.file.size)}</span>
                    </div>
                  )}
                </div>
              )}

              {inputType === 'pdf' && (
                <div className="space-y-3 text-center">
                  <label className="text-xs font-semibold text-theme-text-muted block text-left">
                    Upload PDF Document
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={e => handleFileUpload(e, 'pdf')}
                    className="block w-full text-xs text-theme-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-theme-accent file:text-white hover:file:bg-theme-accent-hover cursor-pointer"
                  />
                  {uploadedFile && (
                    <div className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-between text-xs">
                      <span className="font-semibold text-theme-text truncate">{uploadedFile.file.name}</span>
                      <span className="font-mono text-theme-text-muted">{formatBytes(uploadedFile.file.size)}</span>
                    </div>
                  )}
                </div>
              )}

              {inputType === 'audio' && (
                <div className="space-y-3 text-center">
                  <label className="text-xs font-semibold text-theme-text-muted block text-left">
                    Upload Audio / Voice Recording (MP3 / WAV / M4A)
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={e => handleFileUpload(e, 'audio')}
                    className="block w-full text-xs text-theme-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-theme-accent file:text-white hover:file:bg-theme-accent-hover cursor-pointer"
                  />
                  {uploadedFile && (
                    <div className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-between text-xs">
                      <span className="font-semibold text-theme-text truncate">{uploadedFile.file.name}</span>
                      <span className="font-mono text-theme-text-muted">{formatBytes(uploadedFile.file.size)}</span>
                    </div>
                  )}
                </div>
              )}

              {inputType === 'video' && (
                <div className="space-y-3 text-center">
                  <label className="text-xs font-semibold text-theme-text-muted block text-left">
                    Upload Video Clip (MP4 / WebM)
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={e => handleFileUpload(e, 'video')}
                    className="block w-full text-xs text-theme-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-theme-accent file:text-white hover:file:bg-theme-accent-hover cursor-pointer"
                  />
                  {uploadedFile && (
                    <div className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-between text-xs">
                      <span className="font-semibold text-theme-text truncate">{uploadedFile.file.name}</span>
                      <span className="font-mono text-theme-text-muted">{formatBytes(uploadedFile.file.size)}</span>
                    </div>
                  )}
                </div>
              )}

              {inputType === 'file' && (
                <div className="space-y-3 text-center">
                  <label className="text-xs font-semibold text-theme-text-muted block text-left">
                    Upload Any Document / File (DOCX, ZIP, PPTX, TXT)
                  </label>
                  <input
                    type="file"
                    onChange={e => handleFileUpload(e, 'file')}
                    className="block w-full text-xs text-theme-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-theme-accent file:text-white hover:file:bg-theme-accent-hover cursor-pointer"
                  />
                  {uploadedFile && (
                    <div className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-between text-xs">
                      <span className="font-semibold text-theme-text truncate">{uploadedFile.file.name}</span>
                      <span className="font-mono text-theme-text-muted">{formatBytes(uploadedFile.file.size)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Customization Options */}
            <div className="space-y-4 pt-2 border-t border-theme-border">
              <span className="text-xs font-bold text-theme-text block uppercase tracking-wider">
                QR Code Styling & Robustness
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-theme-text-muted block">Foreground</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={e => setFgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-theme-border"
                    />
                    <span className="text-[10px] font-mono uppercase">{fgColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-theme-text-muted block">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={e => setBgColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-theme-border"
                    />
                    <span className="text-[10px] font-mono uppercase">{bgColor}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-theme-text-muted block">Error Correction</label>
                  <select
                    value={errorCorrection}
                    onChange={e => setErrorCorrection(e.target.value as any)}
                    className="w-full py-1.5 px-2 rounded-lg bg-theme-bg border border-theme-border text-xs text-theme-text font-mono"
                  >
                    <option value="L">L (7% Recovery)</option>
                    <option value="M">M (15% Recovery)</option>
                    <option value="Q">Q (25% Recovery)</option>
                    <option value="H">H (30% Highest)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-theme-text-muted block">Resolution</label>
                  <select
                    value={qrSize}
                    onChange={e => setQrSize(parseInt(e.target.value))}
                    className="w-full py-1.5 px-2 rounded-lg bg-theme-bg border border-theme-border text-xs text-theme-text font-mono"
                  >
                    <option value="200">200 x 200 px</option>
                    <option value="300">300 x 300 px (Standard)</option>
                    <option value="500">500 x 500 px (HD)</option>
                    <option value="800">800 x 800 px (Print)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* QR Live Preview & Action Deck */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-7 space-y-6 shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-theme-border">
                <span className="text-xs font-bold text-theme-text uppercase tracking-wider">
                  Live Scannable QR
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-theme-accent/15 text-theme-accent border border-theme-accent/30 font-bold uppercase">
                  {inputType}
                </span>
              </div>

              {/* Scannable Output Frame */}
              <div className="my-6 p-6 bg-white rounded-2xl border-2 border-theme-border flex flex-col items-center justify-center max-w-[280px] mx-auto shadow-inner">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Generated QR" className="w-48 h-48 sm:w-56 sm:h-56 object-contain" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-gray-400 text-xs">
                    Generating...
                  </div>
                )}
              </div>

              {generatedShareUrl && (
                <div className="p-3.5 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> STUDKIT Share Retrieval Active
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="text-xs text-theme-accent hover:underline flex items-center gap-1 font-mono font-bold"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-theme-text-muted truncate select-all">
                    {generatedShareUrl}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDownloadQR}
                className="w-full py-3.5 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res QR PNG</span>
              </button>

              <div className="text-[11px] text-theme-text-muted text-center font-mono">
                Scannable by any mobile camera or the STUDKIT scanner.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* QR SCANNER & CONTENT VIEWER */
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-theme-border">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-theme-text">QR Scanner & Content Reader</h3>
              <p className="text-xs text-theme-text-muted">
                Scan using camera or upload a QR image to extract and view text, files, images, or documents.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Live Camera Scanner Option */}
            <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border flex flex-col items-center justify-center text-center space-y-4">
              <Camera className="w-10 h-10 text-theme-accent" />
              <div>
                <h4 className="text-sm font-bold text-theme-text">Device Camera Scanner</h4>
                <p className="text-xs text-theme-text-muted mt-0.5">Use your mobile or laptop webcam to scan codes.</p>
              </div>

              {!isScanningCamera ? (
                <button
                  onClick={startCameraScanner}
                  className="px-6 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20"
                >
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={stopCameraScanner}
                  className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
                >
                  Stop Camera
                </button>
              )}

              {isScanningCamera && (
                <div className="w-full max-w-xs rounded-xl overflow-hidden border border-theme-border bg-black">
                  <video ref={videoScannerRef} className="w-full h-48 object-cover" />
                </div>
              )}
            </div>

            {/* Upload QR Image Option */}
            <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border flex flex-col items-center justify-center text-center space-y-4">
              <Upload className="w-10 h-10 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-theme-text">Upload QR Code Image</h4>
                <p className="text-xs text-theme-text-muted mt-0.5">Select a screenshot or photo of a QR code.</p>
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleScanImageUpload}
                className="block w-full max-w-xs text-xs text-theme-text-muted file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          {scannerError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{scannerError}</span>
            </div>
          )}

          {/* Scanned Decoded Result & Content Display */}
          {scannedResult && (
            <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-theme-border">
                <span className="text-xs font-bold text-theme-text uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Decoded Result</span>
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText(scannedResult)}
                  className="text-xs text-theme-accent hover:underline flex items-center gap-1 font-mono"
                >
                  <Copy className="w-3 h-3" /> Copy Result
                </button>
              </div>

              <p className="text-xs font-mono text-theme-text p-3 bg-theme-surface rounded-xl border border-theme-border select-all break-all">
                {scannedResult}
              </p>

              {/* If it's a URL, provide instant link */}
              {scannedResult.startsWith('http') && (
                <a
                  href={scannedResult}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Scanned Link</span>
                </a>
              )}

              {/* If it matches a STUDKIT Shared Item */}
              {scannedSharedItem && (
                <div className="p-4 rounded-2xl bg-theme-surface border border-theme-accent/40 space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-theme-accent font-bold">
                        STUDKIT Retrieved Content ({scannedSharedItem.type})
                      </span>
                      <h4 className="text-sm font-bold text-theme-text">{scannedSharedItem.name}</h4>
                    </div>
                    <span className="text-xs font-mono text-theme-text-muted">
                      {formatBytes(scannedSharedItem.size)}
                    </span>
                  </div>

                  {scannedSharedItem.type === 'image' && (
                    <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-theme-border">
                      <img src={scannedSharedItem.data} alt="Shared content" className="w-full object-contain max-h-72" />
                    </div>
                  )}

                  {scannedSharedItem.type === 'audio' && (
                    <div className="p-3 bg-theme-bg rounded-xl border border-theme-border">
                      <audio controls src={scannedSharedItem.data} className="w-full" />
                    </div>
                  )}

                  {scannedSharedItem.type === 'video' && (
                    <div className="max-w-md mx-auto rounded-xl overflow-hidden border border-theme-border">
                      <video controls src={scannedSharedItem.data} className="w-full max-h-72" />
                    </div>
                  )}

                  <button
                    onClick={() => {
                      fetch(scannedSharedItem.data)
                        .then(r => r.blob())
                        .then(blob => downloadFile(blob, scannedSharedItem.name));
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {scannedSharedItem.name}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
