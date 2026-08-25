import React, { useState } from 'react';
import { Palette, Check, Plus, Sparkles, ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { CustomThemeBuilderModal } from '../theme/CustomThemeBuilderModal';
import { ThemeDefinition } from '../../types/theme';

export const ThemeSelector: React.FC = () => {
  const {
    activeThemeId,
    setActiveThemeId,
    currentTheme,
    allThemes,
    customThemes,
    saveCustomTheme,
    deleteCustomTheme,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const categories = [
    { id: 'dark', label: 'Dark Presets' },
    { id: 'neon', label: 'Neon & Cyber' },
    { id: 'light', label: 'Light Modes' },
    { id: 'minimal', label: 'Minimalist' },
    { id: 'custom', label: 'Custom User Themes' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs font-semibold text-theme-text transition-all shadow-sm active:scale-95"
        title="Theme Palette Studio"
      >
        <div
          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
          style={{ backgroundColor: currentTheme.colors.accentPrimary }}
        />
        <span className="hidden sm:inline max-w-[100px] truncate">{currentTheme.name}</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto rounded-3xl bg-theme-card border border-theme-border shadow-2xl p-3 z-50 space-y-3 animate-quick-fade">
            {/* Create Custom Theme Trigger */}
            <button
              onClick={() => {
                setIsOpen(false);
                setIsCustomModalOpen(true);
              }}
              className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-theme-accent via-cyan-500 to-blue-600 hover:from-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/25 flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Theme / Mixer</span>
            </button>

            {/* Presets List Grouped by Category */}
            {categories.map(cat => {
              const items = allThemes.filter(t => t.category === cat.id);
              if (items.length === 0) return null;

              return (
                <div key={cat.id} className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-theme-text-muted px-2 block">
                    {cat.label} ({items.length})
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {items.map(t => {
                      const isSelected = activeThemeId === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setActiveThemeId(t.id);
                            setIsOpen(false);
                          }}
                          className={`w-full p-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-theme-accent/15 border border-theme-accent/40 text-theme-accent font-bold'
                              : 'hover:bg-theme-surface text-theme-text'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="flex items-center -space-x-1 flex-shrink-0">
                              <div
                                className="w-3.5 h-3.5 rounded-full border border-theme-border"
                                style={{ backgroundColor: t.colors.bgPrimary }}
                              />
                              <div
                                className="w-3.5 h-3.5 rounded-full border border-theme-border"
                                style={{ backgroundColor: t.colors.accentPrimary }}
                              />
                            </div>
                            <span className="truncate text-xs">{t.name}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-theme-accent flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Custom Theme Builder Modal */}
      <CustomThemeBuilderModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onApplyTheme={(th: ThemeDefinition) => {
          saveCustomTheme(th);
        }}
        customThemes={customThemes}
        onDeleteCustomTheme={deleteCustomTheme}
      />
    </div>
  );
};
