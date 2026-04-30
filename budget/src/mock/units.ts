import type { Unit } from "../components/units/UnitCard";

function makeTrendHighFreq(now: number, total: number, startUsed: number) {
  const points = [];

  const secondsBack = 60 * 60; // last 1 hour
  const stepSeconds = 5;       // point every 5 seconds

  for (let i = secondsBack; i >= 0; i -= stepSeconds) {
    const ts = now - i * 1000;

    // small upward drift + tiny wave so it looks "alive"
    const drift = ((secondsBack - i) / secondsBack) * (total * 0.03); // up to +3%
    const wave = Math.sin((secondsBack - i) / 30) * (total * 0.002);  // tiny oscillation

    const used = Math.max(
      0,
      Math.min(total, Math.round(startUsed + drift + wave))
    );

    points.push({ ts, used, total });
  }

  return points;
}

const alphatrend = makeTrendHighFreq(Date.now(), 50000, 30000);

export const units: Unit[] = [
  {  id: "1",
     name: 'ממר"ם',
     totalBudget: 50000,
     usedBudget: 32000,
     symbol: "/Alpha.jpg",
     aspects: [
      { key: "compute", label: "Compute", used: 18000, total: 25000 },
      { key: "storage", label: "Storage", used: 6000, total: 9000 },
      { key: "network", label: "Network", used: 4500, total: 7000 },
      { key: "cpu", label: "Cpu", used: 3500, total: 9000 },
     ], 
    trend: alphatrend},

  {  id: "2",
     name: 'מצפ"ן',
     totalBudget: 20000,
     usedBudget: 19000,
     symbol: "/Beta.png",
     aspects: [
      { key: "compute", label: "Compute", used: 12000, total: 12000 },
      { key: "storage", label: "Storage", used: 4000, total: 4500 },
      { key: "network", label: "Network", used: 2000, total: 2500 },
      { key: "cpu", label: "Cpu", used: 1000, total: 1000 },
     ], 
    trend: alphatrend},
  {  id: "3",
     name: 'מעו"ף',
     totalBudget: 80000,
     usedBudget: 42000,
     symbol: "/Gamma.jpg",
     aspects: [
      { key: "compute", label: "Compute", used: 24000, total: 45000 },
      { key: "storage", label: "Storage", used: 9000, total: 15000 },
      { key: "network", label: "Network", used: 4000, total: 8000 },
      { key: "cpu", label: "Cpu", used: 5000, total: 12000 },
     ], 
    trend: alphatrend}
];
