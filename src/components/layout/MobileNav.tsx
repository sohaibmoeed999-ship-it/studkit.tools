import React from 'react';
import { Sparkles, Image, FileText, Calculator, Brain, Home, Briefcase, Code, Clock, Gamepad2 } from 'lucide-react';
import { ToolCategory } from '../../types';

interface MobileNavProps {
  currentCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  onHome: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentCategory, onSelectCategory, onHome }) => {
  const items: { label: string; cat: ToolCategory; icon: React.ReactNode }[] = [
    { label: 'All', cat: 'all', icon: <Home className="w-4 h-4" /> },
    { label: 'Docs', cat: 'pdf', icon: <FileText className="w-4 h-4" /> },
    { label: 'AI', cat: 'ai', icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Images', cat: 'image', icon: <Image className="w-4 h-4" /> },
    { label: 'Calcs', cat: 'calculators', icon: <Calculator className="w-4 h-4" /> },
    { label: 'Productivity', cat: 'productivity', icon: <Clock className="w-4 h-4" /> },
    { label: 'Career', cat: 'career', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Dev', cat: 'developer', icon: <Code className="w-4 h-4" /> },
    { label: 'Mind Lab', cat: 'mind', icon: <Brain className="w-4 h-4" /> },
    { label: 'Relax & Fun', cat: 'games', icon: <Gamepad2 className="w-4 h-4" /> },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-theme-bg/95 backdrop-blur-xl border-t border-theme-border py-1 px-1 safe-area-bottom shadow-2xl">
      <div className="flex items-center justify-between overflow-x-auto scrollbar-none px-1">
        {items.map((item, idx) => {
          const isActive = currentCategory === item.cat;
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.cat === 'all') onHome();
                else onSelectCategory(item.cat);
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all flex-shrink-0 active:scale-95 ${
                isActive ? 'text-theme-accent font-bold scale-105' : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-theme-accent/15 border border-theme-accent/30' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[9px] mt-0.5 tracking-tight whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
