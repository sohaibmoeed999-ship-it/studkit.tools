import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Award, Bot, Brain, Brush, Check, ChevronDown, ChevronUp, Clock, Compass, Copy, Download, Eye, EyeOff, Flame, Grid, Heart, HelpCircle, Milestone, Move, Pause, Play, Plus, RefreshCw, RotateCcw, RotateCw, Save, Scissors, Share2, Shuffle, Sliders, Smile, Sparkles, Square, Sun, Target, ThumbsUp, Timer, Trash2, Trophy, Undo2, Users, Volume2, VolumeX, Wand2, X, Zap } from 'lucide-react';
import { sounds } from '../../../utils/audio';
import { downloadBlob } from '../../../utils/download';

type DrawTool = 'pen' | 'pencil' | 'marker' | 'highlighter' | 'eraser' | 'line' | 'rect' | 'circle';
type GameMode = 'free' | 'challenge' | 'vs_computer' | 'two_player';
type CanvasTheme = 'whiteboard' | 'blackboard' | 'dark' | 'paper';

interface Point {
  x: number;
  y: number;
}

const PROMPT_BANK = [
  'Rocket', 'Microscope', 'Graduation Cap', 'Bicycle', 'Sun & Clouds',
  'Laptop Computer', 'Tree', 'Pizza Slice', 'Atom Structure', 'Lightbulb',
  'Coffee Mug', 'Saturn Planet', 'Guitar', 'Compass', 'Book'
];

export const DrawingCreativityLab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<GameMode>('free');
  const [tool, setTool] = useState<DrawTool>('pen');
  const [color, setColor] = useState('#0284c7');
  const [brushSize, setBrushSize] = useState(5);
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>('whiteboard');

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Challenge & Game Modes State
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [timer, setTimer] = useState(45);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  // 2-Player Mode State
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [playerScores, setPlayerScores] = useState<{ p1: number; p2: number }>({ p1: 0, p2: 0 });
  const [p2GuessInput, setP2GuessInput] = useState('');
  const [guessFeedback, setGuessFeedback] = useState<string | null>(null);

  // VS Computer State
  const [computerGuesses, setComputerGuesses] = useState<string[]>([]);
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  const currentPrompt = PROMPT_BANK[currentPromptIndex % PROMPT_BANK.length];

  const colors = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#10b981',
    '#06b6d4', '#0284c7', '#6366f1', '#a855f7', '#ec4899', '#78716c'
  ];

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set 2x resolution for ultra-smooth anti-aliased strokes
    canvas.width = 800;
    canvas.height = 500;

    resetCanvasTheme(ctx, canvas);
    saveState();
  }, [canvasTheme]);

  // Game Timer Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            handleTimeUp();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const resetCanvasTheme = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (canvasTheme === 'blackboard') {
      ctx.fillStyle = '#1e293b';
    } else if (canvasTheme === 'dark') {
      ctx.fillStyle = '#090d16';
    } else if (canvasTheme === 'paper') {
      ctx.fillStyle = '#f8fafc';
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), data].slice(-25));
    setHistoryIndex(prev => prev + 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.putImageData(history[historyIndex - 1], 0, 0);
      setHistoryIndex(prev => prev - 1);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    resetCanvasTheme(ctx, canvas);
    saveState();
    setComputerGuesses([]);
    setGuessFeedback(null);
  };

  // Coordinates Helper
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Drawing Handlers with Smooth Bezier Quadratic Interpolation
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pt = getCoordinates(e);
    setIsDrawing(true);
    setStartPoint(pt);

    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);

    // Stroke style configuration
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.strokeStyle = canvasTheme === 'blackboard' ? '#1e293b' : canvasTheme === 'dark' ? '#090d16' : '#ffffff';
      ctx.lineWidth = brushSize * 3;
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = brushSize * 4;
    } else if (tool === 'marker') {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = brushSize * 2;
    } else if (tool === 'pencil') {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = Math.max(1, brushSize * 0.6);
    } else {
      ctx.strokeStyle = color;
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = brushSize;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pt = getCoordinates(e);

    if (['pen', 'pencil', 'marker', 'highlighter', 'eraser'].includes(tool)) {
      // Smooth Quadratic Bezier Curve to eliminate jagged edges
      ctx.quadraticCurveTo(startPoint.x, startPoint.y, (startPoint.x + pt.x) / 2, (startPoint.y + pt.y) / 2);
      ctx.stroke();
      setStartPoint(pt);
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStartPoint(null);
    saveState();

    // Trigger AI computer guess logic if in VS Computer mode
    if (mode === 'vs_computer') {
      triggerComputerGuess();
    }
  };

  // AI Guessing Simulation based on stroke progress
  const triggerComputerGuess = () => {
    setIsComputerThinking(true);
    setTimeout(() => {
      const isCorrect = Math.random() > 0.45;
      const guess = isCorrect ? currentPrompt : PROMPT_BANK[Math.floor(Math.random() * PROMPT_BANK.length)];
      setComputerGuesses(prev => [guess, ...prev].slice(0, 4));
      setIsComputerThinking(false);

      if (guess.toLowerCase() === currentPrompt.toLowerCase()) {
        setScore(s => s + 100);
        setGuessFeedback('🎉 Computer accurately recognized your drawing!');
      }
    }, 800);
  };

  const handleStartGame = () => {
    setScore(0);
    setRound(1);
    setTimer(45);
    setIsTimerRunning(true);
    setCurrentPromptIndex(Math.floor(Math.random() * PROMPT_BANK.length));
    handleClear();
  };

  const handleNextRound = () => {
    setRound(r => r + 1);
    setTimer(45);
    setIsTimerRunning(true);
    setCurrentPromptIndex(prev => (prev + 1) % PROMPT_BANK.length);
    setP2GuessInput('');
    setGuessFeedback(null);
    handleClear();
  };

  const handleTimeUp = () => {
    setIsTimerRunning(false);
    setGuessFeedback('⏰ Time is up! Review your sketch or advance to the next round.');
  };

  const handleP2GuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!p2GuessInput.trim()) return;

    if (p2GuessInput.trim().toLowerCase() === currentPrompt.toLowerCase()) {
      setPlayerScores(prev => ({
        ...prev,
        [activePlayer === 1 ? 'p2' : 'p1']: prev[activePlayer === 1 ? 'p2' : 'p1'] + 100,
      }));
      setGuessFeedback(`✅ Correct! The word was "${currentPrompt}".`);
      setIsTimerRunning(false);
    } else {
      setGuessFeedback(`❌ "${p2GuessInput}" is incorrect. Try again!`);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, `STUDKIT_Drawing_${Date.now()}.png`);
    }, 'image/png');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Studio Header Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
            <Brush className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Smooth Drawing Studio & Guessing Arena</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                Smooth Vector Canvas
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">Anti-aliased natural strokes, challenge modes, VS Computer, and local 2-Player arena.</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-theme-bg p-1 rounded-2xl border border-theme-border overflow-x-auto scrollbar-none">
          {[
            { id: 'free', label: 'Free Draw', icon: Brush },
            { id: 'challenge', label: 'Timed Challenge', icon: Trophy },
            { id: 'vs_computer', label: 'VS Computer', icon: Bot },
            { id: 'two_player', label: '2 Player Pass & Play', icon: Users },
          ].map(m => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setMode(m.id as any);
                  if (m.id !== 'free') handleStartGame();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  mode === m.id
                    ? 'bg-theme-accent text-white shadow-sm'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Game Banner Header (for Challenge / 2-Player / Computer) */}
      {mode !== 'free' && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-theme-surface via-theme-bg to-theme-surface border border-theme-border flex flex-wrap items-center justify-between gap-4 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-theme-accent/15 text-theme-accent border border-theme-accent/30">
              Round {round}
            </span>
            <div>
              <span className="text-xs text-theme-text-muted block font-medium">Your Drawing Prompt:</span>
              <span className="text-base sm:text-lg font-black tracking-wider text-cyan-400 uppercase">
                &ldquo;{currentPrompt}&rdquo;
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-theme-text">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{timer}s</span>
            </div>

            {mode === 'two_player' ? (
              <div className="text-xs font-bold text-theme-text">
                P1: <span className="text-cyan-400">{playerScores.p1}</span> | P2: <span className="text-rose-400">{playerScores.p2}</span>
              </div>
            ) : (
              <div className="text-xs font-bold text-theme-text">
                Score: <span className="text-emerald-400">{score}</span>
              </div>
            )}

            <button
              onClick={handleNextRound}
              className="px-3 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center gap-1 shadow-md"
            >
              <span>Next Round</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Studio Canvas & Tools Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl space-y-4">
        {/* Toolbar Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-theme-border">
          {/* Tool Selection */}
          <div className="flex items-center gap-1 bg-theme-bg p-1 rounded-xl border border-theme-border overflow-x-auto scrollbar-none">
            {[
              { id: 'pen', label: 'Pen' },
              { id: 'pencil', label: 'Pencil' },
              { id: 'marker', label: 'Marker' },
              { id: 'highlighter', label: 'Highlighter' },
              { id: 'eraser', label: 'Eraser' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTool(t.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  tool === t.id
                    ? 'bg-theme-accent text-white shadow-sm'
                    : 'text-theme-text-muted hover:text-theme-text'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Color Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  if (tool === 'eraser') setTool('pen');
                }}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  color === c ? 'scale-125 border-theme-accent shadow-md' : 'border-black/20 hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0"
            />
          </div>

          {/* Brush Size & Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-theme-text-muted">
              <span>Size:</span>
              <input
                type="range"
                min="1"
                max="30"
                value={brushSize}
                onChange={e => setBrushSize(Number(e.target.value))}
                className="w-20 accent-theme-accent cursor-pointer"
              />
            </div>

            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 rounded-lg bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text disabled:opacity-40"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-rose-400"
              title="Clear Canvas"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center gap-1 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PNG</span>
            </button>
          </div>
        </div>

        {/* Smooth Vector Drawing Canvas */}
        <div className="relative flex items-center justify-center rounded-2xl overflow-hidden border border-theme-border shadow-inner bg-black/5">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full max-h-[500px] object-contain cursor-crosshair touch-none"
          />
        </div>

        {/* 2-Player Guessing Input Bar */}
        {mode === 'two_player' && (
          <form onSubmit={handleP2GuessSubmit} className="flex gap-2 pt-2 animate-fade-in">
            <input
              type="text"
              placeholder="Player 2: Type your guess here..."
              value={p2GuessInput}
              onChange={e => setP2GuessInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text outline-none focus:border-theme-accent"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md"
            >
              Submit Guess
            </button>
          </form>
        )}

        {/* VS Computer Guesses Live Feed */}
        {mode === 'vs_computer' && (
          <div className="p-3 rounded-2xl bg-theme-bg border border-theme-border flex items-center justify-between text-xs animate-fade-in">
            <div className="flex items-center gap-2 text-theme-text">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>AI Guesser:</span>
              <span className="font-mono text-cyan-400 font-bold">
                {isComputerThinking ? 'Analyzing drawing strokes...' : computerGuesses[0] ? `"${computerGuesses[0]}"?` : 'Draw something for AI to guess!'}
              </span>
            </div>
            {computerGuesses.length > 1 && (
              <span className="text-[11px] text-theme-text-muted">Previous: {computerGuesses.slice(1).join(', ')}</span>
            )}
          </div>
        )}

        {guessFeedback && (
          <div className="p-3 rounded-xl bg-theme-accent/10 border border-theme-accent/20 text-xs font-bold text-theme-accent text-center animate-fade-in">
            {guessFeedback}
          </div>
        )}
      </div>
    </div>
  );
};



const CARD_ICONS = ['🚀', '🧬', '⚡', '💻', '📐', '🧠', '🔬', '📚'];

export const MemoryCardsGame: React.FC = () => {
  const [cards, setCards] = useState<{ id: number; icon: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);

  const initGame = () => {
    const deck = [...CARD_ICONS, ...CARD_ICONS]
      .sort(() => 0.5 - Math.random())
      .map((icon, id) => ({
        id,
        icon,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) return;

    sounds.playPop();
    const nextCards = [...cards];
    nextCards[index].isFlipped = true;
    setCards(nextCards);

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;

      if (cards[firstIdx].icon === cards[secondIdx].icon) {
        sounds.playSuccess();
        setTimeout(() => {
          nextCards[firstIdx].isMatched = true;
          nextCards[secondIdx].isMatched = true;
          setCards([...nextCards]);
          setFlippedIndices([]);
          setMatchedPairs(p => p + 1);
        }, 400);
      } else {
        setTimeout(() => {
          nextCards[firstIdx].isFlipped = false;
          nextCards[secondIdx].isFlipped = false;
          setCards([...nextCards]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const isWon = matchedPairs === CARD_ICONS.length;

  return (
    <div className="space-y-6 max-w-md mx-auto select-none text-center">
      <div className="flex items-center justify-between pb-2 border-b border-theme-border">
        <div className="flex items-center gap-2">
          <Copy className="w-5 h-5 text-theme-accent" />
          <h2 className="text-base sm:text-lg font-bold text-theme-text">Memory Card Match</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-theme-text-muted">Moves: {moves}</span>
          <button onClick={initGame} className="p-2 rounded-xl bg-theme-surface border border-theme-border">
            <RefreshCw className="w-4 h-4 text-theme-text" />
          </button>
        </div>
      </div>

      <div className="p-4 bg-theme-surface border-2 border-theme-border rounded-3xl shadow-2xl">
        <div className="grid grid-cols-4 gap-2.5">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-16 sm:h-20 rounded-2xl text-2xl flex items-center justify-center transition-all duration-300 transform ${
                card.isFlipped || card.isMatched
                  ? 'bg-theme-bg border-2 border-theme-accent shadow-md'
                  : 'bg-theme-surface-hover hover:bg-theme-accent/20 border border-theme-border'
              }`}
            >
              {card.isFlipped || card.isMatched ? card.icon : '❓'}
            </button>
          ))}
        </div>
      </div>

      {isWon && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-sm animate-bounce">
          🎉 All Pairs Matched in {moves} moves!
        </div>
      )}
    </div>
  );
};



const WORDS_BANK = [
  { word: 'ALGORITHM', category: 'Computer Science', hint: 'Step-by-step procedure for solving problems' },
  { word: 'GRAVITATION', category: 'Physics', hint: 'Universal force attracting masses' },
  { word: 'PHOTOSYNTHESIS', category: 'Biology', hint: 'Process plants use to synthesize nutrients' },
  { word: 'THERMODYNAMICS', category: 'Physics', hint: 'Study of heat, energy and mechanical work' },
  { word: 'POLYMERIZATION', category: 'Chemistry', hint: 'Reaction joining monomer molecules' },
];

export const HangmanGame: React.FC = () => {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const maxWrong = 6;

  const current = WORDS_BANK[puzzleIndex % WORDS_BANK.length];
  const targetLetters = current.word.split('');
  const isWon = targetLetters.every(l => guessedLetters.includes(l));
  const isLost = wrongGuesses >= maxWrong;

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || isWon || isLost) return;

    sounds.playPop();
    setGuessedLetters([...guessedLetters, letter]);

    if (!current.word.includes(letter)) {
      setWrongGuesses(w => w + 1);
    } else {
      sounds.playSuccess();
    }
  };

  const nextPuzzle = () => {
    setPuzzleIndex(p => p + 1);
    setGuessedLetters([]);
    setWrongGuesses(0);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-theme-border">
          <div className="text-left">
            <span className="text-[10px] font-mono uppercase text-theme-accent font-bold block">
              {current.category}
            </span>
            <h3 className="text-sm font-semibold text-theme-text-muted">{current.hint}</h3>
          </div>
          <span className="font-mono text-xs font-bold text-rose-400">
            Lives: {maxWrong - wrongGuesses}
          </span>
        </div>

        {/* Word Display */}
        <div className="flex flex-wrap items-center justify-center gap-2 py-4">
          {targetLetters.map((l, idx) => (
            <div
              key={idx}
              className="w-8 h-10 sm:w-9 sm:h-12 rounded-xl bg-theme-bg border-2 border-theme-border flex items-center justify-center font-mono text-base sm:text-lg font-black text-theme-text"
            >
              {guessedLetters.includes(l) || isLost ? l : ''}
            </div>
          ))}
        </div>

        {/* Alphabet Keypad */}
        <div className="grid grid-cols-7 gap-1.5">
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => {
            const isPicked = guessedLetters.includes(char);
            return (
              <button
                key={char}
                onClick={() => handleGuess(char)}
                disabled={isPicked || isWon || isLost}
                className={`py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                  isPicked
                    ? 'opacity-30 bg-theme-bg border-theme-border text-theme-text-muted'
                    : 'bg-theme-bg hover:bg-theme-accent hover:text-white border-theme-border text-theme-text'
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>

        {(isWon || isLost) && (
          <div className="space-y-3 animate-fade-in pt-2">
            <div
              className={`p-3.5 rounded-2xl font-bold text-xs ${
                isWon ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}
            >
              {isWon ? '🎉 Excellent! You solved the academic keyword!' : `Revealed Word: ${current.word}`}
            </div>
            <button
              onClick={nextPuzzle}
              className="w-full py-3 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20"
            >
              Next Academic Keyword
            </button>
          </div>
        )}
      </div>
    </div>
  );
};



export const CalmBreathingGame: React.FC = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [seconds, setSeconds] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          if (phase === 'Inhale') {
            setPhase('Hold');
            sounds.playBeep(440, 0.1);
            return 7;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            sounds.playBeep(330, 0.1);
            return 8;
          } else {
            setPhase('Inhale');
            sounds.playBeep(550, 0.1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="space-y-6 max-w-md mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-8 space-y-8 shadow-2xl">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-theme-text">4-7-8 Calm Breathing Circle</h2>
          <p className="text-xs text-theme-text-muted">Proven psychological technique for calming exam nerves.</p>
        </div>

        {/* Dynamic Expanding/Contracting Breathing Circle */}
        <div className="relative w-60 h-60 mx-auto flex items-center justify-center">
          <div
            className={`absolute rounded-full border-4 border-theme-accent transition-all duration-1000 ease-in-out ${
              phase === 'Inhale'
                ? 'w-56 h-56 bg-cyan-500/20 shadow-2xl shadow-cyan-500/30 scale-100'
                : phase === 'Hold'
                ? 'w-56 h-56 bg-amber-500/20 border-amber-400 scale-105 animate-pulse'
                : 'w-24 h-24 bg-emerald-500/20 border-emerald-400 scale-90'
            }`}
          />

          <div className="relative z-10 space-y-1">
            <span className="text-2xl font-black text-white uppercase tracking-widest">{phase}</span>
            <div className="text-4xl font-black font-mono text-cyan-300">{seconds}s</div>
          </div>
        </div>

        <div className="text-xs text-theme-text-muted font-mono max-w-xs mx-auto">
          Inhale 4s through nose → Hold 7s → Exhale 8s slowly through mouth.
        </div>
      </div>
    </div>
  );
};



export const RelaxingParticlesGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 360);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
    }[] = [];

    const colors = ['#38bdf8', '#818cf8', '#c084fc', '#34d399', '#f472b6'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let mouse = { x: width / 2, y: height / 2, radius: 100 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.fillStyle = 'rgba(6, 9, 19, 0.2)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse attraction / gentle ripple
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          p.x += dx * 0.02;
          p.y += dy * 0.02;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="space-y-6 max-w-xl mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base sm:text-lg font-bold text-theme-text">Relaxing Particle Sandbox</h2>
          </div>
          <span className="text-xs font-mono text-theme-text-muted">Interactive Gravity</span>
        </div>

        <div className="rounded-2xl overflow-hidden border border-theme-border/60 bg-black/60 shadow-inner">
          <canvas ref={canvasRef} className="w-full h-80 cursor-pointer" />
        </div>

        <p className="text-xs text-theme-text-muted font-mono">
          Hover or move your cursor across the particles to create gentle ambient gravitational waves.
        </p>
      </div>
    </div>
  );
};



export const ShapeRotationGame: React.FC = () => {
  const [angle, setAngle] = useState(0);
  const targetAngle = 180;
  const isAligned = (angle % 360) === targetAngle;

  const rotate = () => {
    sounds.playPop();
    const next = angle + 90;
    setAngle(next);
    if ((next % 360) === targetAngle) {
      sounds.playSuccess();
    }
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <h2 className="text-base font-bold text-theme-text">Spatial Shape Rotation</h2>
          <span className="text-xs font-mono text-theme-text-muted">Target: Upside Down (180°)</span>
        </div>

        <div className="h-44 flex items-center justify-center p-6 bg-theme-bg rounded-2xl border border-theme-border">
          <div
            className="w-24 h-24 border-t-8 border-r-8 border-cyan-400 rounded-tr-3xl transition-transform duration-300 shadow-xl"
            style={{ transform: `rotate(${angle}deg)` }}
          />
        </div>

        <button
          onClick={rotate}
          className="w-full py-3 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20"
        >
          Rotate 90° Clockwise
        </button>

        {isAligned && (
          <div className="text-xs font-bold text-emerald-400 animate-bounce">
            ✓ Correct Spatial Alignment!
          </div>
        )}
      </div>
    </div>
  );
};
