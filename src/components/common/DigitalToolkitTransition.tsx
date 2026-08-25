import React, { useEffect, useState } from 'react';
import { Box, Sparkles, Binary, FileText, Cpu, Image, Calculator, CheckSquare, Briefcase, Code, Brain, Gamepad2 } from 'lucide-react';

interface DigitalToolkitTransitionProps {
  category: string;
  categoryName: string;
  count: number;
  onFinished?: () => void;
}

const CATEGORY_ICONS: Record<string, any> = {
  all: Box,
  pdf: FileText,
  ai: Cpu,
  image: Image,
  calculators: Calculator,
  productivity: CheckSquare,
  career: Briefcase,
  developer: Code,
  mind: Brain,
  games: Gamepad2,
};

export const DigitalToolkitTransition: React.FC<DigitalToolkitTransitionProps> = ({
  category,
  categoryName,
  count,
  onFinished,
}) => {
  const [stage, setStage] = useState<'emerge' | 'open' | 'burst'>('emerge');
  const IconComponent = CATEGORY_ICONS[category] || Box;

  useEffect(() => {
    const t1 = setTimeout(() => setStage('open'), 200);
    const t2 = setTimeout(() => setStage('burst'), 550);
    const t3 = setTimeout(() => onFinished && onFinished(), 750);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [category, onFinished]);

  return (
    <div className="w-full py-6 flex flex-col items-center justify-center select-none overflow-hidden animate-fade-in">
      {/* 3D Holographic Toolkit Container */}
      <div className="relative flex flex-col items-center">
        <div
          className={`w-20 h-20 rounded-3xl bg-gradient-to-tr from-theme-accent via-cyan-400 to-indigo-600 p-0.5 shadow-2xl shadow-theme-accent/40 transition-all duration-500 transform ${
            stage === 'emerge'
              ? 'scale-75 -rotate-12 opacity-80'
              : stage === 'open'
              ? 'scale-110 rotate-6 shadow-[0_0_40px_var(--accent-glow)]'
              : 'scale-100 rotate-0'
          }`}
        >
          <div className="w-full h-full bg-[#080d1a] rounded-[22px] flex items-center justify-center text-cyan-400 relative overflow-hidden">
            <IconComponent className={`w-10 h-10 transition-transform duration-300 ${stage === 'open' ? 'scale-125 animate-pulse text-amber-400' : ''}`} />
            
            {/* Inner Light Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmerSweep_1s_infinite]" />
          </div>
        </div>

        {/* Category Hologram Title */}
        <div className="text-center mt-3 space-y-0.5">
          <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase block">
            Digital Toolkit Initialized
          </span>
          <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-mono flex items-center justify-center gap-2">
            <span>{categoryName.toUpperCase()}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              {count} Ready
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
};
