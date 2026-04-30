import type { TimeRange } from "./timeRanges";
import { TIME_RANGES } from "./timeRanges";

export function TimeRangeSelect({
    value,
    onChange,
} : {
    value: TimeRange;
    onChange: (v: TimeRange) => void;
}) {
    return (
        <select
        className="select"
        value={value}
        onChange={e => onChange(e.target.value as TimeRange)}
        >
            {TIME_RANGES.map(r => (
                <option key={r.value} value={r.value}>
                    {r.label}
                </option>
            ))}
        </select>
    )
}