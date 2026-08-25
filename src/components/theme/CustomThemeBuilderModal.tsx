import React, { useState } from 'react';
import { THEME_SUGGESTIONS, generateTwoColorTheme } from '../../data/themePresets';
import { ThemeDefinition, TwoColorMixerConfig } from '../../types/theme';
import { Palette, Sparkles, Sliders, Check, Trash2, X, RefreshCw, Layers } from 'lucide-react';

interface CustomThemeBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTheme: (theme: ThemeDefinition) => void;
  customThemes: ThemeDefinition[];
  onDeleteCustomTheme: (id: string) => void;
}

export const CustomThemeBuilderModal: React.FC<CustomThemeBuilderModalProps> = ({
  isOpen,
  onClose,
  onApplyTheme,
  customThemes,
  onDeleteCustomTheme,
}) => {
  const [tab, setTab] = useState<'mixer' | 'studio' | 'inspiration' | 'saved'>('mixer');

  // Two-Color Mixer State
  const [color1, setColor1] = useState('#000000');
  const [color2, setColor2] = useState('#008cff');
  const [mixerBalance, setMixerBalance] = useState(50);
  const [mixerStyle, setMixerStyle] = useState<'balanced' | 'soft' | 'strong' | 'neon'>('neon');
  const [themeName, setThemeName] = useState('My Custom Theme');

  // Full Studio State
  const [studioColors, setStudioColors] = useState({
    bgPrimary: '#060913',
    bgSurface: '#0c1222',
    bgSurfaceHover: '#141f38',
    bgCard: '#0f172a',
    borderColor: '#1e293b',
    borderGlow: 'rgba(56, 189, 248, 0.25)',
    accentPrimary: '#0284c7',
    accentGlow: 'rgba(14, 165, 233, 0.4)',
    accentHover: '#0369a1',
    textPrimary: '#f8fafc',
    textMuted: '#94a3b8',
  });

  if (!isOpen) return null;

  const handleApplyMixer = () => {
    const config: TwoColorMixerConfig = {
      color1,
      color2,
      balance: mixerBalance,
      style: mixerStyle,
    };
    const theme = generateTwoColorTheme(config, themeName || `Theme (${color1} + ${color2})`);
    onApplyTheme(theme);
    onClose();
  };

  const handleApplyStudio = () => {
    const theme: ThemeDefinition = {
      id: 'custom_' + Math.random().toString(36).substring(2, 9),
      name: themeName || 'Studio Custom',
      category: 'custom',
      isCustom: true,
      colors: studioColors,
    };
    onApplyTheme(theme);
    onClose();
  };

  const handlePickSuggestion = (s: { color1: string; color2: string; name: string }) => {
    setColor1(s.color1);
    setColor2(s.color2);
    setThemeName(s.name);
    setTab('mixer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-theme-surface border border-theme-border rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-theme-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-theme-text">Custom Theme Builder</h3>
              <p className="text-xs text-theme-text-muted">Design, mix, and preview custom color palettes.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text-muted hover:text-theme-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-theme-border bg-theme-bg/60 p-1.5 gap-1">
          <button
            onClick={() => setTab('mixer')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'mixer' ? 'bg-theme-accent text-white shadow-sm' : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            Two-Color Theme Mixer
          </button>
          <button
            onClick={() => setTab('inspiration')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'inspiration' ? 'bg-theme-accent text-white shadow-sm' : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            Theme Inspiration (20+)
          </button>
          <button
            onClick={() => setTab('studio')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'studio' ? 'bg-theme-accent text-white shadow-sm' : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            Studio Full Tuner
          </button>
          <button
            onClick={() => setTab('saved')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'saved' ? 'bg-theme-accent text-white shadow-sm' : 'text-theme-text-muted hover:text-theme-text'
            }`}
          >
            Saved ({customThemes.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {tab === 'mixer' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Color 1: Background Base */}
                <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-theme-text uppercase tracking-wider">Color 1: Base & Canvas</span>
                    <span className="text-xs font-mono text-theme-text-muted">{color1}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color1}
                      onChange={e => setColor1(e.target.value)}
                      className="w-14 h-14 rounded-2xl cursor-pointer border border-theme-border"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {['#000000', '#060913', '#09090b', '#080103', '#ffffff', '#020704'].map(c => (
                        <button
                          key={c}
                          onClick={() => setColor1(c)}
                          className="w-6 h-6 rounded-lg border border-theme-border"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color 2: Accent & Energy */}
                <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-theme-text uppercase tracking-wider">Color 2: Accent Glow</span>
                    <span className="text-xs font-mono text-theme-text-muted">{color2}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={color2}
                      onChange={e => setColor2(e.target.value)}
                      className="w-14 h-14 rounded-2xl cursor-pointer border border-theme-border"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {['#008cff', '#10b981', '#e11d48', '#a855f7', '#eab308', '#06b6d4', '#ec4899', '#f97316'].map(c => (
                        <button
                          key={c}
                          onClick={() => setColor2(c)}
                          className="w-6 h-6 rounded-lg border border-theme-border"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Style & Intensity presets */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-theme-text-muted">Mixing Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['balanced', 'soft', 'strong', 'neon'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => setMixerStyle(st)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                        mixerStyle === st
                          ? 'bg-theme-accent text-white border-theme-accent shadow-md shadow-theme-accent/20'
                          : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Card */}
              <div
                className="p-6 rounded-2xl border transition-all space-y-3 shadow-xl"
                style={{
                  backgroundColor: color1 === '#000000' || color1 === '#ffffff' ? (color1 === '#ffffff' ? '#ffffff' : '#080c14') : color1,
                  borderColor: color1 === '#ffffff' ? '#e4e4e7' : '#1e293b',
                  boxShadow: `0 10px 30px -5px ${color2}33`,
                }}
              >
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold" style={{ color: color2 }}>
                  Live Studio Preview
                </span>
                <h4 className="text-base font-bold" style={{ color: color1 === '#ffffff' ? '#09090b' : '#ffffff' }}>
                  STUDKIT — Everything Students Need
                </h4>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg"
                    style={{ backgroundColor: color2 }}
                  >
                    Accent Button
                  </button>
                  <span className="text-xs font-mono" style={{ color: color1 === '#ffffff' ? '#71717a' : '#94a3b8' }}>
                    Card borders & buttons will adapt to {color2}.
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-theme-text-muted font-semibold">Theme Name</label>
                <input
                  type="text"
                  value={themeName}
                  onChange={e => setThemeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-bold"
                />
              </div>

              <button
                onClick={handleApplyMixer}
                className="w-full py-3.5 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Save & Apply Theme</span>
              </button>
            </div>
          )}

          {tab === 'inspiration' && (
            <div className="space-y-4">
              <div className="text-xs text-theme-text-muted">
                Click any professionally balanced pairing to instantly load and mix:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {THEME_SUGGESTIONS.map(s => (
                  <button
                    key={s.name}
                    onClick={() => handlePickSuggestion(s)}
                    className="p-3.5 rounded-2xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-left transition-all flex items-center gap-3 group active:scale-95"
                  >
                    <div className="flex items-center -space-x-2 flex-shrink-0">
                      <div className="w-7 h-7 rounded-full border border-theme-border" style={{ backgroundColor: s.color1 }} />
                      <div className="w-7 h-7 rounded-full border border-theme-border" style={{ backgroundColor: s.color2 }} />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-theme-text group-hover:text-theme-accent truncate">{s.name}</div>
                      <div className="text-[10px] text-theme-text-muted truncate">{s.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === 'studio' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {Object.entries(studioColors).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-theme-bg border border-theme-border space-y-1.5">
                    <label className="text-[10px] text-theme-text-muted uppercase font-mono block truncate">
                      {key}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={val.startsWith('#') ? val : '#0284c7'}
                        onChange={e => setStudioColors({ ...studioColors, [key]: e.target.value })}
                        className="w-7 h-7 rounded-lg cursor-pointer border border-theme-border flex-shrink-0"
                      />
                      <input
                        type="text"
                        value={val}
                        onChange={e => setStudioColors({ ...studioColors, [key]: e.target.value })}
                        className="w-full bg-transparent font-mono text-[11px] text-theme-text outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleApplyStudio}
                className="w-full py-3.5 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Apply Studio Palette</span>
              </button>
            </div>
          )}

          {tab === 'saved' && (
            <div className="space-y-3">
              {customThemes.length === 0 ? (
                <div className="py-12 text-center text-xs text-theme-text-muted">
                  No custom themes created yet. Use the Two-Color Mixer to generate one!
                </div>
              ) : (
                customThemes.map(th => (
                  <div
                    key={th.id}
                    className="p-3.5 rounded-2xl bg-theme-bg border border-theme-border flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center -space-x-2">
                        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: th.colors.bgPrimary }} />
                        <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: th.colors.accentPrimary }} />
                      </div>
                      <span className="text-xs font-bold text-theme-text">{th.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onApplyTheme(th);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-theme-accent text-white text-xs font-bold"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => onDeleteCustomTheme(th.id)}
                        className="p-1.5 rounded-xl bg-theme-surface hover:bg-rose-500/20 text-rose-400 border border-theme-border"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
