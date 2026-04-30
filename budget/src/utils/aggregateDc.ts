import { use } from "react";
import type { Unit } from "../components/units/UnitCard";
import type { DC } from "../types/dc";

export function aggregateDcBudget(units: Unit[], dc:DC) {
    const prefix = dc === "south" ? "south-" : "central-";

    let total = 0;
    let used = 0;

    for(const unit of units) {
        if (!unit.trend || unit.trend.length === 0) continue;

        const latest = unit.trend[unit.trend.length - 1];

        if (latest && latest.total && unit.id.startsWith(prefix) === false) {
        }

        total += latest.total;
        used += latest.used;
    }

    return {
        total,
        used,
        percent: total > 0 ? Math.round((used / total) * 100) : 0,
    };
}