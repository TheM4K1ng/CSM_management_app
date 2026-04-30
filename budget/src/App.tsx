import "./styles/globals.css";
import { useMemo, useState } from "react";
import { PageLayout } from "./components/layout/PageLayout";
import { UnitsOverview } from "./pages/UnitsOverview";
import { units as mockUnits } from "./mock/units";
import type { Unit } from "./components/units/UnitCard";
import { DcOverview } from "./pages/DcOverview";
import { Routes, Route, useLocation } from "react-router-dom";
import { NewCustomerMeetingPage } from "./components/customerRecords/NewCustomerMeetingPage";
import { CustomerMeetingDetailsPage } from "./components/customerRecords/CustomerMeetingDetailsPage";

export default function App() {
  const location = useLocation();
  const state = location.state as { background?: Location } | undefined;

  const units = useMemo<Unit[]>(() => mockUnits, []);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(units[0]?.id ?? null);

  const selectedUnit = units.find((u) => u.id === selectedUnitId) ?? null;
  const [dc, setDc] = useState<"south" | "central">("south");
  const [clusterId, setClusterId] = useState<string>("south-1");

  function handleChangeDc(next: "south" | "central") {
    setDc(next);
    setSelectedUnitId(null);
    setClusterId(next === "south" ? "south-1" : "central-1");
  }

  return (
    <>
      {/* Main app routes render either the background location or current location */}
      <Routes location={state?.background ?? location}>
        <Route
          path="/"
          element={
            <PageLayout
              dc={dc}
              onChangeDc={handleChangeDc}
              onChangeClusterId={setClusterId}
              clusterId={clusterId}
              selectedUnitId={selectedUnitId}
              onSelectUnit={setSelectedUnitId}
            >
              {selectedUnit === null ? (
                <DcOverview dc={dc} units={units} />
              ) : (
                <UnitsOverview selectedUnit={selectedUnit} />
              )}
            </PageLayout>
          }
        />
      </Routes>

      {/* Modal routes render only when we have a background */}
      {state?.background && (
        <Routes>
          <Route path="/meetings/new" element={<NewCustomerMeetingPage />} />
          <Route path="/meetings/:id" element={<CustomerMeetingDetailsPage />} />
        </Routes>
      )}
    </>
  );
}