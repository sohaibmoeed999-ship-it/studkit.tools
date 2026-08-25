import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, FastForward, Sparkles, Box, Zap, Crown } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
  isReplay?: boolean;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete, isReplay = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Intro Stages:
  // 'walking': Video playing walking animation
  // 'impact': Character throws/drops box -> impact & "Made by Sohaib Shahid" on closed covering
  // 'opening': Box opens with radiant neon light
  // 'logo_emerge': Logo rises from inside the box
  // 'logo_zoom': Logo expands and zooms into camera to fill viewport
  // 'complete': Seamless reveal of main website
  const [stage, setStage] = useState<'walking' | 'impact' | 'opening' | 'logo_emerge' | 'logo_zoom' | 'complete'>('walking');

  useEffect(() => {
    // Accessibility check: Skip animation if reduced motion preferred
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // Start cleanly from walking motion
    const handleLoadedMetadata = () => {
      setIsVideoLoaded(true);
      if (video.currentTime < 0.5) {
        video.currentTime = 0.5;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.currentTime = 0.5;
    video.muted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Autoplay handled:', err);
        triggerImpactAndEmergence();
      });
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [isReplay]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const current = video.currentTime;
    const dur = video.duration;
    setProgress((current / dur) * 100);

    // As soon as the character throws/drops the box (~last 1.6 seconds), trigger the impact & logo sequence
    if (dur - current <= 1.6 && stage === 'walking') {
      triggerImpactAndEmergence();
    }
  };

  const triggerImpactAndEmergence = () => {
    if (stage !== 'walking') return;

    // Stage 1: Impact, Landing Shake & "Made by Sohaib Shahid" displayed on the closed box covering
    setStage('impact');

    // Stage 2: Box Opens dramatically after showing the inscription (after 700ms)
    setTimeout(() => {
      setStage('opening');

      // Stage 3: Study Kit Logo & "Made by Sohaib Shahid" Emerges in Center of Screen
      setTimeout(() => {
        setStage('logo_emerge');

        // Stage 4: Logo Zooms Forward into Camera to Fill Viewport (after 1200ms for clear viewing)
        setTimeout(() => {
          setStage('logo_zoom');

          // Stage 5: Smooth Transition into Website (after 500ms)
          setTimeout(() => {
            setStage('complete');
            setTimeout(onComplete, 350);
          }, 500);
        }, 1200);
      }, 450);
    }, 700);
  };

  const handleSkip = () => {
    setStage('logo_zoom');
    setTimeout(() => {
      setStage('complete');
      setTimeout(onComplete, 150);
    }, 200);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none transition-all duration-500 ease-out ${
        stage === 'complete' ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Original Walking Video Playback Layer */}
      <video
        ref={videoRef}
        src="/assets/studkit-intro.mp4"
        className={`w-full h-full object-cover md:object-contain bg-black transition-all duration-400 ${
          stage === 'impact' ? 'filter brightness-110 scale-[1.02]' : stage !== 'walking' ? 'filter brightness-80 blur-xs scale-105' : 'scale-100'
        }`}
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={triggerImpactAndEmergence}
        onError={triggerImpactAndEmergence}
      />

      {/* 2. Impact, Shake & Closed Box Inscription: "Made by Sohaib Shahid" */}
      {(stage === 'impact' || stage === 'opening') && (
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center animate-fade-in z-20">
          {/* Radial Light & Energy Shockwave */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/40 via-blue-600/25 to-purple-600/40 backdrop-blur-[2px] animate-pulse" />

          {/* Core Impact Glow Shockwave */}
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-65 blur-3xl animate-ping" />

          {/* Dust & Light Particle Specks */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8]"
                style={{
                  transform: `rotate(${i * 18}deg) translate(${110 + (i % 5) * 35}px)`,
                  opacity: 0.9,
                  filter: 'blur(0.5px)',
                }}
              />
            ))}
          </div>

          {/* Closed Box Cover with Glowing Inscription: "Made by Sohaib Shahid" */}
          <div
            className={`relative flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-[#1e293b]/95 via-[#0f172a]/95 to-[#090d16]/95 border-2 border-cyan-400/80 shadow-[0_0_50px_rgba(6,182,212,0.7)] backdrop-blur-xl max-w-sm mx-4 transition-all duration-500 transform ${
              stage === 'impact' ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 -translate-y-6'
            }`}
          >
            {/* Crown / Creator Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-mono font-bold tracking-widest uppercase mb-2 shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-pulse">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>STUDKIT CREATOR</span>
            </div>

            {/* Glowing Inscription */}
            <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 text-center tracking-wide drop-shadow-[0_0_20px_rgba(56,189,248,0.9)]">
              Made by Sohaib Shahid
            </h2>

            <div className="flex items-center gap-2 mt-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-cyan-400 rounded-full" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                Opening Toolbox...
              </span>
              <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-cyan-400 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Opening Box & Logo Emergence Sequence */}
      {(stage === 'opening' || stage === 'logo_emerge' || stage === 'logo_zoom') && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          {/* Ambient Glow Aura */}
          <div
            className={`absolute w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 blur-3xl opacity-75 transition-all duration-500 ${
              stage === 'logo_zoom' ? 'scale-[2.5] opacity-100' : 'scale-100'
            }`}
          />

          {/* Emerged Study Kit Logo Container */}
          <div
            className={`relative flex flex-col items-center justify-center space-y-4 transition-all duration-600 ease-out transform ${
              stage === 'opening'
                ? 'scale-25 opacity-0 translate-y-20'
                : stage === 'logo_emerge'
                ? 'scale-100 opacity-100 translate-y-0 animate-bounce'
                : 'scale-[4.8] opacity-0 blur-md -translate-y-8'
            }`}
          >
            {/* Logo Frame with Neon Aura */}
            <div className="relative group">
              <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-3xl blur-2xl opacity-90 animate-pulse" />
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden p-1.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-indigo-600 border-2 border-white/90 shadow-[0_0_60px_rgba(6,182,212,0.95)]">
                <img
                  src="/assets/studkit-logo.png"
                  alt="STUDKIT Official Emergence"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>

            {/* Branded Typography & Creator Reveal in Center of Screen */}
            <div className="text-center space-y-2 drop-shadow-[0_0_25px_rgba(56,189,248,0.9)] flex flex-col items-center">
              <h1 className="text-2xl sm:text-4xl font-black font-mono tracking-widest text-white">
                STUD<span className="text-cyan-400">KIT</span>
              </h1>
              <p className="text-[11px] sm:text-xs font-mono tracking-widest text-cyan-300/90 uppercase font-semibold">
                The Digital Student Toolbox
              </p>

              {/* Exact Inscription Directly Underneath STUDKIT Logo on Splash Screen */}
              <div className="pt-2 animate-fade-in flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-semibold tracking-wider text-cyan-200/90 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]">
                  Made by Sohaib Shahid
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Top Floating Controls (Mute & Skip) */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-black/65 hover:bg-black/85 text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all shadow-xl active:scale-95 cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/65 hover:bg-black/85 text-white/90 hover:text-white border border-white/15 backdrop-blur-md text-xs font-bold tracking-wide transition-all shadow-xl hover:border-cyan-400/50 active:scale-95 cursor-pointer"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>

      {/* 5. Bottom Brand Status & Progress Bar */}
      <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col gap-2.5 pointer-events-none max-w-xl mx-auto">
        <div className="flex items-center justify-between text-[11px] text-white/80 font-mono tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg overflow-hidden border border-cyan-400/40">
              <img src="/assets/studkit-logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span>STUDKIT OS • Student Toolkit</span>
          </div>
          <span className="text-cyan-400 font-bold">100% Free</span>
        </div>
        <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-150 ease-linear rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
