import React, { useEffect, useState } from 'react';

export const FuturisticCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsMobile(true);
      return;
    }
    setIsMobile(false);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Expose mouse variables on root for dynamic card spotlights
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);

      // Check if hovering interactive target
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('.tool-card') ||
        target?.closest('input') ||
        target?.closest('select') ||
        target?.closest('.interactive')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth lerp for trailing aura
    let animId: number;
    const lerpTrailing = () => {
      setTrailingPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.2,
        y: prev.y + (pos.y - prev.y) * 0.2,
      }));
      animId = requestAnimationFrame(lerpTrailing);
    };
    animId = requestAnimationFrame(lerpTrailing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [pos.x, pos.y]);

  if (isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 select-none overflow-hidden">
      {/* Central Cursor Point */}
      <div
        className="fixed w-2 h-2 rounded-full bg-cyan-400 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#22d3ee] transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: `translate(-50%, -50%) scale(${isClicked ? 0.7 : isHovered ? 1.5 : 1})`,
        }}
      />

      {/* Trailing Outer Glow Ring */}
      <div
        className={`fixed rounded-full border border-cyan-400/40 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
          isHovered
            ? 'w-10 h-10 bg-cyan-400/10 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.35)] scale-110'
            : 'w-6 h-6 shadow-[0_0_8px_rgba(34,211,238,0.15)]'
        }`}
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
        }}
      />
    </div>
  );
};
