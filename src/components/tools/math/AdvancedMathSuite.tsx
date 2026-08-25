import React, { useState, useMemo } from 'react';
import { Activity, AlertTriangle, ArrowRight, BarChart2, Calculator, Check, CheckCircle2, ChevronRight, Copy, Download, Grid, Hash, HelpCircle, Info, Layers, LineChart, PieChart, Plus, RefreshCw, RotateCcw, Scale, ShieldCheck, Sparkles, Target, Trash2, TrendingUp, Variable, Zap } from 'lucide-react';
import { ResultCard } from '../../common/ResultCard';

export const GeometryPhysicsSuite: React.FC = () => {
  const [tab, setTab] = useState<'geometry' | 'physics'>('geometry');

  // Geometry
  const [shape, setShape] = useState<'circle' | 'rectangle' | 'cylinder' | 'sphere'>('circle');
  const [radius, setRadius] = useState<number>(5);
  const [length, setLength] = useState<number>(8);
  const [width, setWidth] = useState<number>(6);
  const [height, setHeight] = useState<number>(10);

  // Physics Formulas: F=ma, V=IR, KE=0.5mv^2, Kinematics
  const [physicsForm, setPhysicsForm] = useState<'force' | 'ohm' | 'kinetic' | 'kinematics'>('force');
  const [mass, setMass] = useState<number>(12);
  const [accel, setAccel] = useState<number>(9.8);
  const [current, setCurrent] = useState<number>(2.5);
  const [resistance, setResistance] = useState<number>(10);
  const [velocity, setVelocity] = useState<number>(15);

  // Geometry computations
  const circleArea = Math.PI * radius * radius;
  const circlePerimeter = 2 * Math.PI * radius;
  const rectArea = length * width;
  const cylinderVol = Math.PI * radius * radius * height;
  const sphereVol = (4 / 3) * Math.PI * Math.pow(radius, 3);

  // Physics computations
  const forceResult = mass * accel;
  const ohmVoltage = current * resistance;
  const kineticEnergy = 0.5 * mass * velocity * velocity;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex rounded-2xl bg-theme-surface p-1.5 border border-theme-border">
        <button
          onClick={() => setTab('geometry')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            tab === 'geometry' ? 'bg-theme-accent text-white shadow-md' : 'text-theme-text-muted'
          }`}
        >
          2D/3D Geometry Area & Volume
        </button>
        <button
          onClick={() => setTab('physics')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
            tab === 'physics' ? 'bg-theme-accent text-white shadow-md' : 'text-theme-text-muted'
          }`}
        >
          Physics Formula Calculators
        </button>
      </div>

      {tab === 'geometry' ? (
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'circle', label: 'Circle' },
              { id: 'rectangle', label: 'Rectangle' },
              { id: 'cylinder', label: 'Cylinder' },
              { id: 'sphere', label: 'Sphere' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setShape(s.id as any)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  shape === s.id
                    ? 'bg-theme-accent text-white border-theme-accent'
                    : 'bg-theme-bg border-theme-border text-theme-text'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(shape === 'circle' || shape === 'cylinder' || shape === 'sphere') && (
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">Radius (r)</label>
                <input
                  type="number"
                  value={radius}
                  onChange={e => setRadius(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold"
                />
              </div>
            )}
            {shape === 'rectangle' && (
              <>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">Length (l)</label>
                  <input
                    type="number"
                    value={length}
                    onChange={e => setLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">Width (w)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={e => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold"
                  />
                </div>
              </>
            )}
            {shape === 'cylinder' && (
              <div>
                <label className="text-xs font-semibold text-theme-text-muted block mb-1">Height (h)</label>
                <input
                  type="number"
                  value={height}
                  onChange={e => setHeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-sm font-mono text-theme-text font-bold"
                />
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border text-center space-y-2">
            <span className="text-[10px] uppercase font-mono text-theme-text-muted">Calculated Geometric Value</span>
            <span className="text-3xl font-black text-emerald-400 font-mono block">
              {shape === 'circle'
                ? `Area = ${circleArea.toFixed(2)} sq units (Circumference = ${circlePerimeter.toFixed(2)})`
                : shape === 'rectangle'
                ? `Area = ${rectArea.toFixed(2)} sq units`
                : shape === 'cylinder'
                ? `Volume = ${cylinderVol.toFixed(2)} cubic units`
                : `Volume = ${sphereVol.toFixed(2)} cubic units`}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'force', label: "Newton's F = ma" },
              { id: 'ohm', label: "Ohm's Law V = IR" },
              { id: 'kinetic', label: 'Kinetic Energy' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPhysicsForm(p.id as any)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  physicsForm === p.id
                    ? 'bg-theme-accent text-white border-theme-accent'
                    : 'bg-theme-bg border-theme-border text-theme-text'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {physicsForm === 'force' && (
              <>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">Mass m (kg)</label>
                  <input
                    type="number"
                    value={mass}
                    onChange={e => setMass(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">Acceleration a (m/s²)</label>
                  <input
                    type="number"
                    value={accel}
                    onChange={e => setAccel(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text"
                  />
                </div>
              </>
            )}

            {physicsForm === 'ohm' && (
              <>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">Current I (Amperes)</label>
                  <input
                    type="number"
                    value={current}
                    onChange={e => setCurrent(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">Resistance R (Ohms)</label>
                  <input
                    type="number"
                    value={resistance}
                    onChange={e => setResistance(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text"
                  />
                </div>
              </>
            )}

            {physicsForm === 'kinetic' && (
              <>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">Mass m (kg)</label>
                  <input
                    type="number"
                    value={mass}
                    onChange={e => setMass(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-text-muted block mb-1">Velocity v (m/s)</label>
                  <input
                    type="number"
                    value={velocity}
                    onChange={e => setVelocity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text"
                  />
                </div>
              </>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border text-center space-y-2">
            <span className="text-[10px] uppercase font-mono text-theme-text-muted">Calculated Physical Output</span>
            <span className="text-3xl font-black text-theme-accent font-mono block">
              {physicsForm === 'force'
                ? `Net Force F = ${forceResult.toFixed(2)} N (Newtons)`
                : physicsForm === 'ohm'
                ? `Voltage V = ${ohmVoltage.toFixed(2)} Volts`
                : `Kinetic Energy E_k = ${kineticEnergy.toFixed(2)} Joules (J)`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};



export const MatrixCalculator: React.FC = () => {
  const [size, setSize] = useState<2 | 3>(2);
  const [matrixA, setMatrixA] = useState<number[][]>([
    [1, 2],
    [3, 4],
  ]);
  const [matrixB, setMatrixB] = useState<number[][]>([
    [5, 6],
    [7, 8],
  ]);

  const handleSizeChange = (s: 2 | 3) => {
    setSize(s);
    if (s === 2) {
      setMatrixA([
        [1, 2],
        [3, 4],
      ]);
      setMatrixB([
        [5, 6],
        [7, 8],
      ]);
    } else {
      setMatrixA([
        [1, 2, 3],
        [0, 1, 4],
        [5, 6, 0],
      ]);
      setMatrixB([
        [2, 0, -1],
        [1, 3, 2],
        [0, -2, 1],
      ]);
    }
  };

  const updateCell = (target: 'A' | 'B', r: number, c: number, val: number) => {
    if (target === 'A') {
      const next = matrixA.map((row, ri) => row.map((col, ci) => (ri === r && ci === c ? val : col)));
      setMatrixA(next);
    } else {
      const next = matrixB.map((row, ri) => row.map((col, ci) => (ri === r && ci === c ? val : col)));
      setMatrixB(next);
    }
  };

  // Matrix Operations
  const addMatrices = () => {
    return matrixA.map((row, r) => row.map((val, c) => val + matrixB[r][c]));
  };

  const multiplyMatrices = () => {
    const res = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        for (let k = 0; k < size; k++) {
          res[i][j] += matrixA[i][k] * matrixB[k][j];
        }
      }
    }
    return res;
  };

  const determinant2x2 = (m: number[][]) => m[0][0] * m[1][1] - m[0][1] * m[1][0];
  const determinant3x3 = (m: number[][]) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

  const detA = size === 2 ? determinant2x2(matrixA) : determinant3x3(matrixA);
  const detB = size === 2 ? determinant2x2(matrixB) : determinant3x3(matrixB);

  const sumMatrix = addMatrices();
  const productMatrix = multiplyMatrices();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-theme-border">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-theme-accent" />
            <h2 className="text-base sm:text-lg font-bold text-theme-text">Matrix Operations & Determinants</h2>
          </div>
          <div className="flex rounded-xl bg-theme-bg p-1 border border-theme-border">
            {[2, 3].map(s => (
              <button
                key={s}
                onClick={() => handleSizeChange(s as 2 | 3)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  size === s ? 'bg-theme-accent text-white' : 'text-theme-text-muted'
                }`}
              >
                {s}x{s} Matrix
              </button>
            ))}
          </div>
        </div>

        {/* Matrix A and B inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-theme-text block text-center">Matrix A (Det = {detA})</span>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
              {matrixA.map((row, r) =>
                row.map((val, c) => (
                  <input
                    key={`a-${r}-${c}`}
                    type="number"
                    value={val}
                    onChange={e => updateCell('A', r, c, parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-center font-mono text-xs font-bold text-theme-text"
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-theme-text block text-center">Matrix B (Det = {detB})</span>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
              {matrixB.map((row, r) =>
                row.map((val, c) => (
                  <input
                    key={`b-${r}-${c}`}
                    type="number"
                    value={val}
                    onChange={e => updateCell('B', r, c, parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-center font-mono text-xs font-bold text-theme-text"
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Results Matrix Addition & Multiplication */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-theme-border">
          <div className="p-4 rounded-xl bg-theme-bg border border-theme-border space-y-2">
            <span className="text-xs font-bold uppercase font-mono text-emerald-400 block text-center">
              Sum (A + B)
            </span>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
              {sumMatrix.map((row, r) =>
                row.map((val, c) => (
                  <div key={`sum-${r}-${c}`} className="p-2 rounded-lg bg-theme-surface border border-theme-border text-center font-mono text-xs font-bold text-emerald-300">
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-theme-bg border border-theme-border space-y-2">
            <span className="text-xs font-bold uppercase font-mono text-theme-accent block text-center">
              Product (A × B)
            </span>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
              {productMatrix.map((row, r) =>
                row.map((val, c) => (
                  <div key={`prod-${r}-${c}`} className="p-2 rounded-lg bg-theme-surface border border-theme-border text-center font-mono text-xs font-bold text-theme-accent">
                    {val}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export const QuadraticSolver: React.FC = () => {
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-5);
  const [c, setC] = useState<number>(6);

  // Discriminant: b² - 4ac
  const discriminant = b * b - 4 * a * c;

  let rootsText = '';
  let natureText = '';

  if (a === 0) {
    rootsText = 'Linear equation (a cannot be 0 for quadratic)';
    natureText = `x = ${(-c / b).toFixed(4)}`;
  } else if (discriminant > 0) {
    const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    rootsText = `Two distinct real roots: x₁ = ${r1.toFixed(4)}, x₂ = ${r2.toFixed(4)}`;
    natureText = 'Real & Distinct Roots (Δ > 0)';
  } else if (discriminant === 0) {
    const r = -b / (2 * a);
    rootsText = `One repeated real root: x = ${r.toFixed(4)}`;
    natureText = 'Real & Equal Roots (Δ = 0)';
  } else {
    const realPart = (-b / (2 * a)).toFixed(4);
    const imagPart = (Math.sqrt(Math.abs(discriminant)) / (2 * a)).toFixed(4);
    rootsText = `Complex roots: x = ${realPart} ± ${imagPart}i`;
    natureText = 'Complex Conjugate Roots (Δ < 0)';
  }

  // Vertex: (-b/2a, c - b²/4a)
  const vertexX = a !== 0 ? -b / (2 * a) : 0;
  const vertexY = a !== 0 ? c - (b * b) / (4 * a) : 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-theme-border">
          <div className="w-10 h-10 rounded-xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent font-mono font-bold">
            ax²
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-theme-text">Quadratic & Polynomial Solver</h2>
            <p className="text-xs text-theme-text-muted">Step-by-step roots, discriminant, and vertex coordinates.</p>
          </div>
        </div>

        {/* Coefficients input */}
        <div className="flex items-center justify-center gap-2 font-mono text-sm sm:text-base">
          <input
            type="number"
            value={a}
            onChange={e => setA(parseFloat(e.target.value) || 0)}
            className="w-16 sm:w-20 px-2 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-center text-theme-text font-bold"
          />
          <span className="text-theme-text">x² +</span>
          <input
            type="number"
            value={b}
            onChange={e => setB(parseFloat(e.target.value) || 0)}
            className="w-16 sm:w-20 px-2 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-center text-theme-text font-bold"
          />
          <span className="text-theme-text">x +</span>
          <input
            type="number"
            value={c}
            onChange={e => setC(parseFloat(e.target.value) || 0)}
            className="w-16 sm:w-20 px-2 py-1.5 rounded-lg bg-theme-bg border border-theme-border text-center text-theme-text font-bold"
          />
          <span className="text-theme-text">= 0</span>
        </div>

        {/* Results Card */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-theme-bg border border-theme-border text-center space-y-2">
            <span className="text-[10px] uppercase font-mono text-theme-text-muted">{natureText}</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 block font-mono">
              {rootsText}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border text-center space-y-1">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted">Discriminant (Δ)</span>
              <span className="text-xl font-bold font-mono text-theme-accent block">
                {discriminant.toFixed(2)}
              </span>
              <span className="text-[11px] text-theme-text-muted font-mono">b² - 4ac = ({b})² - 4({a})({c})</span>
            </div>

            <div className="p-4 rounded-xl bg-theme-bg border border-theme-border text-center space-y-1">
              <span className="text-[10px] uppercase font-mono text-theme-text-muted">Parabola Vertex (h, k)</span>
              <span className="text-xl font-bold font-mono text-amber-400 block">
                ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})
              </span>
              <span className="text-[11px] text-theme-text-muted font-mono">{a > 0 ? 'Minimum Point' : 'Maximum Point'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



export const StatisticsSuite: React.FC = () => {
  const [dataInput, setDataInput] = useState<string>('12, 15, 18, 22, 22, 25, 29, 31, 35, 42');

  const numbers = dataInput
    .split(/[\s,]+/)
    .map(n => parseFloat(n.trim()))
    .filter(n => !isNaN(n))
    .sort((a, b) => a - b);

  const count = numbers.length;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  const mean = count > 0 ? sum / count : 0;

  // Median
  let median = 0;
  if (count > 0) {
    const mid = Math.floor(count / 2);
    median = count % 2 === 0 ? (numbers[mid - 1] + numbers[mid]) / 2 : numbers[mid];
  }

  // Mode
  const counts: Record<number, number> = {};
  numbers.forEach(n => (counts[n] = (counts[n] || 0) + 1));
  let maxFreq = 0;
  let mode: number[] = [];
  for (const [k, v] of Object.entries(counts)) {
    if (v > maxFreq) {
      maxFreq = v;
      mode = [parseFloat(k)];
    } else if (v === maxFreq && v > 1) {
      mode.push(parseFloat(k));
    }
  }

  // Variance & Standard Deviation (Sample & Population)
  const variance = count > 1 ? numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (count - 1) : 0;
  const stdDev = Math.sqrt(variance);

  // Range, Min, Max
  const min = count > 0 ? numbers[0] : 0;
  const max = count > 0 ? numbers[count - 1] : 0;
  const range = max - min;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-theme-surface border border-theme-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-3 pb-4 border-b border-theme-border">
          <BarChart2 className="w-5 h-5 text-theme-accent" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-theme-text">Statistics & Data Analyzer</h2>
            <p className="text-xs text-theme-text-muted">Mean, median, mode, variance, and standard deviation.</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-theme-text-muted block mb-1">
            Raw Numbers Dataset (Separated by commas or spaces)
          </label>
          <textarea
            value={dataInput}
            onChange={e => setDataInput(e.target.value)}
            className="w-full h-24 p-3 rounded-xl bg-theme-bg border border-theme-border font-mono text-xs text-theme-text focus:border-theme-accent outline-none"
          />
        </div>

        {/* Statistical Grid Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-theme-bg border border-theme-border text-center">
            <span className="text-[10px] uppercase font-mono text-theme-text-muted block">Mean (Average)</span>
            <span className="text-xl font-bold font-mono text-theme-accent block mt-0.5">{mean.toFixed(2)}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-theme-bg border border-theme-border text-center">
            <span className="text-[10px] uppercase font-mono text-theme-text-muted block">Median</span>
            <span className="text-xl font-bold font-mono text-emerald-400 block mt-0.5">{median.toFixed(2)}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-theme-bg border border-theme-border text-center">
            <span className="text-[10px] uppercase font-mono text-theme-text-muted block">Mode</span>
            <span className="text-xl font-bold font-mono text-amber-400 block mt-0.5">
              {mode.length > 0 && maxFreq > 1 ? mode.join(', ') : 'No Mode'}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-theme-bg border border-theme-border text-center">
            <span className="text-[10px] uppercase font-mono text-theme-text-muted block">Sample Std Deviation (s)</span>
            <span className="text-xl font-bold font-mono text-theme-text block mt-0.5">{stdDev.toFixed(2)}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-theme-bg border border-theme-border text-center">
            <span className="text-[10px] uppercase font-mono text-theme-text-muted block">Sample Variance (s²)</span>
            <span className="text-xl font-bold font-mono text-theme-text block mt-0.5">{variance.toFixed(2)}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-theme-bg border border-theme-border text-center">
            <span className="text-[10px] uppercase font-mono text-theme-text-muted block">Sample Size (N)</span>
            <span className="text-xl font-bold font-mono text-theme-text block mt-0.5">{count}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-between text-xs font-mono text-theme-text-muted">
          <span>Min: {min}</span>
          <span>Max: {max}</span>
          <span>Range: {range}</span>
          <span>Sum: {sum}</span>
        </div>
      </div>
    </div>
  );
};
