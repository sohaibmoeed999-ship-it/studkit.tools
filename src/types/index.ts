export type ToolCategory =
  | 'all'
  | 'study'
  | 'ai'
  | 'pdf'
  | 'image'
  | 'calculators'
  | 'commerce'
  | 'math'
  | 'productivity'
  | 'career'
  | 'developer'
  | 'text'
  | 'mind'
  | 'games';

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  iconName: string;
  tags: string[];
  popular?: boolean;
  badge?: string;
}

export type ThemeName =
  | 'midnight'
  | 'ocean'
  | 'crimson'
  | 'graphite'
  | 'purple'
  | 'light'
  | 'minimal';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  accent: string;
  bgPreview: string;
  description: string;
}

export interface GroundedMCQ {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceReference: string;
}

export interface FlashcardItem {
  id: number;
  front: string;
  back: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  sourceReference?: string;
}
