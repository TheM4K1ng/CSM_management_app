import type { Unit } from "./UnitCard";

function usagePercent(u: Unit){
    return Math.round((u.usedBudget / u.totalBudget) * 100);
}

function statusFromPercent(p: number) {
  if (p > 90) return "danger";
  if (p > 70) return "warning";
  return "healthy";
}

function formatMoney(n: number) {
    return `$${n.toLocaleString()}`;
}

export function FocusedUnitHeader({ unit}: {unit: Unit}) {
    const percent = usagePercent(unit);
    const status = statusFromPercent(percent);
    const remaining = Math.max(0, unit.totalBudget - unit.usedBudget);

    return (
        <section className="focused-header card">
            <div className="focused-left">
                {unit.symbol ? (
                    <img className="focused-avatar" src={unit.symbol} alt={`${unit.name} symbol`}/>
                ) : (
                    <div className="focused-avatar fallback">{unit.name[0]}</div>
                )}

                <div className="focused-title">
                    <h2 className="focused-name">{unit.name}</h2>
                    <span className={`status-badge ${status}`}>
                        {status === "healthy" ? "Healthy" : status === "warning" ? "Warning" : "Critical"}
                    </span>
                </div>
            </div>

            <div className="focused-metrics">
                <div className="metric">
                    <div className="metric-label">Used</div>
                    <div className="metric-value">{formatMoney(unit.usedBudget)}</div>
                </div>
            </div>

            <div className="metric">
                <div className="metric-label">Total</div>
                <div className="metric-value">{formatMoney(unit.totalBudget)}</div>
            </div>

            <div className="metric">
                <div className="metric-label">Remaining</div>
                <div className="metric-value">{formatMoney(remaining)}</div>
            </div>

            <div className="focused-progress">
                <div className="progress">
                    <div 
                    className={`progress-fill ${status}`}
                    style={{width: `${Math.min(100, percent)}%`}}
                    ></div>
                </div>

                <div className="focused-sub">
                    {formatMoney(unit.usedBudget)} / {formatMoney(unit.totalBudget)}
                </div>
            </div>
        </section>
    )
}