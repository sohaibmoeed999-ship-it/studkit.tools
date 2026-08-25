import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, Camera, CheckCircle2, Download, FileVideo, Film, Gauge, Pause, Play, RefreshCw, RotateCcw, Scissors, Sparkles, Video, Volume2, VolumeX, Wand2, Zap } from 'lucide-react';
import { downloadFile, downloadBlob, formatBytes } from '../../../utils/download';
import { FileUploader } from '../../common/FileUploader';

export const VideoCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Compression Quality Presets
  const [preset, setPreset] = useState<'high' | 'balanced' | 'small' | 'extreme' | 'custom'>('balanced');
  const [targetResolution, setTargetResolution] = useState<number>(720); // 1080, 720, 480, 360
  const [bitrateMultiplier, setBitrateMultiplier] = useState<number>(0.6); // 0.25 to 0.9

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.type.startsWith('video/')) {
        setError('Please select a valid video file (MP4, WebM, MOV, etc.)');
        return;
      }
      if (selected.size > 1024 * 1024 * 1024) {
        setError('Video is too large. Maximum supported video size is 1 GB.');
        return;
      }
      setError(null);
      setFile(selected);
      setCompressedBlob(null);
      setCompressedSize(null);
      setProgress(0);

      const url = URL.createObjectURL(selected);
      setVideoSrc(url);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      setVideoDimensions({
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
    }
  };

  // Client-Side Canvas Video Re-encoding Compression
  const handleCompress = async () => {
    if (!videoRef.current || !file) return;

    try {
      setIsProcessing(true);
      setProgress(5);
      setError(null);

      const video = videoRef.current;
      video.currentTime = 0;

      // Determine target resolution scale
      let scale = 1;
      let targetHeight = 720;
      let qualityBitrate = 1500000;

      if (preset === 'high') {
        targetHeight = Math.min(video.videoHeight, 1080);
        qualityBitrate = 2500000;
      } else if (preset === 'balanced') {
        targetHeight = Math.min(video.videoHeight, 720);
        qualityBitrate = 1200000;
      } else if (preset === 'small') {
        targetHeight = Math.min(video.videoHeight, 480);
        qualityBitrate = 600000;
      } else if (preset === 'extreme') {
        targetHeight = Math.min(video.videoHeight, 360);
        qualityBitrate = 300000;
      } else {
        targetHeight = targetResolution;
        qualityBitrate = Math.round(bitrateMultiplier * 2000000);
      }

      scale = targetHeight / (video.videoHeight || 720);
      if (scale > 1) scale = 1;

      const targetWidth = Math.round((video.videoWidth * scale) / 2) * 2;
      targetHeight = Math.round(targetHeight / 2) * 2;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Canvas context not available');

      // Setup MediaRecorder for WebM/MP4 capture
      const stream = canvas.captureStream(24); // 24 FPS standard
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(stream, {

        videoBitsPerSecond: qualityBitrate,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const resultBlob = new Blob(chunks, { type: mimeType });
        setCompressedBlob(resultBlob);
        setCompressedSize(resultBlob.size);
        setIsProcessing(false);
        setProgress(100);
        video.pause();
      };

      recorder.start(100);

      // Play video through canvas
      await video.play();

      const duration = video.duration || 10;
      const interval = setInterval(() => {
        if (video.paused || video.ended || video.currentTime >= duration) {
          clearInterval(interval);
          if (recorder.state === 'recording') {
            recorder.stop();
          }
          return;
        }

        ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
        const percent = Math.min(95, Math.round((video.currentTime / duration) * 95));
        setProgress(percent);
      }, 1000 / 24);

    } catch (err: any) {
      console.error(err);
      setError('Video compression encountered an issue. Try selecting a lower resolution preset.');
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    downloadBlob(compressedBlob, `${baseName}_Compressed.webm`);
  };

  const estimatedReductionPercent =
    file && compressedSize
      ? Math.round(((file.size - compressedSize) / file.size) * 100)
      : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Upload & Drop Card */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-theme-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-theme-text flex items-center gap-2">
                <span>Video Compressor & Bitrate Reducer</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Up to 1 GB Support
                </span>
              </h2>
              <p className="text-xs text-theme-text-muted">
                Downscale resolution and bitrates for lecture videos, presentation recordings, and lab demos.
              </p>
            </div>
          </div>

          {file && (
            <button
              onClick={() => {
                setFile(null);
                setVideoSrc(null);
                setCompressedBlob(null);
              }}
              className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Change Video</span>
            </button>
          )}
        </div>

        {/* Drop Zone */}
        {!file ? (
          <label className="border-2 border-dashed border-theme-border hover:border-theme-accent rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-theme-bg/50 group">
            <FileVideo className="w-12 h-12 text-theme-accent mb-3 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold text-theme-text">Click or Drag & Drop Video File</span>
            <span className="text-xs text-theme-text-muted mt-1 max-w-sm">
              Supports MP4, WebM, MOV, and MKV video formats up to 1 GB.
            </span>
            <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
          </label>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Video Player Preview */}
            <div className="md:col-span-6 space-y-3">
              <div className="rounded-2xl overflow-hidden bg-black border border-theme-border aspect-video flex items-center justify-center relative shadow-inner">
                {videoSrc && (
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    onLoadedMetadata={handleLoadedMetadata}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-theme-text-muted block">ORIGINAL SIZE</span>
                  <span className="font-bold text-theme-text">{formatBytes(file.size)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-theme-text-muted block">RESOLUTION</span>
                  <span className="font-bold text-theme-text">
                    {videoDimensions.width}x{videoDimensions.height}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-theme-text-muted block">DURATION</span>
                  <span className="font-bold text-theme-text">{Math.round(videoDuration)}s</span>
                </div>
              </div>
            </div>

            {/* Compression Settings Deck */}
            <div className="md:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-theme-text block">
                Compression Level Preset
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { id: 'high', label: '1080p High Quality', desc: 'Minimal compression' },
                  { id: 'balanced', label: '720p Balanced', desc: 'Recommended standard' },
                  { id: 'small', label: '480p Email/Web', desc: 'Fast web upload' },
                  { id: 'extreme', label: '360p Ultra Small', desc: 'Maximum space saving' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      preset === p.id
                        ? 'bg-theme-accent text-white border-theme-accent shadow-md shadow-theme-accent/20'
                        : 'bg-theme-bg border-theme-border text-theme-text hover:bg-theme-surface'
                    }`}
                  >
                    <div className="text-xs">{p.label}</div>
                    <div className={`text-[10px] mt-0.5 font-normal ${preset === p.id ? 'text-white/80' : 'text-theme-text-muted'}`}>
                      {p.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Progress Bar */}
              {isProcessing && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-theme-accent flex items-center gap-1.5 font-bold">
                      <Zap className="w-3.5 h-3.5 animate-bounce" /> Re-encoding video stream...
                    </span>
                    <span className="text-theme-text font-bold">{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-theme-bg border border-theme-border overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-theme-accent to-emerald-400 transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Button */}
              {!compressedBlob ? (
                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-xl shadow-theme-accent/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isProcessing ? 'Compressing Video...' : 'Start Video Compression'}</span>
                </button>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">
                      Compression Complete!
                    </span>
                    <div className="text-xl font-black text-theme-text">
                      {formatBytes(compressedSize || 0)}{' '}
                      <span className="text-xs text-emerald-400 font-bold font-mono">
                        ({estimatedReductionPercent}% smaller)
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Compressed Video</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
















export const VideoEditor: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [extractedFrame, setExtractedFrame] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (files: File[]) => {
    if (files[0]) {
      const f = files[0];
      // Strict 1 GB file size limit verification
      if (f.size > 1024 * 1024 * 1024) {
        setErrorMessage('Video is too large. Maximum supported video size is 1 GB.');
        setVideoFile(null);
        setVideoUrl(null);
        return;
      }

      setErrorMessage(null);
      setVideoFile(f);
      const url = URL.createObjectURL(f);
      setVideoUrl(url);
      setExtractedFrame(null);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setTrimStart(0);
      setTrimEnd(dur);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.currentTime >= trimEnd && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime >= trimEnd) {
        videoRef.current.currentTime = trimStart;
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const extractCurrentFrame = () => {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setExtractedFrame(dataUrl);
    }
  };

  const downloadFrame = () => {
    if (!extractedFrame) return;
    const a = document.createElement('a');
    a.href = extractedFrame;
    a.download = `STUDKIT_Frame_${Math.floor(currentTime)}s.png`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Lightweight Video Studio & Frame Snapper</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Up to 1 GB
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">Trim lecture clips, adjust playback speed, mute audio, and capture high-res frame snapshots.</p>
          </div>
        </div>
      </div>

      {!videoUrl ? (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-8 shadow-xl space-y-4">
          <FileUploader
            accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
            onFilesSelected={handleFileUpload}
            title="Upload lecture or presentation video (up to 500 MB)"
            subtitle="Client-side processing — your files never leave your browser"
          />

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-5 animate-fade-in">
          {/* Video Player */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-2xl">
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              className="max-h-full max-w-full"
            />
          </div>

          {/* Timeline & Controls Bar */}
          <div className="space-y-4 bg-theme-bg p-4 rounded-2xl border border-theme-border">
            <div className="flex items-center justify-between text-xs font-mono text-theme-text-muted">
              <span>{currentTime.toFixed(1)}s</span>
              <span>Trim Window: {trimStart.toFixed(1)}s – {trimEnd.toFixed(1)}s</span>
              <span>{duration.toFixed(1)}s</span>
            </div>

            {/* Scrubber */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={e => {
                const t = parseFloat(e.target.value);
                setCurrentTime(t);
                if (videoRef.current) videoRef.current.currentTime = t;
              }}
              className="w-full accent-theme-accent cursor-pointer"
            />

            {/* Button Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <button
                  onClick={toggleMute}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                    isMuted
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-theme-surface border-theme-border text-theme-text hover:bg-theme-surface-hover'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-1 bg-theme-surface border border-theme-border p-1 rounded-xl">
                  {[0.5, 1, 1.5, 2].map(sp => (
                    <button
                      key={sp}
                      onClick={() => handleSpeedChange(sp)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                        playbackSpeed === sp
                          ? 'bg-theme-accent text-white'
                          : 'text-theme-text-muted hover:text-theme-text'
                      }`}
                    >
                      {sp}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={extractCurrentFrame}
                  className="px-3.5 py-2 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs font-bold text-theme-text flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Camera className="w-4 h-4 text-cyan-400" />
                  <span>Snapshot Frame</span>
                </button>

                <button
                  onClick={() => {
                    setVideoFile(null);
                    setVideoUrl(null);
                  }}
                  className="p-2 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-text-muted hover:text-theme-text"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Frame Snapshot Preview Box */}
          {extractedFrame && (
            <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-3 animate-fade-in">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-theme-accent flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Captured High-Res Frame Snapshot
                </span>
                <button
                  onClick={downloadFrame}
                  className="px-3 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center gap-1 shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>
              </div>
              <img src={extractedFrame} alt="Frame" className="rounded-xl border border-theme-border max-h-56 mx-auto object-contain shadow-md" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
