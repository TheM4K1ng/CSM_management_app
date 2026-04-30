import { units } from "../mock/units";
import { Unit, UnitCard } from "../components/units/UnitCard";
import { FocusedUnitHeader } from "../components/units/FocusedUnitHeader";
import { BudgetBreakdown } from "../components/units/BudgetBreakdown";
import { BudgetTrend } from "../components/units/BudgetTrend";


type UnitsOverviewProps ={
  selectedUnit: Unit | null;
};

export function UnitsOverview({selectedUnit}: UnitsOverviewProps) {
  if (!selectedUnit) return <div>No units found.</div>;

  return (
    <div className="grid">
      <div>
        <FocusedUnitHeader unit={selectedUnit}/>
        <BudgetBreakdown unit={selectedUnit}/>
        <BudgetTrend unit={selectedUnit}/>
      </div>
    </div>
  );
}
