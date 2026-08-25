import React, { useState, useMemo } from 'react';
import {
  BatteryCharging,
  Zap,
  Clock,
  Gauge,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
} from 'lucide-react';

export const BatteryChargingEstimator: React.FC = () => {
  const [deviceType, setDeviceType] = useState<'smartphone' | 'laptop' | 'tablet' | 'custom'>('smartphone');
  const [currentPercentage, setCurrentPercentage] = useState<number>(15);
  const [targetPercentage, setTargetPercentage] = useState<number>(85);
  const [batteryCapacityMah, setBatteryCapacityMah] = useState<number>(5000);
  const [nominalVoltage, setNominalVoltage] = useState<number>(3.85); // Standard Li-ion/Li-poly nominal voltage
  const [chargerWattage, setChargerWattage] = useState<number>(33);
  const [chargingEfficiency, setChargingEfficiency] = useState<number>(85); // 85% typical thermal and circuit efficiency
  const [devicePowerDrawWatts, setDevicePowerDrawWatts] = useState<number>(2.5); // Device screen / standby draw while charging

  // Quick Presets
  const handlePresetSelect = (type: 'smartphone' | 'laptop' | 'tablet') => {
    setDeviceType(type);
    if (type === 'smartphone') {
      setBatteryCapacityMah(5000);
      setNominalVoltage(3.85);
      setChargerWattage(33);
      setDevicePowerDrawWatts(1.5);
    } else if (type === 'laptop') {
      setBatteryCapacityMah(6500);
      setNominalVoltage(11.4); // Typical 3-cell 70Wh laptop battery
      setChargerWattage(65);
      setDevicePowerDrawWatts(12);
    } else if (type === 'tablet') {
      setBatteryCapacityMah(7500);
      setNominalVoltage(3.85);
      setChargerWattage(20);
      setDevicePowerDrawWatts(3.0);
    }
  };

  // Calculations
  const results = useMemo(() => {
    const validCurrent = Math.max(0, Math.min(100, currentPercentage));
    const validTarget = Math.max(validCurrent, Math.min(100, targetPercentage));
    const deltaPercentage = validTarget - validCurrent;

    // Total Energy Capacity in Watt-Hours (Wh) = (mAh * V) / 1000
    const totalCapacityWh = (batteryCapacityMah * nominalVoltage) / 1000;
    const energyRequiredWh = totalCapacityWh * (deltaPercentage / 100);

    // Effective charging power factoring thermal efficiency and standby draw
    const effectiveChargingPowerWatts = Math.max(
      1,
      chargerWattage * (chargingEfficiency / 100) - devicePowerDrawWatts
    );

    // Tapering factor: Above 80%, Li-ion cells switch from Constant Current (CC) to Constant Voltage (CV), reducing speed by ~40%
    let estimatedHours = 0;
    if (deltaPercentage > 0) {
      const standardPortion = Math.max(0, Math.min(80, validTarget) - validCurrent) / deltaPercentage;
      const taperPortion = Math.max(0, validTarget - Math.max(80, validCurrent)) / deltaPercentage;

      const baseHours = energyRequiredWh / effectiveChargingPowerWatts;
      // Weight taper region by 1.6x slower trickle
      estimatedHours = baseHours * (standardPortion + taperPortion * 1.6);
    }

    const totalMinutes = Math.round(estimatedHours * 60);
    const hoursPart = Math.floor(totalMinutes / 60);
    const minutesPart = totalMinutes % 60;

    return {
      totalCapacityWh: Math.round(totalCapacityWh * 10) / 10,
      energyRequiredWh: Math.round(energyRequiredWh * 10) / 10,
      deltaPercentage,
      totalMinutes,
      hoursPart,
      minutesPart,
      effectiveChargingPowerWatts: Math.round(effectiveChargingPowerWatts * 10) / 10,
    };
  }, [currentPercentage, targetPercentage, batteryCapacityMah, nominalVoltage, chargerWattage, chargingEfficiency, devicePowerDrawWatts]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* Header */}
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BatteryCharging className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-theme-text flex items-center gap-2">
              <span>Battery & Charging Time Estimator</span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Mathematical Estimate
              </span>
            </h2>
            <p className="text-xs text-theme-text-muted">
              Estimate charging duration based on battery capacity, charger wattage, and CC/CV voltage curve.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePresetSelect('smartphone')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              deviceType === 'smartphone'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-theme-bg text-theme-text-muted border-theme-border'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
          <button
            onClick={() => handlePresetSelect('laptop')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              deviceType === 'laptop'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-theme-bg text-theme-text-muted border-theme-border'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Laptop</span>
          </button>
          <button
            onClick={() => handlePresetSelect('tablet')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              deviceType === 'tablet'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-theme-bg text-theme-text-muted border-theme-border'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
        </div>
      </div>

      {/* Main Result Display Hero */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5 justify-center md:justify-start">
            <Clock className="w-4 h-4" />
            <span>Estimated Charging Time</span>
          </span>
          <div className="flex items-baseline gap-2 justify-center md:justify-start">
            <span className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
              {results.hoursPart > 0 ? `${results.hoursPart}h ` : ''}{results.minutesPart}m
            </span>
            <span className="text-xs font-mono text-cyan-300">
              ({results.totalMinutes} minutes total)
            </span>
          </div>
          <p className="text-xs text-theme-text-muted">
            From {currentPercentage}% to {targetPercentage}% (+{results.deltaPercentage}% gain)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-900 border border-theme-border text-center min-w-[120px]">
            <span className="text-[10px] text-theme-text-muted uppercase block">Energy Required</span>
            <span className="text-base font-bold text-amber-400">{results.energyRequiredWh} Wh</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900 border border-theme-border text-center min-w-[120px]">
            <span className="text-[10px] text-theme-text-muted uppercase block">Net Charge Rate</span>
            <span className="text-base font-bold text-cyan-400">{results.effectiveChargingPowerWatts} W</span>
          </div>
        </div>
      </div>

      {/* Crucial Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
        <div>
          <span className="font-bold block text-amber-300 mb-0.5">Approximate Theoretical Estimate:</span>
          Actual real-world charging speeds vary based on room temperature, battery health/age, device thermal throttling, dynamic USB-PD/QC negotiation protocols, and active background apps. This tool provides an empirical physics-based approximation.
        </div>
      </div>

      {/* Sliders and Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Battery Level State */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            <span>Battery State & Target</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-theme-text-muted">Current Battery Level</span>
                <span className="font-mono text-cyan-400 font-bold">{currentPercentage}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={99}
                value={currentPercentage}
                onChange={e => setCurrentPercentage(parseInt(e.target.value) || 0)}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-theme-text-muted">Target Battery Level</span>
                <span className="font-mono text-emerald-400 font-bold">{targetPercentage}%</span>
              </div>
              <input
                type="range"
                min={currentPercentage}
                max={100}
                value={targetPercentage}
                onChange={e => setTargetPercentage(parseInt(e.target.value) || 100)}
                className="w-full accent-emerald-400"
              />
              <span className="text-[10px] text-theme-text-muted mt-1 block">
                *Pro-Tip: Charging to 80-85% significantly extends Lithium-ion battery lifespan.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-theme-border">
              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Battery Capacity (mAh)</label>
                <input
                  type="number"
                  min={500}
                  max={20000}
                  step={100}
                  value={batteryCapacityMah}
                  onChange={e => setBatteryCapacityMah(Math.max(100, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-theme-text-muted mb-1 font-semibold">Nominal Voltage (V)</label>
                <input
                  type="number"
                  min={3.0}
                  max={15.0}
                  step={0.05}
                  value={nominalVoltage}
                  onChange={e => setNominalVoltage(parseFloat(e.target.value) || 3.85)}
                  className="w-full px-3 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Charger & Thermal Parameters */}
        <div className="bg-theme-surface border border-theme-border rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-theme-text flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Charger & Power Delivery</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">Charger Rated Wattage (Watts)</label>
              <input
                type="number"
                min={5}
                max={240}
                value={chargerWattage}
                onChange={e => setChargerWattage(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono font-bold focus:border-theme-accent focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-theme-text-muted">Charging Circuit & Thermal Efficiency</span>
                <span className="font-mono text-cyan-400 font-bold">{chargingEfficiency}%</span>
              </div>
              <input
                type="range"
                min={60}
                max={95}
                value={chargingEfficiency}
                onChange={e => setChargingEfficiency(parseInt(e.target.value) || 85)}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="block text-theme-text-muted mb-1 font-semibold">
                Device Active Power Draw While Charging (W)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                step={0.5}
                value={devicePowerDrawWatts}
                onChange={e => setDevicePowerDrawWatts(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-1.5 rounded-xl bg-theme-bg border border-theme-border text-theme-text font-mono focus:border-theme-accent focus:outline-none"
              />
              <span className="text-[10px] text-theme-text-muted mt-1 block">
                0W if device is turned off, ~2W in standby, ~10-15W under heavy gaming/video use.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
