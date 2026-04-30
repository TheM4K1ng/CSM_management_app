import { Card } from "../common/Card";
import { ProgressBar } from "../common/ProgressBar";
import { StatusBadge } from "../common/StatusBadge";

export type TrendPoint = {
  ts: number;
  used: number;
  total: number;
};

export type BudgetAspect = {
  key: string;
  label: string;
  used: number;
  total: number;
};

export type Unit = {
  id: string;
  name: string;
  totalBudget: number;
  usedBudget: number;
  symbol? : string;

  aspects?: BudgetAspect[];
  trend?: TrendPoint[];
};

type UnitCardProps = {
  unit: Unit;
};

export function UnitCard({ unit }: UnitCardProps) {
  const usagePercent = Math.round(
    (unit.usedBudget / unit.totalBudget) * 100
  );

  return (
    <Card className="unit-card">
      <div className="unit-header">
        <h3>{unit.name}</h3>
        <StatusBadge value={usagePercent} />
      </div>

      <p className="budget">
        ${unit.usedBudget.toLocaleString()} / ${unit.totalBudget.toLocaleString()}
      </p>

      <ProgressBar value={usagePercent} />

      <span className="percent">
        {usagePercent}% used
      </span>
    </Card>
  );
}
