type ProgressBarProps = {
  value: number; // 0–100
};

export function ProgressBar({ value }: ProgressBarProps) {
  const status =
    value > 90 ? "danger" :
    value > 70 ? "warning" :
    "healthy";

  return (
    <div className="progress">
      <div
        className={`progress-fill ${status}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
