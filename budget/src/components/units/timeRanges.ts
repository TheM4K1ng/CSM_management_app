export type TimeRange = 
| "10s" | "30s" 
| "1m" | "5m" | "15m" | "30m" 
| "1h" | "3h" | "6h" | "12h" | "24h" 
| "3d" | "7d" | "2w" 
| "1mo" | "3mo" | "6mo" | "1y";

export const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "10s", label: "10 seconds" },
  { value: "30s", label: "30 seconds" },
  { value: "1m", label: "1 minute" },  
  { value: "5m", label: "5 minutes" },
  { value: "15m", label: "15 minutes" },
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "3h", label: "3 hours" },
  { value: "6h", label: "6 hours" },
  { value: "12h", label: "12 hours" },
  { value: "24h", label: "24 hours" },
  { value: "3d", label: "3 days" },
  { value: "7d", label: "7 days" },
  { value: "2w", label: "2 weeks" },
  { value: "1mo", label: "month" },
  { value: "3mo", label: "3 months" },
  { value: "6mo", label: "6 months" },
  { value: "1y", label: "1 year" },
];