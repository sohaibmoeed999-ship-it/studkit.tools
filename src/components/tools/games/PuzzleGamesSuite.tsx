import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Award, Bomb, Box, Check, FileSpreadsheet, Flag, Gem, Grid, HelpCircle, Milestone, Play, RefreshCw, RotateCcw, Shuffle, Target, Trophy } from 'lucide-react';
import { sounds } from '../../../utils/audio';

const SAMPLE_SUDOKU = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

export const SudokuGame: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>(SAMPLE_SUDOKU.map(r => [...r]));
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);

  const handleCellClick = (r: number, c: number) => {
    setSelectedCell({ r, c });
    sounds.playPop();
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    if (SAMPLE_SUDOKU[r][c] !== 0) return; // initial fixed number

    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = num;
    setGrid(newGrid);
    sounds.playPop();
  };

  const resetGame = () => {
    setGrid(SAMPLE_SUDOKU.map(r => [...r]));
    setSelectedCell(null);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto select-none">
      <div className="flex items-center justify-between pb-2 border-b border-theme-border">
        <div>
          <h2 className="text-xl font-bold text-theme-text font-mono">Sudoku Master</h2>
          <span className="text-[10px] text-theme-text-muted uppercase font-mono">Classic 9x9 Logic</span>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-xs text-theme-text"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 9x9 Grid */}
      <div className="p-2.5 bg-theme-surface border-2 border-theme-border rounded-3xl shadow-2xl">
        <div className="grid grid-cols-9 gap-0.5 sm:gap-1 bg-theme-border p-1 rounded-2xl">
          {grid.map((row, r) =>
            row.map((val, c) => {
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const isInitial = SAMPLE_SUDOKU[r][c] !== 0;
              const isThickRight = (c + 1) % 3 === 0 && c !== 8;
              const isThickBottom = (r + 1) % 3 === 0 && r !== 8;

              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleCellClick(r, c)}
                  className={`h-8 sm:h-10 text-xs sm:text-sm font-mono font-bold flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-theme-accent text-white ring-2 ring-cyan-400 z-10'
                      : isInitial
                      ? 'bg-theme-bg text-theme-text font-black'
                      : val !== 0
                      ? 'bg-theme-surface text-cyan-400'
                      : 'bg-theme-bg/90 text-transparent hover:bg-theme-surface-hover'
                  } ${isThickRight ? 'mr-1' : ''} ${isThickBottom ? 'mb-1' : ''}`}
                >
                  {val !== 0 ? val : ''}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Number Pad 1-9 & Clear */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <button
            key={n}
            onClick={() => handleNumberInput(n)}
            className="py-2.5 rounded-xl bg-theme-surface hover:bg-theme-accent hover:text-white border border-theme-border text-xs sm:text-sm font-mono font-bold text-theme-text transition-all"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => handleNumberInput(0)}
          className="py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-xs font-mono font-bold text-rose-400"
        >
          ✕
        </button>
      </div>
    </div>
  );
};



export const Game2048: React.FC = () => {
  const [board, setBoard] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 2, 0, 0],
    [0, 0, 2, 0],
    [0, 0, 0, 0],
  ]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initBoard = () => {
    const b = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    addRandom(b);
    addRandom(b);
    setBoard(b);
    setScore(0);
    setGameOver(false);
  };

  const addRandom = (b: number[][]) => {
    const empty: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length === 0) return;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    b[r][c] = Math.random() > 0.1 ? 2 : 4;
  };

  const slideRow = (row: number[]): { newRow: number[]; gained: number } => {
    let arr = row.filter(x => x !== 0);
    let gained = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        gained += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(x => x !== 0);
    while (arr.length < 4) arr.push(0);
    return { newRow: arr, gained };
  };

  const move = (dir: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;
    let newBoard = board.map(r => [...r]);
    let totalGained = 0;
    let changed = false;

    if (dir === 'left') {
      for (let r = 0; r < 4; r++) {
        const { newRow, gained } = slideRow(newBoard[r]);
        if (newRow.some((val, idx) => val !== newBoard[r][idx])) changed = true;
        newBoard[r] = newRow;
        totalGained += gained;
      }
    } else if (dir === 'right') {
      for (let r = 0; r < 4; r++) {
        const reversed = [...newBoard[r]].reverse();
        const { newRow, gained } = slideRow(reversed);
        const normal = newRow.reverse();
        if (normal.some((val, idx) => val !== newBoard[r][idx])) changed = true;
        newBoard[r] = normal;
        totalGained += gained;
      }
    } else if (dir === 'up') {
      for (let c = 0; c < 4; c++) {
        const col = [newBoard[0][c], newBoard[1][c], newBoard[2][c], newBoard[3][c]];
        const { newRow, gained } = slideRow(col);
        for (let r = 0; r < 4; r++) {
          if (newBoard[r][c] !== newRow[r]) changed = true;
          newBoard[r][c] = newRow[r];
        }
        totalGained += gained;
      }
    } else if (dir === 'down') {
      for (let c = 0; c < 4; c++) {
        const col = [newBoard[3][c], newBoard[2][c], newBoard[1][c], newBoard[0][c]];
        const { newRow, gained } = slideRow(col);
        const normal = newRow.reverse();
        for (let r = 0; r < 4; r++) {
          if (newBoard[r][c] !== normal[r]) changed = true;
          newBoard[r][c] = normal[r];
        }
        totalGained += gained;
      }
    }

    if (changed) {
      sounds.playPop();
      addRandom(newBoard);
      setBoard(newBoard);
      const nextScore = score + totalGained;
      setScore(nextScore);
      if (nextScore > bestScore) setBestScore(nextScore);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [board, score, gameOver]);

  const tileColors: Record<number, string> = {
    0: 'bg-theme-bg/60 text-transparent',
    2: 'bg-slate-800 text-cyan-300 font-bold',
    4: 'bg-slate-700 text-cyan-200 font-bold',
    8: 'bg-amber-600 text-white font-bold',
    16: 'bg-amber-500 text-white font-bold',
    32: 'bg-orange-500 text-white font-black',
    64: 'bg-rose-500 text-white font-black',
    128: 'bg-yellow-500 text-white font-black',
    256: 'bg-yellow-400 text-slate-900 font-black',
    512: 'bg-emerald-500 text-white font-black',
    1024: 'bg-emerald-400 text-slate-900 font-black',
    2048: 'bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-400/50',
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none">
      {/* Score Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-mono tracking-wider text-theme-text">2048</h2>
          <span className="text-[10px] uppercase font-mono text-theme-text-muted">Use arrow keys</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-center font-mono">
            <span className="text-[9px] uppercase text-theme-text-muted block">Score</span>
            <span className="text-xs font-bold text-theme-accent">{score}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-center font-mono">
            <span className="text-[9px] uppercase text-theme-text-muted block">Best</span>
            <span className="text-xs font-bold text-amber-400">{bestScore}</span>
          </div>
          <button
            onClick={initBoard}
            className="p-2 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-theme-text"
            title="Reset Game"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4x4 Grid Board */}
      <div className="p-3 bg-theme-surface border-2 border-theme-border rounded-3xl shadow-2xl">
        <div className="grid grid-cols-4 gap-2.5">
          {board.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`h-16 sm:h-20 rounded-2xl flex items-center justify-center font-mono text-lg sm:text-2xl transition-all duration-100 ${
                  tileColors[val] || 'bg-cyan-500 text-white font-black'
                }`}
              >
                {val !== 0 ? val : ''}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Touch Arrow Controls for Mobile */}
      <div className="grid grid-cols-3 gap-2 pt-2 max-w-[200px] mx-auto sm:hidden">
        <div />
        <button onClick={() => move('up')} className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center">
          <ArrowUp className="w-4 h-4" />
        </button>
        <div />
        <button onClick={() => move('left')} className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button onClick={() => move('down')} className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center">
          <ArrowDown className="w-4 h-4" />
        </button>
        <button onClick={() => move('right')} className="p-3 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};



interface Cell {
  r: number;
  c: number;
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  count: number;
}

export const LogicMinesGame: React.FC = () => {
  const rows = 8;
  const cols = 8;
  const minesCount = 8;

  const createBoard = (): Cell[][] => {
    const board: Cell[][] = Array(rows)
      .fill(0)
      .map((_, r) =>
        Array(cols)
          .fill(0)
          .map((_, c) => ({
            r,
            c,
            isMine: false,
            isOpen: false,
            isFlagged: false,
            count: 0,
          }))
      );

    let placed = 0;
    while (placed < minesCount) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!board[r][c].isMine) {
        board[r][c].isMine = true;
        placed++;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!board[r][c].isMine) {
          let cnt = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) {
                cnt++;
              }
            }
          }
          board[r][c].count = cnt;
        }
      }
    }
    return board;
  };

  const [grid, setGrid] = useState<Cell[][]>(createBoard());
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flagMode, setFlagMode] = useState(false);

  const openCell = (r: number, c: number) => {
    if (gameOver || gameWon || grid[r][c].isFlagged || grid[r][c].isOpen) return;

    if (flagMode) {
      toggleFlag(r, c);
      return;
    }

    const next = grid.map(row => row.map(cell => ({ ...cell })));

    if (next[r][c].isMine) {
      sounds.playBeep(180, 0.3);
      // Reveal all mines
      next.forEach(row =>
        row.forEach(cell => {
          if (cell.isMine) cell.isOpen = true;
        })
      );
      setGrid(next);
      setGameOver(true);
      return;
    }

    sounds.playPop();
    // Flood fill empty cells
    const reveal = (cr: number, cc: number) => {
      if (cr < 0 || cr >= rows || cc < 0 || cc >= cols || next[cr][cc].isOpen || next[cr][cc].isFlagged)
        return;
      next[cr][cc].isOpen = true;
      if (next[cr][cc].count === 0 && !next[cr][cc].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(cr + dr, cc + dc);
          }
        }
      }
    };
    reveal(r, c);
    setGrid(next);

    // Check win condition
    const unrevealedSafe = next.flat().filter(cell => !cell.isMine && !cell.isOpen).length;
    if (unrevealedSafe === 0) {
      sounds.playSuccess();
      setGameWon(true);
    }
  };

  const toggleFlag = (r: number, c: number) => {
    if (gameOver || gameWon || grid[r][c].isOpen) return;
    sounds.playPop();
    const next = grid.map(row => row.map(cell => ({ ...cell })));
    next[r][c].isFlagged = !next[r][c].isFlagged;
    setGrid(next);
  };

  const restart = () => {
    setGrid(createBoard());
    setGameOver(false);
    setGameWon(false);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto select-none text-center">
      <div className="flex items-center justify-between pb-2 border-b border-theme-border">
        <div className="flex items-center gap-2">
          <Bomb className="w-5 h-5 text-theme-accent" />
          <h2 className="text-base sm:text-lg font-bold text-theme-text">Logic Mines</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFlagMode(!flagMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              flagMode ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold' : 'bg-theme-surface border-theme-border text-theme-text'
            }`}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Flag: {flagMode ? 'ON' : 'OFF'}</span>
          </button>
          <button onClick={restart} className="p-2 rounded-xl bg-theme-surface border border-theme-border">
            <RefreshCw className="w-4 h-4 text-theme-text" />
          </button>
        </div>
      </div>

      <div className="p-3 bg-theme-surface border-2 border-theme-border rounded-3xl shadow-2xl">
        <div className="grid grid-cols-8 gap-1">
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => openCell(r, c)}
                onContextMenu={e => {
                  e.preventDefault();
                  toggleFlag(r, c);
                }}
                className={`h-10 sm:h-12 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
                  cell.isOpen
                    ? cell.isMine
                      ? 'bg-rose-500 text-white animate-bounce'
                      : 'bg-theme-bg/80 text-theme-text border border-theme-border/40'
                    : 'bg-theme-surface-hover hover:bg-theme-accent/30 border border-theme-border shadow-sm'
                }`}
              >
                {cell.isOpen ? (
                  cell.isMine ? (
                    '💣'
                  ) : cell.count > 0 ? (
                    <span
                      style={{
                        color:
                          cell.count === 1
                            ? '#38bdf8'
                            : cell.count === 2
                            ? '#34d399'
                            : cell.count === 3
                            ? '#f87171'
                            : '#c084fc',
                      }}
                    >
                      {cell.count}
                    </span>
                  ) : (
                    ''
                  )
                ) : cell.isFlagged ? (
                  '🚩'
                ) : (
                  ''
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {(gameOver || gameWon) && (
        <div
          className={`p-4 rounded-2xl border font-bold text-sm ${
            gameWon
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          {gameWon ? '🏆 Incredible! You cleared all safe cells!' : '💥 Boom! You clicked a mine. Try again!'}
        </div>
      )}
    </div>
  );
};



interface MazeLevel {
  id: number;
  name: string;
  grid: number[][]; // 0: path, 1: wall, 2: gem
  start: { r: number; c: number };
  target: { r: number; c: number };
}

const MAZE_LEVELS: MazeLevel[] = [
  {
    id: 1,
    name: 'Route 1: Dual Fork Crossroads',
    start: { r: 0, c: 0 },
    target: { r: 6, c: 6 },
    grid: [
      [0, 0, 0, 1, 0, 2, 0],
      [0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [1, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    id: 2,
    name: 'Route 2: S-Curve Spiral Labyrinth',
    start: { r: 0, c: 0 },
    target: { r: 6, c: 6 },
    grid: [
      [0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 2, 0, 0],
      [1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    id: 3,
    name: 'Route 3: Multi-Route Matrix',
    start: { r: 0, c: 0 },
    target: { r: 6, c: 6 },
    grid: [
      [0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0],
      [1, 0, 1, 1, 1, 0, 1],
      [0, 0, 0, 2, 0, 0, 0],
      [1, 0, 1, 1, 1, 0, 1],
      [0, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0],
    ],
  },
  {
    id: 4,
    name: 'Route 4: The Diamond Vault',
    start: { r: 0, c: 0 },
    target: { r: 6, c: 6 },
    grid: [
      [0, 0, 1, 0, 0, 2, 0],
      [1, 0, 1, 0, 1, 1, 0],
      [0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 2, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 1, 0, 1],
      [0, 2, 0, 0, 1, 0, 0],
    ],
  },
  {
    id: 5,
    name: 'Route 5: Master Crypt Labyrinth',
    start: { r: 0, c: 0 },
    target: { r: 6, c: 6 },
    grid: [
      [0, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 1, 0],
      [0, 1, 1, 2, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 0, 1, 1],
      [2, 0, 0, 1, 0, 0, 0],
    ],
  },
];

export const MazeGame: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = MAZE_LEVELS[currentLevelIdx];

  const [player, setPlayer] = useState(currentLevel.start);
  const [gridState, setGridState] = useState<number[][]>(currentLevel.grid);
  const [steps, setSteps] = useState(0);
  const [gemsCollected, setGemsCollected] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    setPlayer(currentLevel.start);
    setGridState(currentLevel.grid.map(row => [...row]));
    setSteps(0);
    setGemsCollected(0);
    setWon(false);
  }, [currentLevelIdx]);

  const movePlayer = (dr: number, dc: number) => {
    if (won) return;
    const nr = player.r + dr;
    const nc = player.c + dc;

    if (
      nr >= 0 &&
      nr < gridState.length &&
      nc >= 0 &&
      nc < gridState[0].length &&
      gridState[nr][nc] !== 1
    ) {
      sounds.playPop();
      setSteps(s => s + 1);

      // Check if stepped on a gem
      if (gridState[nr][nc] === 2) {
        setGemsCollected(g => g + 1);
        const updated = gridState.map(r => [...r]);
        updated[nr][nc] = 0;
        setGridState(updated);
        try {
          sounds.playSuccess();
        } catch {}
      }

      setPlayer({ r: nr, c: nc });

      if (nr === currentLevel.target.r && nc === currentLevel.target.c) {
        sounds.playSuccess();
        setWon(true);
      }
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') movePlayer(-1, 0);
      if (e.key === 'ArrowDown' || e.key === 's') movePlayer(1, 0);
      if (e.key === 'ArrowLeft' || e.key === 'a') movePlayer(0, -1);
      if (e.key === 'ArrowRight' || e.key === 'd') movePlayer(0, 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [player, won, gridState]);

  const handleRestart = () => {
    setPlayer(currentLevel.start);
    setGridState(currentLevel.grid.map(row => [...row]));
    setSteps(0);
    setGemsCollected(0);
    setWon(false);
  };

  const handleNextRoute = () => {
    setCurrentLevelIdx(prev => (prev + 1) % MAZE_LEVELS.length);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto select-none text-center">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-theme-border">
        <div className="flex items-center gap-2">
          <Milestone className="w-5 h-5 text-theme-accent" />
          <div>
            <h2 className="text-base font-bold text-theme-text text-left">Maze Explorer</h2>
            <span className="text-[10px] font-mono text-cyan-400 block -mt-0.5 text-left">
              {currentLevel.name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-theme-text-muted hover:text-theme-text transition-all cursor-pointer"
            title="Restart Route"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Route Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {MAZE_LEVELS.map((lvl, idx) => (
          <button
            key={lvl.id}
            onClick={() => setCurrentLevelIdx(idx)}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              currentLevelIdx === idx
                ? 'bg-theme-accent text-white border-theme-accent shadow-sm'
                : 'bg-theme-bg border-theme-border text-theme-text-muted hover:text-theme-text'
            }`}
          >
            Route {idx + 1}
          </button>
        ))}
      </div>

      {/* Telemetry Bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-theme-bg border border-theme-border text-xs font-mono">
        <span className="text-theme-text-muted font-bold">
          Steps: <span className="text-theme-accent">{steps}</span>
        </span>
        <span className="text-amber-400 font-bold flex items-center gap-1">
          <Gem className="w-3.5 h-3.5" /> Gems: {gemsCollected}
        </span>
        <span className="text-emerald-400 font-bold">
          Target: ({currentLevel.target.r}, {currentLevel.target.c})
        </span>
      </div>

      {/* 7x7 Interactive Maze Grid */}
      <div className="p-3 bg-theme-surface border-2 border-theme-border rounded-3xl shadow-2xl">
        <div className="grid grid-cols-7 gap-1.5 bg-black/50 p-2 rounded-2xl">
          {gridState.map((row, r) =>
            row.map((val, c) => {
              const isPlayer = player.r === r && player.c === c;
              const isTarget = currentLevel.target.r === r && currentLevel.target.c === c;
              const isGem = val === 2;
              const isWall = val === 1;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`h-11 sm:h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                    isPlayer
                      ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/60 scale-105 z-10 animate-pulse'
                      : isTarget
                      ? 'bg-emerald-500 text-white animate-bounce'
                      : isGem
                      ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                      : isWall
                      ? 'bg-slate-800/90 shadow-inner'
                      : 'bg-slate-950/40 hover:bg-slate-900/60'
                  }`}
                >
                  {isPlayer ? '🧑‍🎓' : isTarget ? '🏁' : isGem ? '💎' : ''}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Touch / D-Pad Navigation Controls for Mobile */}
      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto pt-1">
        <div />
        <button
          onClick={() => movePlayer(-1, 0)}
          className="p-3 rounded-2xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-theme-text font-bold active:scale-90 transition-all cursor-pointer shadow-sm"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => movePlayer(0, -1)}
          className="p-3 rounded-2xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-theme-text font-bold active:scale-90 transition-all cursor-pointer shadow-sm"
        >
          ◀
        </button>
        <button
          onClick={() => movePlayer(1, 0)}
          className="p-3 rounded-2xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-theme-text font-bold active:scale-90 transition-all cursor-pointer shadow-sm"
        >
          ▼
        </button>
        <button
          onClick={() => movePlayer(0, 1)}
          className="p-3 rounded-2xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border text-theme-text font-bold active:scale-90 transition-all cursor-pointer shadow-sm"
        >
          ▶
        </button>
      </div>

      {won && (
        <div className="p-5 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 space-y-3 animate-scale-in">
          <div className="flex items-center justify-center gap-2 text-base font-black">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Route Solved in {steps} Steps!</span>
          </div>
          <p className="text-xs text-emerald-200">
            Collected {gemsCollected} bonus diamonds. Ready for the next maze route?
          </p>
          <button
            onClick={handleNextRoute}
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <span>Play Next Route</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};



export const BlockPuzzleGame: React.FC = () => {
  const [grid, setGrid] = useState<boolean[][]>(
    Array(8)
      .fill(false)
      .map(() => Array(8).fill(false))
  );
  const [score, setScore] = useState(0);

  const placeTile = (r: number, c: number) => {
    if (grid[r][c]) return;
    sounds.playPop();

    const next = grid.map(row => [...row]);
    next[r][c] = true;

    // Check full rows or columns
    let clearedLines = 0;
    for (let i = 0; i < 8; i++) {
      if (next[i].every(Boolean)) {
        next[i] = Array(8).fill(false);
        clearedLines++;
      }
    }

    if (clearedLines > 0) {
      sounds.playSuccess();
      setScore(s => s + clearedLines * 100);
    }

    setGrid(next);
  };

  const restart = () => {
    setGrid(
      Array(8)
        .fill(false)
        .map(() => Array(8).fill(false))
    );
    setScore(0);
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base font-bold text-theme-text">8x8 Block Grid</h2>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">Score: {score}</span>
        </div>

        <div className="p-3 bg-black/40 rounded-2xl border border-theme-border">
          <div className="grid grid-cols-8 gap-1">
            {grid.map((row, r) =>
              row.map((val, c) => (
                <button
                  key={`${r}-${c}`}
                  onClick={() => placeTile(r, c)}
                  className={`h-9 rounded-lg border transition-all ${
                    val
                      ? 'bg-cyan-500 border-cyan-400 shadow-md shadow-cyan-500/40'
                      : 'bg-theme-bg/80 border-theme-border/40 hover:bg-theme-surface'
                  }`}
                />
              ))
            )}
          </div>
        </div>

        <button
          onClick={restart}
          className="w-full py-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Grid</span>
        </button>
      </div>
    </div>
  );
};



export const PathPuzzleGame: React.FC = () => {
  // 3x3 pipe tiles with angles: 0, 90, 180, 270 deg
  const [angles, setAngles] = useState<number[]>([90, 0, 270, 180, 90, 0, 270, 180, 0]);

  const rotate = (idx: number) => {
    sounds.playPop();
    const next = [...angles];
    next[idx] = (next[idx] + 90) % 360;
    setAngles(next);
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base font-bold text-theme-text">Path & Pipe Connector</h2>
          </div>
          <span className="text-xs font-mono text-theme-text-muted">Tap to Rotate</span>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 bg-theme-bg rounded-2xl border border-theme-border max-w-[280px] mx-auto">
          {angles.map((ang, idx) => (
            <button
              key={idx}
              onClick={() => rotate(idx)}
              className="w-20 h-20 rounded-2xl bg-theme-surface hover:bg-theme-surface-hover border border-theme-border flex items-center justify-center transition-transform duration-200"
              style={{ transform: `rotate(${ang}deg)` }}
            >
              <div className="w-12 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/40" />
            </button>
          ))}
        </div>

        <p className="text-xs text-theme-text-muted">
          Align all conduit paths to complete the power circuit.
        </p>
      </div>
    </div>
  );
};



const WORDS_LEVEL = {
  letters: ['S', 'T', 'U', 'D', 'Y'],
  targets: ['STUDY', 'DUST', 'RUST', 'SUIT'],
};

export const WordConnectGame: React.FC = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const addLetter = (l: string) => {
    sounds.playPop();
    setCurrentWord(w => w + l);
  };

  const submitWord = () => {
    if (WORDS_LEVEL.targets.includes(currentWord) && !foundWords.includes(currentWord)) {
      sounds.playSuccess();
      setFoundWords([...foundWords, currentWord]);
      setScore(s => s + 10);
      setCurrentWord('');
    } else {
      sounds.playBeep(220, 0.15);
      setCurrentWord('');
    }
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base font-bold text-theme-text">Word Connect</h2>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">Score: {score}</span>
        </div>

        {/* Found Words Slots */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {WORDS_LEVEL.targets.map(tw => (
            <div
              key={tw}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                foundWords.includes(tw)
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-theme-bg border-theme-border text-theme-text-muted/40'
              }`}
            >
              {foundWords.includes(tw) ? tw : '•'.repeat(tw.length)}
            </div>
          ))}
        </div>

        {/* Current typing buffer */}
        <div className="h-12 flex items-center justify-center font-mono text-2xl font-black text-theme-accent tracking-widest">
          {currentWord || <span className="text-theme-text-muted/30 text-base font-normal">Tap letters below</span>}
        </div>

        {/* Letter Wheel / Buttons */}
        <div className="flex justify-center gap-2">
          {WORDS_LEVEL.letters.map((l, i) => (
            <button
              key={i}
              onClick={() => addLetter(l)}
              className="w-11 h-11 rounded-2xl bg-theme-bg hover:bg-theme-surface-hover border border-theme-border text-sm font-black font-mono text-theme-text active:scale-95"
            >
              {l}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentWord('')}
            className="flex-1 py-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text"
          >
            Clear
          </button>
          <button
            onClick={submitWord}
            className="flex-1 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold shadow-md shadow-theme-accent/20"
          >
            Submit Word
          </button>
        </div>
      </div>
    </div>
  );
};



export const MissingNumberGame: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

  const puzzles = [
    { seq: ['3', '7', '11', '?', '19'], ans: '15', opts: ['14', '15', '16', '17'] },
    { seq: ['2', '4', '8', '16', '?'], ans: '32', opts: ['24', '30', '32', '64'] },
    { seq: ['1', '4', '9', '16', '?'], ans: '25', opts: ['20', '25', '30', '36'] },
  ];

  const currentP = puzzles[(level - 1) % puzzles.length];

  const handlePick = (val: string) => {
    if (val === currentP.ans) {
      sounds.playSuccess();
      setScore(s => s + 10);
      setLevel(l => l + 1);
    } else {
      sounds.playBeep(200, 0.2);
    }
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto select-none text-center">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base font-bold text-theme-text">Missing Number</h2>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400">Score: {score}</span>
        </div>

        <div className="p-4 bg-theme-bg rounded-2xl border border-theme-border flex items-center justify-center gap-2 font-mono text-xl font-black text-theme-accent">
          {currentP.seq.map((s, i) => (
            <span key={i} className="px-2.5 py-1 rounded bg-theme-surface border border-theme-border">
              {s}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {currentP.opts.map(opt => (
            <button
              key={opt}
              onClick={() => handlePick(opt)}
              className="py-3 rounded-xl bg-theme-surface hover:bg-theme-accent hover:text-white border border-theme-border font-mono text-sm font-bold text-theme-text transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
