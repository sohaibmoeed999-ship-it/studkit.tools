import { useState, useEffect } from 'react';
import { THEME_PRESETS, generateTwoColorTheme } from '../data/themePresets';
import { ThemeDefinition, TwoColorMixerConfig } from '../types/theme';

export function useTheme() {
  const [customThemes, setCustomThemes] = useState<ThemeDefinition[]>(() => {
    try {
      const saved = localStorage.getItem('studkit_custom_themes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem('studkit_theme') || 'midnight';
  });

  const allThemes: ThemeDefinition[] = [...THEME_PRESETS, ...customThemes];
  const currentTheme = allThemes.find(t => t.id === activeThemeId) || THEME_PRESETS[0];

  useEffect(() => {
    const root = document.documentElement;
    const colors = currentTheme.colors;

    // Apply CSS custom properties dynamically
    root.style.setProperty('--bg-primary', colors.bgPrimary);
    root.style.setProperty('--bg-surface', colors.bgSurface);
    root.style.setProperty('--bg-surface-hover', colors.bgSurfaceHover);
    root.style.setProperty('--bg-card', colors.bgCard);
    root.style.setProperty('--border-color', colors.borderColor);
    root.style.setProperty('--border-glow', colors.borderGlow);
    root.style.setProperty('--accent-primary', colors.accentPrimary);
    root.style.setProperty('--accent-glow', colors.accentGlow);
    root.style.setProperty('--accent-hover', colors.accentHover);
    root.style.setProperty('--text-primary', colors.textPrimary);
    root.style.setProperty('--text-muted', colors.textMuted);

    root.setAttribute('data-theme', currentTheme.id);

    if (currentTheme.category === 'light' || currentTheme.category === 'minimal') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }

    localStorage.setItem('studkit_theme', activeThemeId);
  }, [activeThemeId, currentTheme]);

  const saveCustomTheme = (themeDef: ThemeDefinition) => {
    const updated = [themeDef, ...customThemes.filter(t => t.id !== themeDef.id)];
    setCustomThemes(updated);
    localStorage.setItem('studkit_custom_themes', JSON.stringify(updated));
    setActiveThemeId(themeDef.id);
  };

  const deleteCustomTheme = (id: string) => {
    const updated = customThemes.filter(t => t.id !== id);
    setCustomThemes(updated);
    localStorage.setItem('studkit_custom_themes', JSON.stringify(updated));
    if (activeThemeId === id) {
      setActiveThemeId('midnight');
    }
  };

  const applyTwoColorMixer = (config: TwoColorMixerConfig, name?: string) => {
    const generated = generateTwoColorTheme(config, name);
    saveCustomTheme(generated);
  };

  return {
    activeThemeId,
    setActiveThemeId,
    currentTheme,
    allThemes,
    customThemes,
    saveCustomTheme,
    deleteCustomTheme,
    applyTwoColorMixer,
  };
}
