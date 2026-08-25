import React, { useState, useEffect, useRef } from 'react';
import { Activity, AlertCircle, Award, Brain, Check, CheckCircle2, Clock, Crosshair, Flame, HelpCircle, Play, RefreshCw, RotateCcw, ShieldCheck, Shuffle, Sparkles, Target, Timer, Trophy, Volume2, VolumeX, XCircle, Zap } from 'lucide-react';
import { sounds } from '../../../utils/audio';

interface LogicQ {
  id: number;
  question: string;
  pattern: string[];
  options: string[];
  correct: number;
  explanation: string;
}

const IQ_QUESTIONS: LogicQ[] = [
  {
    id: 1,
    question: 'Find the next number in the arithmetic progression sequence:',
    pattern: ['2', '6', '12', '20', '30', '?'],
    options: ['38', '40', '42', '46'],
    correct: 2, // 42 (+4, +6, +8, +10, +12)
    explanation: 'Differences between consecutive terms increase by 2: +4, +6, +8, +10, +12. 30 + 12 = 42.',
  },
  {
    id: 2,
    question: 'Which word logically completes the verbal analogy? "Book is to Reading as Fork is to:"',
    pattern: ['Book : Reading', '::', 'Fork : ?'],
    options: ['Cooking', 'Eating', 'Kitchen', 'Spoon'],
    correct: 1,
    explanation: 'A book is a tool used for reading; a fork is a tool used for eating.',
  },
  {
    id: 3,
    question: 'Matrix Sequence deduction:',
    pattern: ['3, 9, 27', '4, 16, 64', '5, 25, ?'],
    options: ['100', '125', '150', '225'],
    correct: 1,
    explanation: 'Each row consists of n, n², n³. For n = 5: 5³ = 125.',
  },
  {
    id: 4,
    question: 'Letter cycle shift logic: A, D, G, J, ?',
    pattern: ['A (+3)', 'D (+3)', 'G (+3)', 'J (+3)', '?'],
    options: ['L', 'M', 'N', 'O'],
    correct: 1, // M
    explanation: 'Each letter steps forward by 3 alphabet indices. J (10) + 3 = M (13).',
  },
];

export const IqLogicTest: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [completed, setCompleted] = useState(false);

  const q = IQ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (idx === q.correct) {
      sounds.playSuccess();
      setScore(s => s + 1);
    } else {
      sounds.playBeep(200, 0.2);
    }
  };

  const handleNext = () => {
    if (currentIdx < IQ_QUESTIONS.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setCompleted(true);
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setCompleted(false);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base sm:text-lg font-bold text-theme-text">IQ & Logic Reasoning Practice</h2>
          </div>
          <span className="text-xs font-mono text-theme-text-muted">
            Question {currentIdx + 1} of {IQ_QUESTIONS.length}
          </span>
        </div>

        {!completed ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-semibold text-theme-text">{q.question}</h3>
              <div className="p-4 rounded-xl bg-theme-bg border border-theme-border flex flex-wrap items-center justify-center gap-3 font-mono text-sm sm:text-base font-bold text-theme-accent">
                {q.pattern.map((p, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-theme-surface border border-theme-border">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, idx) => {
                let style = 'bg-theme-bg hover:bg-theme-surface-hover border-theme-border text-theme-text';
                if (hasAnswered) {
                  if (idx === q.correct) style = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold';
                  else if (idx === selectedOption) style = 'bg-rose-500/15 border-rose-500/40 text-rose-300';
                  else style = 'opacity-50 border-theme-border text-theme-text-muted';
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(idx)}
                    disabled={hasAnswered}
                    className={`p-3.5 rounded-xl border text-sm font-semibold transition-all ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <div className="space-y-4 pt-2 border-t border-theme-border animate-fade-in">
                <div className="p-3 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text-muted">
                  <strong className="text-theme-text">Logic Deduction:</strong> {q.explanation}
                </div>
                <button
                  onClick={handleNext}
                  className="w-full py-3 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20"
                >
                  {currentIdx < IQ_QUESTIONS.length - 1 ? 'Next Pattern Question' : 'View Practice Score'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
              <Award className="w-10 h-10 text-amber-400 mx-auto" />
              <span className="text-xs uppercase font-mono text-theme-text-muted">Practice Logic Score</span>
              <span className="text-4xl font-black text-theme-accent block font-mono">
                {score} / {IQ_QUESTIONS.length}
              </span>
              <p className="text-xs text-theme-text-muted max-w-sm mx-auto">
                {score === 4
                  ? 'Exceptional logical deduction! Top 5% practice benchmark.'
                  : 'Solid pattern recognition skills. Regular brain practice builds speed.'}
              </p>
            </div>

            <button
              onClick={restart}
              className="w-full py-3 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Logic Challenge</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};



interface MathProblem {
  num1: number;
  num2: number;
  op: '+' | '-' | '×';
  answer: number;
}

export const MathSpeedSprint: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [problem, setProblem] = useState<MathProblem>({ num1: 12, num2: 8, op: '+', answer: 20 });
  const [userAnswer, setUserAnswer] = useState('');
  const [finished, setFinished] = useState(false);

  const generateProblem = (): MathProblem => {
    const ops: ('+' | '-' | '×')[] = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let num1 = Math.floor(Math.random() * 50) + 5;
    let num2 = Math.floor(Math.random() * 30) + 2;

    if (op === '×') {
      num1 = Math.floor(Math.random() * 12) + 2;
      num2 = Math.floor(Math.random() * 12) + 2;
    }

    let answer = num1 + num2;
    if (op === '-') {
      if (num1 < num2) [num1, num2] = [num2, num1];
      answer = num1 - num2;
    }
    if (op === '×') answer = num1 * num2;

    return { num1, num2, op, answer };
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (started && !finished) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setFinished(true);
            sounds.playTimerDone();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started, finished]);

  const handleStart = () => {
    setStarted(true);
    setTimeLeft(60);
    setScore(0);
    setFinished(false);
    setUserAnswer('');
    setProblem(generateProblem());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserAnswer(val);

    if (parseInt(val) === problem.answer) {
      sounds.playSuccess();
      setScore(s => s + 1);
      setUserAnswer('');
      setProblem(generateProblem());
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-theme-text">60s Mental Math Sprint</h2>
          </div>
          <span className="font-mono text-sm font-bold text-theme-accent bg-theme-bg px-3 py-1 rounded-lg border border-theme-border">
            ⏳ {timeLeft}s
          </span>
        </div>

        {!started || finished ? (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border space-y-3">
              {finished ? (
                <>
                  <Award className="w-12 h-12 text-amber-400 mx-auto" />
                  <span className="text-xs font-mono uppercase text-theme-text-muted">Sprint Result</span>
                  <div className="text-5xl font-black font-mono text-emerald-400">{score} Solved</div>
                  <p className="text-xs text-theme-text-muted">
                    {score >= 20 ? '⚡ Superhuman mental calculation speed!' : 'Great pace! Rapid arithmetic sharpens focus.'}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-theme-text">60-Second Challenge</h3>
                  <p className="text-xs text-theme-text-muted max-w-sm mx-auto">
                    Solve as many addition, subtraction, and multiplication problems as possible before time runs out.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all"
            >
              {finished ? 'Restart Math Sprint' : 'Start 60s Sprint'}
            </button>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            <div className="text-4xl sm:text-5xl font-mono font-black text-theme-text">
              {problem.num1} {problem.op} {problem.num2} = ?
            </div>

            <input
              type="number"
              autoFocus
              value={userAnswer}
              onChange={handleInputChange}
              placeholder="Type answer..."
              className="w-48 px-4 py-3 rounded-2xl bg-theme-bg border-2 border-theme-accent text-center font-mono text-2xl font-bold text-theme-text outline-none mx-auto"
            />

            <div className="text-xs font-mono text-emerald-400 font-bold">
              Current Score: {score} Correct
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export const NumberMemoryTest: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [stage, setStage] = useState<'memorize' | 'recall' | 'result'>('memorize');
  const [targetNumber, setTargetNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(3);
  const [highScore, setHighScore] = useState(1);

  const startLevel = (lvl: number) => {
    // Generate lvl + 2 digit number
    const len = lvl + 2;
    let num = '';
    for (let i = 0; i < len; i++) {
      num += Math.floor(Math.random() * 10).toString();
    }
    setTargetNumber(num);
    setUserInput('');
    setStage('memorize');
    setTimeLeft(2 + lvl * 0.8);
  };

  useEffect(() => {
    startLevel(1);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === 'memorize') {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 0.2) {
            setStage('recall');
            return 0;
          }
          return t - 0.2;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [stage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput === targetNumber) {
      sounds.playSuccess();
      const nextLvl = level + 1;
      setLevel(nextLvl);
      if (nextLvl > highScore) setHighScore(nextLvl);
      startLevel(nextLvl);
    } else {
      sounds.playBeep(200, 0.3);
      setStage('result');
    }
  };

  const restart = () => {
    setLevel(1);
    startLevel(1);
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto text-center select-none">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-theme-accent" />
            <h3 className="text-base font-bold text-theme-text">Number Memory Span</h3>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">Level {level}</span>
        </div>

        {stage === 'memorize' && (
          <div className="space-y-6 py-6">
            <span className="text-[11px] uppercase font-mono text-theme-text-muted">Memorize this number:</span>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-theme-accent animate-pulse">
              {targetNumber}
            </div>
            <div className="w-full h-1.5 bg-theme-bg rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-200"
                style={{ width: `${(timeLeft / (2 + level * 0.8)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {stage === 'recall' && (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <span className="text-xs text-theme-text-muted">What was the number?</span>
            <input
              type="text"
              autoFocus
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Type number..."
              className="w-full px-4 py-3 rounded-2xl bg-theme-bg border-2 border-theme-accent text-center font-mono text-2xl font-bold text-theme-text outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20"
            >
              Submit Answer
            </button>
          </form>
        )}

        {stage === 'result' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border space-y-2">
              <Award className="w-10 h-10 text-amber-400 mx-auto" />
              <span className="text-[10px] uppercase font-mono text-theme-text-muted">Memory Test Result</span>
              <div className="text-3xl font-black font-mono text-theme-accent">
                {targetNumber.length - 1} Digits Recalled
              </div>
              <p className="text-xs text-theme-text-muted">
                Target was: <span className="font-mono text-emerald-400 font-bold">{targetNumber}</span>.<br />
                You typed: <span className="font-mono text-rose-400 font-bold">{userInput || '(blank)'}</span>.
              </p>
            </div>

            <button
              onClick={restart}
              className="w-full py-3.5 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Number Memory</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};



export const ReactionSpeedTest: React.FC = () => {
  const [state, setState] = useState<'idle' | 'waiting' | 'ready' | 'result' | 'early'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startTest = () => {
    setState('waiting');
    sounds.playPop();

    const randomDelay = Math.floor(Math.random() * 2500) + 1500; // 1.5s - 4.0s
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      startTimeRef.current = performance.now();
    }, randomDelay);
  };

  const handleClick = () => {
    if (state === 'idle' || state === 'result' || state === 'early') {
      startTest();
    } else if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setState('early');
      sounds.playBeep(200, 0.2);
    } else if (state === 'ready') {
      const elapsed = Math.round(performance.now() - startTimeRef.current);
      setReactionTime(elapsed);
      setHistory(prev => [elapsed, ...prev.slice(0, 4)]);
      setState('result');
      sounds.playSuccess();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div
        onClick={handleClick}
        className={`h-96 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none border transition-all duration-200 shadow-2xl ${
          state === 'idle'
            ? 'bg-theme-surface border-theme-border hover:border-theme-accent/40'
            : state === 'waiting'
            ? 'bg-rose-950/80 border-rose-500 text-rose-200'
            : state === 'ready'
            ? 'bg-emerald-600 border-emerald-400 text-white animate-pulse'
            : state === 'early'
            ? 'bg-amber-950/80 border-amber-500 text-amber-200'
            : 'bg-theme-surface border-theme-border'
        }`}
      >
        {state === 'idle' && (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent mx-auto">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-theme-text">Reaction Time Benchmark</h3>
            <p className="text-xs text-theme-text-muted max-w-xs">
              When the red box turns <span className="text-emerald-400 font-bold">GREEN</span>, tap as fast as possible.
            </p>
            <span className="inline-block px-4 py-2 rounded-xl bg-theme-accent text-white text-xs font-bold font-mono mt-2">
              Tap anywhere to start
            </span>
          </div>
        )}

        {state === 'waiting' && (
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-rose-300">Wait for GREEN...</h3>
            <p className="text-xs text-rose-200/70">Hold your finger ready</p>
          </div>
        )}

        {state === 'ready' && (
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-white uppercase tracking-wider">TAP NOW!</h3>
          </div>
        )}

        {state === 'early' && (
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-amber-400">Too Early!</h3>
            <p className="text-xs text-amber-200/70">You tapped before the color turned green.</p>
            <span className="text-xs font-mono underline">Tap to try again</span>
          </div>
        )}

        {state === 'result' && (
          <div className="space-y-3">
            <span className="text-xs uppercase font-mono text-theme-text-muted">Reaction Reflex Speed</span>
            <div className="text-5xl font-black font-mono text-emerald-400">{reactionTime} ms</div>
            <p className="text-xs text-theme-text-muted">
              {reactionTime! < 200
                ? '⚡ Lightning fast! Professional gamer reflexes.'
                : reactionTime! < 270
                ? '🎯 Excellent average reaction time.'
                : '🧠 Good attempt! Tap anywhere to retry.'}
            </p>
            <span className="text-xs font-mono text-theme-accent underline">Tap anywhere to retest</span>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border flex items-center justify-between text-xs font-mono text-theme-text-muted">
          <span>Recent Attempts: {history.map(h => `${h}ms`).join(' • ')}</span>
          <span>Best: {Math.min(...history)}ms</span>
        </div>
      )}
    </div>
  );
};



const COLORS = [
  { name: 'RED', hex: '#ef4444' },
  { name: 'BLUE', hex: '#3b82f6' },
  { name: 'GREEN', hex: '#10b981' },
  { name: 'YELLOW', hex: '#eab308' },
];

export const StroopAttentionTest: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentWord, setCurrentWord] = useState(COLORS[0]);
  const [currentInk, setCurrentInk] = useState(COLORS[1]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [finished, setFinished] = useState(false);

  const nextQuestion = () => {
    const randomWord = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomInk = COLORS[Math.floor(Math.random() * COLORS.length)];
    setCurrentWord(randomWord);
    setCurrentInk(randomInk);
  };

  const handleStart = () => {
    setStarted(true);
    setScore(0);
    setRound(0);
    setFinished(false);
    nextQuestion();
  };

  const handleChoice = (colorHex: string) => {
    // Correct if chosen color matches the INK color (not the word text)
    if (colorHex === currentInk.hex) {
      sounds.playSuccess();
      setScore(s => s + 1);
    } else {
      sounds.playBeep(220, 0.15);
    }

    if (round < 9) {
      setRound(r => r + 1);
      nextQuestion();
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base sm:text-lg font-bold text-theme-text">Stroop Attention & Focus Test</h2>
          </div>
          <span className="text-xs font-mono text-theme-text-muted">
            {started && !finished ? `Round ${round + 1} / 10` : 'Focus Training'}
          </span>
        </div>

        {!started || finished ? (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border space-y-3">
              {finished ? (
                <>
                  <Award className="w-12 h-12 text-amber-400 mx-auto" />
                  <span className="text-xs font-mono uppercase text-theme-text-muted">Test Result</span>
                  <div className="text-4xl font-black font-mono text-emerald-400">{score} / 10 Correct</div>
                  <p className="text-xs text-theme-text-muted">
                    {score >= 8
                      ? 'Exceptional mental agility and cognitive inhibition!'
                      : 'Good focus! Practice overcoming automatic reading reflexes.'}
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-bold text-theme-text">How to Play:</h3>
                  <p className="text-xs text-theme-text-muted max-w-sm mx-auto leading-relaxed">
                    Select the button matching the <span className="text-theme-accent font-bold">INK COLOR</span> of the text, ignoring what the word actually reads!
                  </p>
                </>
              )}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25 transition-all"
            >
              {finished ? 'Restart Focus Test' : 'Begin Stroop Test'}
            </button>
          </div>
        ) : (
          <div className="space-y-8 py-6">
            {/* Word Display with mismatched Ink Color */}
            <div className="text-5xl sm:text-6xl font-black tracking-wider uppercase font-mono select-none" style={{ color: currentInk.hex }}>
              {currentWord.name}
            </div>

            <div className="text-xs text-theme-text-muted font-mono">
              Select the INK color:
            </div>

            {/* 4 Color Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => handleChoice(c.hex)}
                  className="py-4 rounded-2xl font-mono text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: c.hex }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
