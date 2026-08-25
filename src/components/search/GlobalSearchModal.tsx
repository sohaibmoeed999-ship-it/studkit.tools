import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Zap,
  BookOpen,
  Calculator,
  Gamepad2,
  Brain,
  CheckCircle2,
} from 'lucide-react';
import { performSemanticSearch, SearchResultItem } from '../../utils/searchEngine';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

const SEARCH_TABS = ['All', 'Tools', 'Subjects', 'AI Tools', 'Calculators', 'Games'];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const searchResults = performSemanticSearch(query, activeTab);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        onSelectTool(searchResults[selectedIndex].toolIdToOpen);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-fade-in select-none">
      <div
        className="w-full max-w-2xl bg-theme-card border border-theme-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-theme-border bg-theme-surface/70">
          <Search className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search anything... (e.g., 'photosynthesis', 'calculate BMI', 'Newton law', 'solve equation')"
            className="w-full bg-transparent text-sm text-theme-text placeholder:text-theme-text-muted outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-theme-text-muted hover:text-theme-text mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-theme-bg hover:bg-theme-surface border border-theme-border text-theme-text-muted hover:text-theme-text"
          >
            <span className="text-[10px] font-mono font-bold">ESC</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-theme-bg/60 border-b border-theme-border/60 overflow-x-auto scrollbar-none">
          {SEARCH_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-theme-accent text-white shadow-sm'
                  : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-surface'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
          {searchResults.length > 0 ? (
            searchResults.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectTool(item.toolIdToOpen);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-theme-surface border-theme-accent shadow-md shadow-theme-accent/15 scale-[1.01]'
                      : 'bg-transparent border-transparent hover:bg-theme-surface/50 text-theme-text'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent flex-shrink-0">
                      {item.category === 'Calculators' ? (
                        <Calculator className="w-4 h-4" />
                      ) : item.category === 'Subjects' ? (
                        <BookOpen className="w-4 h-4" />
                      ) : item.category === 'Games' ? (
                        <Gamepad2 className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-theme-text truncate">{item.title}</h4>
                        {item.badge && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                            {item.badge}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-theme-text-muted hidden sm:inline">
                          • {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-theme-text-muted truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 text-theme-accent flex-shrink-0 transition-transform ${
                      isSelected ? 'translate-x-1' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-theme-text">No Exact Keyword Match</h4>
              <p className="text-xs text-theme-text-muted max-w-sm mx-auto">
                Would you like our Universal AI Studio to answer "{query}" or generate study notes?
              </p>
              <button
                onClick={() => {
                  onSelectTool('universal-ai-studio');
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 inline-flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Studio About "{query}"</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-theme-surface/50 border-t border-theme-border flex items-center justify-between text-[11px] font-mono text-theme-text-muted">
          <span>Semantic Intent AI Search</span>
          <span className="hidden sm:inline">Use ↑ ↓ to navigate • ↵ to select</span>
        </div>
      </div>
    </div>
  );
};
