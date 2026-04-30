import { useMemo, useState } from "react";
import type { Unit } from "./UnitCard";
import type { TimeRange } from "./timeRanges";
import { TimeRangeSelect } from "./TimeRangeSelect";
import { BudgetTrendChart } from "./BudgetTrendChart";

function rangeToMs(r: TimeRange): number {
  const s = 1_000;
  const m = 60 * s;
  const h = 60 * m;
  const d = 24 * h;

  switch (r) {
    case "10s": return 10 * s;
    case "30s": return 30 * s;
    case "1m":  return 1 * m;

    case "5m":  return 5 * m;
    case "15m": return 15 * m;
    case "30m": return 30 * m;

    case "1h":  return 1 * h;
    case "3h":  return 3 * h;
    case "6h":  return 6 * h;
    case "12h": return 12 * h;
    case "24h": return 24 * h;

    case "3d":  return 3 * d;
    case "7d":  return 7 * d;
    case "2w":  return 14 * d;

    case "1mo": return 30 * d;
    case "3mo": return 90 * d;
    case "6mo": return 180 * d;
    case "1y":  return 365 * d;
  }
}


function money(n: number) {
  return `$${n.toLocaleString()}`;
}

export function BudgetTrend({ unit }: { unit: Unit }) {
  const [range, setRange] = useState<TimeRange>("24h");
  const points = unit.trend ?? [];

  const filtered = useMemo(() => {
    if (points.length === 0) return [];
    const maxTs = Math.max(...points.map((p) => p.ts));
    const cutoff = maxTs - rangeToMs(range);
    return points.filter((p) => p.ts >= cutoff).sort((a, b) => a.ts - b.ts);
  }, [points, range]);

  const last = filtered[filtered.length - 1];
  const first = filtered[0];

  const delta = last && first ? last.used - first.used : 0;

  return (
    <section className="card">
      <div className="trend-header">
        <div>
          <div className="section-title">Usage trend</div>
          <div className="muted">
            {last ? `Current used: ${money(last.used)}` : "No trend data"}
            {last && first ? ` · Δ ${money(delta)}` : ""}
          </div>
        </div>

        <TimeRangeSelect value={range} onChange={setRange} />
      </div>

      <BudgetTrendChart points={filtered} />
    </section>
  );
}
