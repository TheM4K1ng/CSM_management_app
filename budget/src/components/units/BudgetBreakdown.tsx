import type { Unit, BudgetAspect } from "./UnitCard";

function percent(a: BudgetAspect) {
    if (a.total <= 0) return 0;
    return Math.round((a.used / a.total) * 100);
}

function statusFromPercent(p: number) {
    if (p > 90) return "danger";
    if (p > 70) return "warning";
  return "healthy";
}

function money(n: number) {
    return `$${n.toLocaleString()}`;
}

export function BudgetBreakdown({ unit }: {unit: Unit}) {
    const aspects = unit.aspects ?? [];

    if (aspects.length === 0) {
        return (
            <section className="card">
                <div className="section-title">Budget breakdown</div>
                <div className="muted">No breakdown data for this unit.</div>
            </section>
        );
    }

    return (
        <section className="card">
            <div className="breakdown-header">
                <div className="section-title">Budget breakdown</div>
                <div className="muted">{aspects.length} categories</div>
            </div>

            <div className="breakdown-grid">
                {aspects.map(a => {
                    const p = percent(a);
                    const status = statusFromPercent(p);
                
                    return (
                        <div key={a.key} className="breakdown-item">
                            <div className="breakdown-top">
                                <div className="breakdown-label">{a.label}</div>
                                <div className="breakdown-value">
                                    {money(a.used)} / {money(a.total)}
                                </div>
                            </div>

                            <div className="progress">
                                <div 
                                className={`progress-fill ${status}`}
                                style={{width: `${Math.min(100, p)}%` }}
                                ></div>
                            </div>

                            <div className="breakdown-foot">
                                <span className="muted">{p}% used</span>
                                <span className={`status-badge ${status}`}>
                                    {status === "healthy" ? "Healthy"
                                    : status === "warning" ? "Warning" 
                                    : "Critical"}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}