import React from 'react';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { ToolItem } from '../../types';

interface ToolHeaderProps {
  tool: ToolItem;
  onBack: () => void;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ tool, onBack }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-theme-border animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-theme-text-muted hover:text-theme-text transition-all"
          title="Back to all tools"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-theme-text">{tool.name}</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-theme-accent/15 text-theme-accent border border-theme-accent/30 font-semibold">
              {tool.category}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-theme-text-muted mt-1">{tool.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('Tool link copied to clipboard!');
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-text-muted hover:text-theme-text transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};
