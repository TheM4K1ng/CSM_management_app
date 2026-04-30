import { useMemo, useState } from "react";
import type { Unit } from "../units/UnitCard";

type SidebarProps = {
  units: Unit[];
  selectedUnitId: string;
  onSelectUnit: (id: string) => void;
};

function usagePercent(u: Unit) {
  return Math.round((u.usedBudget / u.totalBudget) * 100);
}

function statusFromPercent(p: number) {
  if (p > 90) return "danger";
  if (p > 70) return "warning";
  return "healthy";
}

export function Sidebar({ units, selectedUnitId, onSelectUnit }: SidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return units;
    return units.filter((u) => u.name.toLowerCase().includes(q));
  }, [units, query]);

  return (
    <aside className="sidebar">
      <h2 className="logo">CSM</h2>

      <input
        className="sidebar-search"
        placeholder="Search units..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="sidebar-section-title">Units</div>

      <div className="units-list">
        {filtered.map((u) => {
          const p = usagePercent(u);
          const status = statusFromPercent(p);
          const active = u.id === selectedUnitId;

          return (
            <button
              key={u.id}
              className={`unit-row ${active ? "active" : ""}`}
              onClick={() => onSelectUnit(u.id)}
              type="button"
            >
              <div className="unit-row-top">
                <span className="unit-row-name">{u.name}</span>
                <span className={`unit-chip ${status}`}>{p}%</span>
              </div>

              <div className="unit-row-sub">
                ${u.usedBudget.toLocaleString()} / ${u.totalBudget.toLocaleString()}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
