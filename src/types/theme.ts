export interface ThemeDefinition {
  id: string;
  name: string;
  category: 'dark' | 'neon' | 'light' | 'minimal' | 'custom';
  colors: {
    bgPrimary: string;
    bgSurface: string;
    bgSurfaceHover: string;
    bgCard: string;
    borderColor: string;
    borderGlow: string;
    accentPrimary: string;
    accentGlow: string;
    accentHover: string;
    textPrimary: string;
    textMuted: string;
    accentDanger?: string;
    accentSuccess?: string;
    accentWarning?: string;
  };
  isCustom?: boolean;
}

export interface TwoColorMixerConfig {
  color1: string;
  color2: string;
  balance: number; // 0 to 100 (50 = balanced)
  style: 'balanced' | 'soft' | 'strong' | 'neon';
}

export interface ThemeSuggestion {
  name: string;
  color1: string;
  color2: string;
  category: string;
}
