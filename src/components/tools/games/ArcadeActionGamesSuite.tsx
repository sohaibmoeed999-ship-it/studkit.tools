import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Award, Check, Circle, CircleDot, Copy, Download, Droplets, Eye, Flame, Gem, Grid, HelpCircle, Layers, Pause, Pipette, Play, RefreshCw, RotateCcw, Share2, Shuffle, Sparkle, Sparkles, Square, Target, Trophy, Volume2, VolumeX, XCircle, Zap } from 'lucide-react';
import { sounds } from '../../../utils/audio';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 5, y: 5 });
  const [dir, setDir] = useState<{ x: number; y: number }>({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const gridSize = 20;

  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ]);
    setFood({ x: 5, y: 5 });
    setDir({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setIsStarted(true);
  };

  useEffect(() => {
    if (!isStarted || gameOver) return;

    const moveSnake = () => {
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        sounds.playBeep(180, 0.3);
        setGameOver(true);
        return;
      }

      // Self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        sounds.playBeep(180, 0.3);
        setGameOver(true);
        return;
      }

      const nextSnake = [head, ...snake];

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        sounds.playPop();
        const nextScore = score + 10;
        setScore(nextScore);
        if (nextScore > highScore) setHighScore(nextScore);
        setFood({
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        });
      } else {
        nextSnake.pop();
      }

      setSnake(nextSnake);
    };

    const interval = setInterval(moveSnake, 130);
    return () => clearInterval(interval);
  }, [snake, dir, gameOver, isStarted, food, score, highScore]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && dir.y === 0) setDir({ x: 0, y: -1 });
      if (e.key === 'ArrowDown' && dir.y === 0) setDir({ x: 0, y: 1 });
      if (e.key === 'ArrowLeft' && dir.x === 0) setDir({ x: -1, y: 0 });
      if (e.key === 'ArrowRight' && dir.x === 0) setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dir]);

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none text-center">
      <div className="flex items-center justify-between pb-2 border-b border-theme-border">
        <div>
          <h3 className="text-xl font-black font-mono text-theme-text">Classic Snake</h3>
          <span className="text-[10px] text-theme-text-muted uppercase font-mono">Use Arrow Keys</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-mono text-xs font-bold text-emerald-400">Score: {score}</div>
          <button onClick={resetGame} className="p-2 rounded-xl bg-theme-surface border border-theme-border">
            <RefreshCw className="w-4 h-4 text-theme-text" />
          </button>
        </div>
      </div>

      {/* Grid Screen */}
      <div className="p-2.5 bg-theme-surface border-2 border-theme-border rounded-3xl shadow-2xl">
        <div className="relative w-full aspect-square bg-black/60 rounded-2xl overflow-hidden border border-theme-border/40">
          {snake.map((seg, idx) => (
            <div
              key={idx}
              className={`absolute rounded-sm ${idx === 0 ? 'bg-cyan-400 shadow-md shadow-cyan-400/50' : 'bg-cyan-600'}`}
              style={{
                left: `${(seg.x / gridSize) * 100}%`,
                top: `${(seg.y / gridSize) * 100}%`,
                width: `${100 / gridSize}%`,
                height: `${100 / gridSize}%`,
              }}
            />
          ))}

          {/* Food */}
          <div
            className="absolute bg-rose-500 rounded-full shadow-lg shadow-rose-500/80 animate-ping"
            style={{
              left: `${(food.x / gridSize) * 100}%`,
              top: `${(food.y / gridSize) * 100}%`,
              width: `${100 / gridSize}%`,
              height: `${100 / gridSize}%`,
            }}
          />
        </div>
      </div>

      {!isStarted && (
        <button
          onClick={resetGame}
          className="w-full py-3 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25"
        >
          Start Game
        </button>
      )}

      {gameOver && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-xs">
          Game Over! Final Score: {score}
        </div>
      )}

      {/* Mobile Touch Directional Controls */}
      <div className="grid grid-cols-3 gap-2 pt-1 max-w-[180px] mx-auto sm:hidden">
        <div />
        <button onClick={() => dir.y === 0 && setDir({ x: 0, y: -1 })} className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center">
          <ArrowUp className="w-4 h-4" />
        </button>
        <div />
        <button onClick={() => dir.x === 0 && setDir({ x: -1, y: 0 })} className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button onClick={() => dir.y === 0 && setDir({ x: 0, y: 1 })} className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center">
          <ArrowDown className="w-4 h-4" />
        </button>
        <button onClick={() => dir.x === 0 && setDir({ x: 1, y: 0 })} className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};



export const TicTacToeGame: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isVsAi, setIsVsAi] = useState(true);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.every(s => s !== null) ? 'Tie' : null;
  };

  const winner = calculateWinner(board);

  const handleClick = (idx: number) => {
    if (board[idx] || winner) return;

    sounds.playPop();
    const nextBoard = [...board];
    nextBoard[idx] = isXNext ? 'X' : 'O';
    setBoard(nextBoard);

    if (isVsAi && isXNext && !calculateWinner(nextBoard)) {
      // AI Move
      setTimeout(() => {
        const emptyIndices = nextBoard
          .map((v, i) => (v === null ? i : null))
          .filter((v): v is number => v !== null);

        if (emptyIndices.length > 0) {
          const aiChoice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
          nextBoard[aiChoice] = 'O';
          setBoard([...nextBoard]);
          sounds.playPop();
        }
      }, 300);
    } else if (!isVsAi) {
      setIsXNext(!isXNext);
    }
  };

  const restart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none text-center">
      <div className="flex items-center justify-between pb-2 border-b border-theme-border">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-theme-accent" />
          <h2 className="text-base sm:text-lg font-bold text-theme-text">Tic-Tac-Toe</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVsAi(!isVsAi)}
            className="px-2.5 py-1 rounded-lg bg-theme-surface border border-theme-border text-xs text-theme-text"
          >
            {isVsAi ? 'vs AI' : '2 Player'}
          </button>
          <button onClick={restart} className="p-2 rounded-lg bg-theme-surface border border-theme-border">
            <RefreshCw className="w-4 h-4 text-theme-text" />
          </button>
        </div>
      </div>

      <div className="p-4 bg-theme-surface border-2 border-theme-border rounded-3xl shadow-2xl">
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(idx)}
              className={`h-24 sm:h-28 rounded-2xl text-4xl sm:text-5xl font-mono font-black flex items-center justify-center transition-all ${
                cell === 'X'
                  ? 'bg-theme-bg text-cyan-400 border-2 border-cyan-500/40'
                  : cell === 'O'
                  ? 'bg-theme-bg text-rose-400 border-2 border-rose-500/40'
                  : 'bg-theme-bg/60 hover:bg-theme-surface-hover border border-theme-border'
              }`}
            >
              {cell}
            </button>
          ))}
        </div>
      </div>

      {winner && (
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border font-bold text-sm text-theme-accent">
          {winner === 'Tie' ? '🤝 Game Draw!' : `🎉 Winner: Player ${winner}!`}
        </div>
      )}
    </div>
  );
};



export const ConnectFourGame: React.FC = () => {
  const rows = 6;
  const cols = 7;
  const [grid, setGrid] = useState<(string | null)[][]>(
    Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'Red' | 'Yellow'>('Red');
  const [winner, setWinner] = useState<string | null>(null);

  const dropDisc = (colIndex: number) => {
    if (winner) return;

    for (let r = rows - 1; r >= 0; r--) {
      if (!grid[r][colIndex]) {
        sounds.playPop();
        const nextGrid = grid.map(row => [...row]);
        nextGrid[r][colIndex] = currentPlayer;
        setGrid(nextGrid);

        // Check victory
        if (checkWin(nextGrid, r, colIndex, currentPlayer)) {
          sounds.playSuccess();
          setWinner(currentPlayer);
        } else {
          setCurrentPlayer(currentPlayer === 'Red' ? 'Yellow' : 'Red');
        }
        break;
      }
    }
  };

  const checkWin = (g: (string | null)[][], r: number, c: number, p: string): boolean => {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ];
    for (const [dr, dc] of directions) {
      let count = 1;
      for (let i = 1; i < 4; i++) {
        const nr = r + dr * i;
        const nc = c + dc * i;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc] === p) count++;
        else break;
      }
      for (let i = 1; i < 4; i++) {
        const nr = r - dr * i;
        const nc = c - dc * i;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nr][nc] === p) count++;
        else break;
      }
      if (count >= 4) return true;
    }
    return false;
  };

  const restart = () => {
    setGrid(
      Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(null))
    );
    setCurrentPlayer('Red');
    setWinner(null);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto select-none text-center">
      <div className="flex items-center justify-between pb-2 border-b border-theme-border">
        <div className="flex items-center gap-2">
          <CircleDot className="w-5 h-5 text-theme-accent" />
          <h2 className="text-base sm:text-lg font-bold text-theme-text">Connect Four</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-theme-text-muted">Turn: {currentPlayer}</span>
          <button onClick={restart} className="p-2 rounded-xl bg-theme-surface border border-theme-border">
            <RefreshCw className="w-4 h-4 text-theme-text" />
          </button>
        </div>
      </div>

      <div className="p-4 bg-theme-surface border-2 border-theme-border rounded-3xl shadow-2xl">
        <div className="grid grid-cols-7 gap-1.5 bg-blue-900/60 p-2.5 rounded-2xl border border-blue-800">
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => dropDisc(c)}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-blue-950 transition-all ${
                  cell === 'Red'
                    ? 'bg-rose-500 shadow-md shadow-rose-500/50'
                    : cell === 'Yellow'
                    ? 'bg-amber-400 shadow-md shadow-amber-400/50'
                    : 'bg-slate-950 hover:bg-slate-900'
                }`}
              />
            ))
          )}
        </div>
      </div>

      {winner && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-sm animate-bounce">
          🎉 {winner} wins Connect Four!
        </div>
      )}
    </div>
  );
};



const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];

export const WaterSortGame: React.FC = () => {
  const [tubes, setTubes] = useState<string[][]>([
    ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'],
    ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'],
    ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
    [],
    [],
  ]);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);

  const handleTubeClick = (index: number) => {
    if (selectedTube === null) {
      if (tubes[index].length > 0) {
        setSelectedTube(index);
        sounds.playPop();
      }
    } else {
      if (selectedTube === index) {
        setSelectedTube(null);
        return;
      }

      const srcTube = [...tubes[selectedTube]];
      const destTube = [...tubes[index]];

      if (destTube.length < 4) {
        const colorToPour = srcTube[srcTube.length - 1];
        if (destTube.length === 0 || destTube[destTube.length - 1] === colorToPour) {
          srcTube.pop();
          destTube.push(colorToPour);

          const nextTubes = [...tubes];
          nextTubes[selectedTube] = srcTube;
          nextTubes[index] = destTube;
          setTubes(nextTubes);
          sounds.playPop();

          // Check Win Condition
          const won = nextTubes.every(
            t => t.length === 0 || (t.length === 4 && t.every(c => c === t[0]))
          );
          if (won) {
            sounds.playSuccess();
            setIsWon(true);
          }
        }
      }
      setSelectedTube(null);
    }
  };

  const resetGame = () => {
    setTubes([
      ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'],
      ['#3b82f6', '#ef4444', '#f59e0b', '#10b981'],
      ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'],
      [],
      [],
    ]);
    setSelectedTube(null);
    setIsWon(false);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto select-none text-center">
      <div className="flex items-center justify-between pb-2 border-b border-theme-border">
        <div className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-theme-accent" />
          <h2 className="text-base sm:text-lg font-bold text-theme-text">Water Color Sort</h2>
        </div>
        <button onClick={resetGame} className="p-2 rounded-xl bg-theme-surface border border-theme-border">
          <RefreshCw className="w-4 h-4 text-theme-text" />
        </button>
      </div>

      <div className="p-8 bg-theme-surface border-2 border-theme-border rounded-3xl shadow-2xl">
        <div className="flex items-end justify-center gap-4 sm:gap-6 min-h-[220px]">
          {tubes.map((tube, tIdx) => (
            <button
              key={tIdx}
              onClick={() => handleTubeClick(tIdx)}
              className={`w-12 sm:w-14 h-44 rounded-b-3xl border-2 flex flex-col-reverse p-1 gap-1 transition-all transform ${
                selectedTube === tIdx
                  ? '-translate-y-4 border-theme-accent ring-4 ring-cyan-400/30'
                  : 'border-theme-border hover:border-theme-accent/50 bg-black/30'
              }`}
            >
              {tube.map((col, cIdx) => (
                <div
                  key={cIdx}
                  className="w-full h-9 rounded-xl shadow-inner transition-all duration-300"
                  style={{ backgroundColor: col }}
                />
              ))}
            </button>
          ))}
        </div>
      </div>

      {isWon && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-sm animate-bounce">
          🏆 Puzzle Solved! All colors sorted cleanly.
        </div>
      )}
    </div>
  );
};



const COLOR_NAMES = ['RED', 'BLUE', 'GREEN', 'PURPLE'];
const COLOR_HEXES = ['#ef4444', '#3b82f6', '#10b981', '#a855f7'];

export const ColorMatchGame: React.FC = () => {
  const [word, setWord] = useState('RED');
  const [colorHex, setColorHex] = useState('#ef4444');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextRound = () => {
    const randomWord = COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)];
    const isMatch = Math.random() > 0.5;
    const targetHex = isMatch
      ? COLOR_HEXES[COLOR_NAMES.indexOf(randomWord)]
      : COLOR_HEXES[Math.floor(Math.random() * COLOR_HEXES.length)];

    setWord(randomWord);
    setColorHex(targetHex);
  };

  const handleAnswer = (userSaysMatch: boolean) => {
    if (!isPlaying) return;
    const actualMatch = COLOR_HEXES[COLOR_NAMES.indexOf(word)] === colorHex;
    if (userSaysMatch === actualMatch) {
      sounds.playSuccess();
      setScore(s => s + 1);
    } else {
      sounds.playBeep(200, 0.1);
    }
    nextRound();
  };

  const start = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(20);
    nextRound();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setIsPlaying(false);
            sounds.playTimerDone();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Pipette className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base font-bold text-theme-text">Color Match Reflex</h2>
          </div>
          <span className="font-mono text-xs font-bold text-amber-400">⏳ {timeLeft}s</span>
        </div>

        {!isPlaying ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-1">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted">High Score</span>
              <span className="text-3xl font-black text-emerald-400 block">{score}</span>
            </div>
            <button
              onClick={start}
              className="w-full py-3.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25"
            >
              Start 20s Reflex Run
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-wider select-none py-4" style={{ color: colorHex }}>
              {word}
            </div>

            <div className="text-xs text-theme-text-muted">Does the word match the ink color?</div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAnswer(false)}
                className="py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-md"
              >
                NO ✕
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md"
              >
                YES ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export const ReactionTapGame: React.FC = () => {
  const [activeNode, setActiveNode] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isRunning, setIsRunning] = useState(false);

  const spawnTarget = () => {
    setActiveNode(Math.floor(Math.random() * 9));
  };

  const handleTap = (idx: number) => {
    if (!isRunning) return;
    if (idx === activeNode) {
      sounds.playPop();
      setScore(s => s + 1);
      spawnTarget();
    }
  };

  const start = () => {
    setIsRunning(true);
    setScore(0);
    setTimeLeft(15);
    spawnTarget();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setIsRunning(false);
            sounds.playTimerDone();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base font-bold text-theme-text">Reaction Tap Sprint</h2>
          </div>
          <span className="font-mono text-xs font-bold text-amber-400">⏳ {timeLeft}s</span>
        </div>

        {!isRunning ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-theme-bg border border-theme-border space-y-1">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted">High Score</span>
              <span className="text-3xl font-black text-emerald-400 block">{score}</span>
            </div>
            <button
              onClick={start}
              className="w-full py-3.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-lg shadow-theme-accent/25"
            >
              Start 15s Tap Rush
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 p-3 bg-theme-bg rounded-2xl border border-theme-border">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <button
                key={idx}
                onClick={() => handleTap(idx)}
                className={`h-20 sm:h-24 rounded-2xl border-2 transition-all transform active:scale-95 flex items-center justify-center text-3xl ${
                  activeNode === idx
                    ? 'bg-cyan-500 border-cyan-400 shadow-lg shadow-cyan-400/50 scale-105'
                    : 'bg-theme-surface border-theme-border'
                }`}
              >
                {activeNode === idx ? '🎯' : ''}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};



const PADS = [
  { id: 0, color: 'bg-rose-500 active:bg-rose-400', soundFreq: 261.63 },
  { id: 1, color: 'bg-cyan-500 active:bg-cyan-400', soundFreq: 329.63 },
  { id: 2, color: 'bg-emerald-500 active:bg-emerald-400', soundFreq: 392.0 },
  { id: 3, color: 'bg-amber-500 active:bg-amber-400', soundFreq: 523.25 },
];

export const PatternRepeatGame: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([0, 2, 1]);
  const [userStep, setUserStep] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePad, setActivePad] = useState<number | null>(null);

  const startNextLevel = (seq: number[]) => {
    const nextSeq = [...seq, Math.floor(Math.random() * 4)];
    setSequence(nextSeq);
    setUserStep(0);
    setLevel(nextSeq.length);
    playSequence(nextSeq);
  };

  const playSequence = (seq: number[]) => {
    setIsPlaying(true);
    seq.forEach((padId, i) => {
      setTimeout(() => {
        setActivePad(padId);
        sounds.playBeep(PADS[padId].soundFreq, 0.25);
        setTimeout(() => setActivePad(null), 300);
        if (i === seq.length - 1) setIsPlaying(false);
      }, (i + 1) * 600);
    });
  };

  const handlePadClick = (id: number) => {
    if (isPlaying) return;
    sounds.playBeep(PADS[id].soundFreq, 0.15);

    if (id === sequence[userStep]) {
      if (userStep + 1 === sequence.length) {
        sounds.playSuccess();
        setTimeout(() => startNextLevel(sequence), 500);
      } else {
        setUserStep(s => s + 1);
      }
    } else {
      sounds.playBeep(150, 0.3);
      alert(`Game Over! You reached Level ${level}.`);
      setSequence([0]);
      setUserStep(0);
      setLevel(1);
    }
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base font-bold text-theme-text">Pattern Repeat (Simon)</h2>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">Level {level}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-theme-bg rounded-3xl border border-theme-border max-w-[260px] mx-auto">
          {PADS.map(pad => (
            <button
              key={pad.id}
              onClick={() => handlePadClick(pad.id)}
              disabled={isPlaying}
              className={`w-28 h-28 rounded-2xl transition-all duration-150 transform ${pad.color} ${
                activePad === pad.id ? 'brightness-150 scale-105 shadow-2xl ring-4 ring-white' : 'opacity-80'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => playSequence(sequence)}
          disabled={isPlaying}
          className="w-full py-3 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs font-semibold text-theme-text"
        >
          Replay Sequence Audio
        </button>
      </div>
    </div>
  );
};



const GEMS = ['💎', '🔮', '⭐', '🍀'];

export const TileMatchGame: React.FC = () => {
  const [board, setBoard] = useState<string[][]>(
    Array(5)
      .fill(0)
      .map(() =>
        Array(5)
          .fill(0)
          .map(() => GEMS[Math.floor(Math.random() * GEMS.length)])
      )
  );
  const [score, setScore] = useState(0);

  const handleTile = (r: number, c: number) => {
    sounds.playPop();
    const next = board.map(row => [...row]);
    next[r][c] = GEMS[Math.floor(Math.random() * GEMS.length)];
    setScore(s => s + 10);
    setBoard(next);
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Gem className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base font-bold text-theme-text">Tile Match Arena</h2>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">Score: {score}</span>
        </div>

        <div className="grid grid-cols-5 gap-2 p-3 bg-theme-bg rounded-2xl border border-theme-border">
          {board.map((row, r) =>
            row.map((gem, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleTile(r, c)}
                className="h-12 sm:h-14 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xl flex items-center justify-center transition-transform active:scale-90"
              >
                {gem}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};



export const BubblePopGame: React.FC = () => {
  const totalBubbles = 48;
  const [popped, setPopped] = useState<boolean[]>(Array(totalBubbles).fill(false));
  const [popCount, setPopCount] = useState(0);

  const popBubble = (idx: number) => {
    if (!popped[idx]) {
      sounds.playPop();
      const next = [...popped];
      next[idx] = true;
      setPopped(next);
      setPopCount(c => c + 1);
    }
  };

  const resetAll = () => {
    sounds.playPop();
    setPopped(Array(totalBubbles).fill(false));
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto text-center select-none">
      <div className="flex items-center justify-between pb-4 border-b border-theme-border">
        <div className="flex items-center gap-2">
          <Sparkle className="w-5 h-5 text-theme-accent" />
          <h2 className="text-base sm:text-lg font-bold text-theme-text">Bubble Wrap Stress Relief</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-400 font-bold">Popped: {popCount}</span>
          <button
            onClick={resetAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-text"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Unpop All</span>
          </button>
        </div>
      </div>

      <div className="p-6 bg-theme-surface border border-theme-border rounded-3xl shadow-2xl">
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 sm:gap-4 justify-items-center">
          {popped.map((isPop, idx) => (
            <button
              key={idx}
              onClick={() => popBubble(idx)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 transition-all transform active:scale-90 flex items-center justify-center ${
                isPop
                  ? 'bg-transparent border-theme-border/40 scale-95 shadow-inner'
                  : 'bg-gradient-to-tr from-cyan-500/30 via-cyan-400/20 to-transparent border-cyan-400/60 shadow-lg shadow-cyan-500/20 hover:scale-105 animate-pulse'
              }`}
            >
              {!isPop && <div className="w-2.5 h-2.5 rounded-full bg-white/60 -mt-3 -ml-3" />}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-theme-text-muted font-mono">
        Click or tap individual bubbles for satisfying stress relief before exams.
      </p>
    </div>
  );
};
