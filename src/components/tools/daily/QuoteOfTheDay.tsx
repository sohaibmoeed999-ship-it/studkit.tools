import React, { useState, useRef } from 'react';
import { ResultCard } from '../../common/ResultCard';
import {
  Quote,
  Sparkles,
  Heart,
  Copy,
  Share2,
  Download,
  RotateCcw,
  Palette,
  Check,
  Smile,
  BookOpen,
  Zap,
} from 'lucide-react';
import { downloadText } from '../../../utils/download';

export interface QuoteItem {
  quote: string;
  author: string;
  context?: string;
  sourceType: 'verified' | 'ai_generated';
}

const MOOD_QUOTES: Record<string, QuoteItem[]> = {
  motivated: [
    { quote: "The secret of getting ahead is getting started.", author: "Mark Twain", sourceType: "verified" },
    { quote: "It always seems impossible until it's done.", author: "Nelson Mandela", sourceType: "verified" },
    { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma", sourceType: "verified" },
    { quote: "Every equation you solve today builds the problem-solving mind you need tomorrow.", author: "STUDKIT AI Study Companion", sourceType: "ai_generated" },
  ],
  stressed: [
    { quote: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman", sourceType: "verified" },
    { quote: "Breathe. One single test does not define your destiny or potential.", author: "STUDKIT Wellness Engine", sourceType: "ai_generated" },
    { quote: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott", sourceType: "verified" },
  ],
  'exam mode': [
    { quote: "Success isn't about greatness. It's about consistency. Consistent hard work leads to success.", author: "Dwayne Johnson", sourceType: "verified" },
    { quote: "Trust your preparation. Read questions carefully, stay calm, and execute step-by-step.", author: "STUDKIT Exam Coach", sourceType: "ai_generated" },
    { quote: "Self-belief and hard work will always earn you success.", author: "Virat Kohli", sourceType: "verified" },
  ],
  'study mode': [
    { quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", sourceType: "verified" },
    { quote: "Focus on understanding the concept deeply, not just memorizing the answer.", author: "Richard Feynman", sourceType: "verified" },
    { quote: "Spaced repetition and active recall turn short-term memory into permanent mastery.", author: "STUDKIT Cognitive Lab", sourceType: "ai_generated" },
  ],
  focused: [
    { quote: "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell", sourceType: "verified" },
    { quote: "Deep work is the superpower of the 21st-century knowledge economy.", author: "Cal Newport", sourceType: "verified" },
  ],
  tired: [
    { quote: "Rest is not a waste of time; it is an investment in your next breakthrough.", author: "STUDKIT Rest Advisor", sourceType: "ai_generated" },
    { quote: "Take rest; a field that has rested gives a bountiful crop.", author: "Ovid", sourceType: "verified" },
  ],
  happy: [
    { quote: "Happiness is not something readymade. It comes from your own actions.", author: "Dalai Lama", sourceType: "verified" },
    { quote: "Celebrate every small milestone in your academic journey!", author: "STUDKIT Daily Spark", sourceType: "ai_generated" },
  ],
  confident: [
    { quote: "With realization of one's own potential and self-confidence, one can build a better world.", author: "Dalai Lama", sourceType: "verified" },
    { quote: "You are capable of understanding even the most difficult subjects with steady persistence.", author: "STUDKIT AI Mentor", sourceType: "ai_generated" },
  ],
};

const MOODS = [
  'motivated', 'exam mode', 'study mode', 'focused', 'stressed', 'tired', 'happy', 'confident'
];

export const QuoteOfTheDay: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState('motivated');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [cardTheme, setCardTheme] = useState<'midnight' | 'sunset' | 'emerald' | 'minimal'>('midnight');
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState<QuoteItem[]>([]);

  const currentQuotes = MOOD_QUOTES[selectedMood] || MOOD_QUOTES.motivated;
  const currentQuote = currentQuotes[quoteIndex % currentQuotes.length];

  const handleNextQuote = () => {
    setQuoteIndex(prev => (prev + 1) % currentQuotes.length);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${currentQuote.quote}" — ${currentQuote.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleFavorite = () => {
    const exists = favorites.some(f => f.quote === currentQuote.quote);
    if (exists) {
      setFavorites(favorites.filter(f => f.quote !== currentQuote.quote));
    } else {
      setFavorites([...favorites, currentQuote]);
    }
  };

  const isFavorite = favorites.some(f => f.quote === currentQuote.quote);

  const themeClasses = {
    midnight: 'bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 text-white border-indigo-500/30',
    sunset: 'bg-gradient-to-br from-amber-950 via-rose-950 to-purple-950 text-white border-rose-500/30',
    emerald: 'bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 text-white border-emerald-500/30',
    minimal: 'bg-white text-gray-900 border-gray-300 shadow-xl',
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-theme-text flex items-center gap-2">
              <span>Mood-Based Quote & Inspiration Hub</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                Daily Motivation
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">Select your current mindset to unlock customized academic motivation.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {['midnight', 'sunset', 'emerald', 'minimal'].map(th => (
            <button
              key={th}
              onClick={() => setCardTheme(th as any)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold capitalize border transition-all ${
                cardTheme === th
                  ? 'bg-theme-accent text-white border-theme-accent shadow-md'
                  : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
              }`}
            >
              {th}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {MOODS.map(m => (
          <button
            key={m}
            onClick={() => {
              setSelectedMood(m);
              setQuoteIndex(0);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold capitalize whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedMood === m
                ? 'bg-theme-accent text-white shadow-md shadow-theme-accent/25 scale-105'
                : 'bg-theme-surface border border-theme-border text-theme-text hover:bg-theme-surface-hover'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{m}</span>
          </button>
        ))}
      </div>

      {/* Main Quote Display Canvas Card */}
      <div className={`p-8 sm:p-12 rounded-3xl border-2 transition-all shadow-2xl space-y-6 text-center relative overflow-hidden ${themeClasses[cardTheme]}`}>
        <Quote className="w-12 h-12 mx-auto opacity-20" />
        <blockquote className="text-lg sm:text-2xl font-bold leading-relaxed max-w-xl mx-auto">
          &ldquo;{currentQuote.quote}&rdquo;
        </blockquote>

        <div className="space-y-1">
          <cite className="text-sm font-semibold not-italic block opacity-90">— {currentQuote.author}</cite>
          <span className="text-[10px] uppercase font-mono tracking-wider opacity-60">
            {currentQuote.sourceType === 'ai_generated' ? '⚡ AI-Crafted Thought' : 'Verified Academic Quotation'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/10">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Quote'}</span>
          </button>

          <button
            onClick={handleToggleFavorite}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all ${
              isFavorite ? 'bg-rose-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleNextQuote}
            className="px-5 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
};
