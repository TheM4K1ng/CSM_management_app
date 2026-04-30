import type { TrendPoint } from "./UnitCard";

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export function BudgetTrendChart({
    points,
    height = 140
} : {
    points: TrendPoint[];
    height?: number;
}) {
    const width = 600;
    const padding = 16;

    if (!points || points.length < 2){
        return <div className="muted">Not enough data to plot trend.</div>
    }

    const minUsed = Math.min(...points.map(p => p.used));
    const maxUsed = Math.max(...points.map(p => p.used));
    const minTs = Math.min(...points.map(p => p.ts));
    const maxTs = Math.max(...points.map(p => p.ts));

    const yMin = minUsed;
    const yMax = maxUsed === minUsed ? minUsed + 1 : maxUsed;

    const xScale = (ts: number) =>
        padding + ((ts - minTs) / (maxTs - minTs || 1)) * (width - padding * 2);

    const yScale = (used: number) =>
        padding + (1 - (used - yMin) / (yMax - yMin || 1)) * (height - padding * 2);

    const d = points
    .map((p, i) => {
        const x = xScale(p.ts);
        const y = yScale(p.used);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(" ");

    const last = points[points.length - 1];
    const lastX = xScale(last.ts);
    const lastY = yScale(last.used);

    return (
        <svg
        className="trend-svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        >
            <line 
            x1={padding}
            y1={height - padding}
            x2={width - padding} 
            y2={height - padding} className="trend-grid"/>
            <line 
            x1={padding}
            y1={padding}
            x2={padding} 
            y2={width - padding} className="trend-grid"/>

            <path d={d} className="trend-line"/>

            <circle 
            cx={clamp(lastX, padding, width - padding)} 
            cy={clamp(lastY, padding, height - padding)} 
            r="3.5" 
            className="trend-dot" />
        </svg>
    )
}