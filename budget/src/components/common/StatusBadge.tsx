type StatusBadgeProps = {
  value: number;
};

export function StatusBadge({ value }: StatusBadgeProps) {
  let label = "Healthy";
  let className = "healthy";

  if (value > 90) {
    label = "Critical";
    className = "danger";
  } else if (value > 70) {
    label = "Warning";
    className = "warning";
  }

  return (
    <span className={`status-badge ${className}`}>
      {label}
    </span>
  );
}
