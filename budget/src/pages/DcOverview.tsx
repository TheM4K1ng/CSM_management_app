import type { Unit } from "../components/units/UnitCard";
import type { DC } from "../types/dc";
import { aggregateDcBudget } from "../utils/aggregateDc";

function money(n: number) {
    return `$${n.toLocaleString()}`
}

export function DcOverview({
    dc,
    units,
} : {
    dc: DC;
    units: Unit[];
}) {
    const agg = aggregateDcBudget(units, dc);

    return (
        <section className="card">
            <div className="dc-header">
                <div>
                    <div className="dc-title">
                        {dc === "south" ? "south DC" : "central DC"}
                    </div>
                    <div className="muted">
                        Aggregated budget across all clusters
                    </div>
                </div>

                <div className="dc-numbers">
                    <div className="dc-used">{money(agg.used)}</div>
                    <div className="muted">of {money(agg.total)}</div>
                </div>
            </div>

            <div className="progress">
                <div
                className={`progress-fill ${
                    agg.percent > 90 ? "danger" :
                    agg.percent > 70 ? "warning" : "healthy"
                }`}
                style={{width: `${agg.percent}`}}
                />
            </div>
        </section>
    )
}