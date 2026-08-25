import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, Award, Check, CheckCircle2, CircleDot, Clock, Copy, Dices, Keyboard, Play, Plus, RefreshCw, RotateCcw, RotateCw, Share2, Shuffle, Sparkles, Target, Timer, Trash2, Trophy, Users, Zap } from 'lucide-react';
import { ResultCard } from '../../common/ResultCard';

export const DecisionWheelRandomPicker: React.FC = () => {
  const [tab, setTab] = useState<'wheel' | 'coin' | 'dice' | 'teams'>('wheel');

  // Wheel State
  const [wheelOptions, setWheelOptions] = useState<string[]>([
    'Math Revision', 'Physics Lab Report', '30 Min Workout', 'Read Literature', 'Coding Practice', 'Take a Break'
  ]);
  const [newOption, setNewOption] = useState('');
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);

  // Coin State
  const [coinResult, setCoinResult] = useState<'HEADS' | 'TAILS' | null>(null);
  const [isFlippingCoin, setIsFlippingCoin] = useState(false);

  // Dice State
  const [diceCount, setDiceCount] = useState(2);
  const [diceResults, setDiceResults] = useState<number[]>([4, 6]);

  // Team Generator State
  const [teamNamesInput, setTeamNamesInput] = useState(
    'Alex, Jordan, Sam, Taylor, Casey, Morgan, Riley, Jamie, Avery, Logan'
  );
  const [numTeams, setNumTeams] = useState(2);
  const [generatedTeams, setGeneratedTeams] = useState<string[][]>([]);

  // Wheel Spin Logic
  const handleSpinWheel = () => {
    if (isSpinning || wheelOptions.length === 0) return;
    setIsSpinning(true);
    setSelectedWinner(null);

    const randomIndex = Math.floor(Math.random() * wheelOptions.length);
    const degreesPerSlice = 360 / wheelOptions.length;
    const extraSpins = 5 * 360;
    const targetDegree = extraSpins + (wheelOptions.length - randomIndex - 0.5) * degreesPerSlice;

    setWheelRotation(prev => prev + targetDegree);

    setTimeout(() => {
      setSelectedWinner(wheelOptions[randomIndex]);
      setIsSpinning(false);
    }, 3000);
  };

  const handleFlipCoin = () => {
    setIsFlippingCoin(true);
    setCoinResult(null);
    setTimeout(() => {
      setCoinResult(Math.random() > 0.5 ? 'HEADS' : 'TAILS');
      setIsFlippingCoin(false);
    }, 800);
  };

  const handleRollDice = () => {
    const rolled = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
    setDiceResults(rolled);
  };

  const handleGenerateTeams = () => {
    const names = teamNamesInput
      .split(/[,\n]/)
      .map(n => n.trim())
      .filter(Boolean);

    if (names.length === 0) return;

    // Shuffle
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    const teams: string[][] = Array.from({ length: numTeams }, () => []);

    shuffled.forEach((name, i) => {
      teams[i % numTeams].push(name);
    });

    setGeneratedTeams(teams);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Tab Selector */}
      <div className="flex rounded-2xl bg-theme-surface p-1.5 border border-theme-border max-w-md mx-auto shadow-md">
        {[
          { id: 'wheel', label: 'Decision Wheel', icon: CircleDot },
          { id: 'coin', label: 'Coin Flip', icon: RotateCw },
          { id: 'dice', label: 'Dice Roller', icon: Dices },
          { id: 'teams', label: 'Team Randomizer', icon: Users },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                tab === t.id
                  ? 'bg-theme-accent text-white shadow-md'
                  : 'text-theme-text-muted hover:text-theme-text'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. DECISION WHEEL */}
      {tab === 'wheel' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 bg-theme-surface border border-theme-border rounded-3xl p-6 flex flex-col items-center justify-center space-y-6 shadow-xl relative overflow-hidden">
            {/* Pointer */}
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-rose-500 z-10 -mb-5 shadow-lg" />

            {/* Wheel Canvas Mockup */}
            <div
              className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-theme-border shadow-2xl flex items-center justify-center transition-transform duration-[3000ms] ease-out relative overflow-hidden bg-gradient-to-tr from-theme-accent via-cyan-500 to-indigo-600"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              <div className="w-16 h-16 rounded-full bg-theme-bg border-4 border-theme-border flex items-center justify-center font-bold text-xs text-theme-text shadow-inner z-10">
                STUDKIT
              </div>
            </div>

            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="px-8 py-3 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-sm font-bold shadow-xl shadow-theme-accent/25 active:scale-95 disabled:opacity-50"
            >
              {isSpinning ? 'Spinning...' : 'Spin Decision Wheel!'}
            </button>

            {selectedWinner && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center animate-fade-in">
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">Selected Outcome:</span>
                <span className="text-lg font-black text-theme-text">{selectedWinner}</span>
              </div>
            )}
          </div>

          {/* Options Manager */}
          <div className="md:col-span-5 bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-theme-text block">Wheel Options</span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add option..."
                value={newOption}
                onChange={e => setNewOption(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
              />
              <button
                onClick={() => {
                  if (newOption.trim()) {
                    setWheelOptions(prev => [...prev, newOption.trim()]);
                    setNewOption('');
                  }
                }}
                className="px-3 py-2 rounded-xl bg-theme-accent text-white text-xs font-bold"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {wheelOptions.map((opt, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-between text-xs text-theme-text"
                >
                  <span className="truncate">{opt}</span>
                  <button
                    onClick={() => setWheelOptions(wheelOptions.filter((_, idx) => idx !== i))}
                    className="text-rose-400 hover:opacity-80 p-0.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. COIN FLIP */}
      {tab === 'coin' && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-8 max-w-md mx-auto text-center space-y-6 shadow-xl">
          <h3 className="text-base font-bold text-theme-text">True Random Coin Flipper</h3>
          <div className="w-36 h-36 rounded-full mx-auto border-4 border-amber-400 bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-3xl font-black text-amber-950 shadow-2xl">
            {coinResult || '🪙'}
          </div>
          <button
            onClick={handleFlipCoin}
            disabled={isFlippingCoin}
            className="px-8 py-3 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 active:scale-95"
          >
            {isFlippingCoin ? 'Flipping...' : 'Flip Coin'}
          </button>
        </div>
      )}

      {/* 3. DICE ROLLER */}
      {tab === 'dice' && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-8 max-w-md mx-auto text-center space-y-6 shadow-xl">
          <div className="flex items-center justify-center gap-3">
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setDiceCount(n)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  diceCount === n
                    ? 'bg-theme-accent text-white border-theme-accent'
                    : 'bg-theme-bg border-theme-border text-theme-text'
                }`}
              >
                {n} {n === 1 ? 'Die' : 'Dice'}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 py-4">
            {diceResults.map((r, i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-2xl bg-white text-gray-950 border-2 border-gray-300 flex items-center justify-center text-4xl font-black shadow-xl"
              >
                {r}
              </div>
            ))}
          </div>

          <div className="text-xs font-mono text-theme-text-muted">
            Sum Total: <strong className="text-theme-accent text-base">{diceResults.reduce((a, b) => a + b, 0)}</strong>
          </div>

          <button
            onClick={handleRollDice}
            className="px-8 py-3 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 active:scale-95"
          >
            Roll Dice
          </button>
        </div>
      )}

      {/* 4. TEAM RANDOMIZER */}
      {tab === 'teams' && (
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-theme-text block mb-1">Paste Student / Member Names</label>
              <textarea
                value={teamNamesInput}
                onChange={e => setTeamNamesInput(e.target.value)}
                placeholder="Separate names by comma or new line"
                className="w-full h-32 p-3 rounded-2xl bg-theme-bg border border-theme-border text-xs text-theme-text resize-none"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-theme-text block mb-1">Number of Teams</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={numTeams}
                  onChange={e => setNumTeams(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text font-mono"
                />
              </div>

              <button
                onClick={handleGenerateTeams}
                className="w-full py-3 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/25 flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Shuffle className="w-4 h-4" />
                <span>Generate Random Balanced Teams</span>
              </button>
            </div>
          </div>

          {/* Generated Teams Grid */}
          {generatedTeams.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-theme-border">
              {generatedTeams.map((team, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
                  <span className="text-xs font-bold text-theme-accent block font-mono">Team {idx + 1} ({team.length} Members)</span>
                  <ul className="space-y-1 text-xs text-theme-text">
                    {team.map((m, mi) => (
                      <li key={mi} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};










const SAMPLE_TEXTS = [
  'Artificial intelligence is revolutionizing modern education by enabling students to practice active recall through grounded self-assessment quizzes.',
  'Consistent spaced repetition and time-blocking techniques allow university students to retain complex scientific concepts with significantly less cognitive fatigue.',
  'Computer systems rely on fundamental data structures such as balanced trees, hash tables, and graphs to execute scalable distributed algorithms.',
  'Academic excellence requires disciplined daily study habits, comprehensive lecture note-taking, and regular mathematical problem-solving sessions.',
];

export const TypingSpeedTest: React.FC = () => {
  const [selectedTextIndex, setSelectedTextIndex] = useState(0);
  const targetText = SAMPLE_TEXTS[selectedTextIndex];

  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    setUserInput(val);

    if (val.length >= targetText.length) {
      setEndTime(Date.now());
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsCompleted(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleNextText = () => {
    setSelectedTextIndex((prev) => (prev + 1) % SAMPLE_TEXTS.length);
    handleRestart();
  };

  // Calculate WPM and Accuracy
  const timeSeconds =
    startTime && endTime
      ? (endTime - startTime) / 1000
      : startTime
      ? (Date.now() - startTime) / 1000
      : 0;

  const correctChars = userInput
    .split('')
    .filter((char, idx) => char === targetText[idx]).length;

  const words = userInput.trim().split(/\s+/).length;
  const wpm = timeSeconds > 0 ? Math.round((words / (timeSeconds / 60))) : 0;
  const accuracy =
    userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Metrics Header Bar */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-theme-text">Academic Typing Speed Sprint</h2>
            <p className="text-xs text-theme-text-muted">Test typing words per minute (WPM) and accuracy.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-center">
            <span className="text-theme-text-muted block text-[10px]">WPM</span>
            <span className="text-xl font-black text-theme-accent">{wpm}</span>
          </div>
          <div className="text-center">
            <span className="text-theme-text-muted block text-[10px]">ACCURACY</span>
            <span className={`text-xl font-black ${accuracy >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {accuracy}%
            </span>
          </div>
          <div className="text-center">
            <span className="text-theme-text-muted block text-[10px]">TIME</span>
            <span className="text-xl font-black text-theme-text">{Math.round(timeSeconds)}s</span>
          </div>
        </div>
      </div>

      {/* Target Passage Container */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-5">
        <div className="text-sm sm:text-base font-mono leading-relaxed p-4 rounded-2xl bg-theme-bg border border-theme-border select-none">
          {targetText.split('').map((char, idx) => {
            let colorClass = 'text-theme-text-muted';
            if (idx < userInput.length) {
              colorClass =
                userInput[idx] === char ? 'text-emerald-400 bg-emerald-500/10 rounded' : 'text-rose-400 bg-rose-500/20 rounded';
            }
            return (
              <span key={idx} className={colorClass}>
                {char}
              </span>
            );
          })}
        </div>

        {/* Live Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isCompleted}
          placeholder="Start typing the passage above to begin timer..."
          className="w-full px-4 py-3.5 rounded-2xl bg-theme-bg border-2 border-theme-border focus:border-theme-accent text-sm text-theme-text font-mono outline-none shadow-inner"
          autoFocus
        />

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-theme-text font-semibold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleNextText}
            className="px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white font-bold flex items-center gap-1.5 shadow-md shadow-theme-accent/25"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next Passage</span>
          </button>
        </div>
      </div>

      {/* Completed Results Banner */}
      {isCompleted && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-theme-accent/20 via-theme-surface to-emerald-500/20 border border-theme-accent/40 shadow-2xl text-center space-y-3 animate-fade-in">
          <Award className="w-10 h-10 text-theme-accent mx-auto" />
          <h3 className="text-lg font-bold text-theme-text">Typing Sprint Completed!</h3>
          <p className="text-xs text-theme-text-muted">
            You scored <strong className="text-theme-accent">{wpm} WPM</strong> with <strong className="text-emerald-400">{accuracy}% accuracy</strong> in {Math.round(timeSeconds)} seconds.
          </p>
          <button
            onClick={handleNextText}
            className="px-6 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25"
          >
            Practice Another Passage
          </button>
        </div>
      )}
    </div>
  );
};
