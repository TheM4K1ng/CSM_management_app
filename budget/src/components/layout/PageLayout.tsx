import { ReactNode, useState, useMemo } from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { TopBar } from "./Header";
import { Unit } from "../units/UnitCard";
import type { DC } from "../../types/dc";
import { SystemsPanel } from "../systems/SystemsPanel";
import { ServicesPanel } from "../services/ServicesPanel";
import { CustomerMeetingWidget } from "../customerRecords/CustomerMeetingsWidget";
import { useSearchParams, Outlet } from "react-router-dom";

type PageLayoutProps = {
  children: ReactNode;
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;

  dc: DC;
  onChangeDc: (dc: DC) => void;

  clusterId: string;
  onChangeClusterId: (clusterId: string) => void;
};



export function PageLayout({ 
  children,
  selectedUnitId,
  onSelectUnit,
  dc,
  onChangeDc,
  clusterId,
  onChangeClusterId,
 }: PageLayoutProps) {
  const [sp, setSp] = useSearchParams();
  const setParams = (patch: Record<string, string | null>, opts?: {replace?: boolean}) => {
    
    setSp(prev => {
      const next = new URLSearchParams(prev);
      for (const [key, value] of Object.entries(patch)) {
        if (value === null) next.delete(key);
        else next.set(key, value);
      }
      return next;
    }, { replace: opts?.replace ?? true});
  };

  const toNum = (v: string | null): number | null => {
    if (v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const toStr = (v: number | null | undefined) => (v ===null || v === undefined ? null : String(v));

  const isSidebarOpen = sp.get("sidebar") !== "0";
  const [selectedSystemName, setSelectedSystemName] = useState<string | null>(null);
  const selectedRecordSysId = sp.get("recordId");
  const servicesUi = useMemo(() => {
    return {
      systemId: toNum(sp.get("systemId")),
      open: sp.get("services") === "1",
    };
  }, [sp]);


  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f0f] text-white">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
        <TopBar 
        dc={dc}
        onChangeDc={onChangeDc}
        clusterId={clusterId}
        onChangeClusterId={onChangeClusterId}
        isUnitSelected={selectedUnitId !== null}
        isSidebarOpen={isSidebarOpen}
        onOpenSidebar={() => setParams({sidebar: "1"})}
        />
        <main className="content-scroll scrollbar-thin [scrollbar-gutter:stable] pr-3">
  {selectedRecordSysId ? (
    <div className="grid gap-(--panels-gap)">
      {/* top panels */}
      <div className="flex FLEX-N min-w-0 items-stretch gap-(--panels-gap)">
        <div className="flex-1 min-w-0">
          <SystemsPanel
            recordId={selectedRecordSysId}
            selectedSystemId={servicesUi.open ? servicesUi.systemId : null}
            onSelectSystem={(id, name) => {
              setSelectedSystemName(name);

              const currentlyOpen = sp.get("services") === "1";
              const currentId = toNum(sp.get("systemId"));

              if (currentlyOpen && currentId === id) {
                setParams({ systemId: toStr(id), services: "0" });
              } else {
                setParams({ systemId: toStr(id), services: "1" });
              }
            }}
          />
        </div>

        <CustomerMeetingWidget recordId={selectedRecordSysId} />
      </div>

      {/* services panel */}
      {servicesUi.systemId !== null && (
        <ServicesPanel
          systemId={servicesUi.systemId}
          systemName={selectedSystemName}
          open={servicesUi.open}
          onClosed={() => {
            setParams({ services: "0", systemId: null });
            setSelectedSystemName(null);
          }}
        />
      )}

      {/* main content */}
      <div className="min-w-0">
        {children}
        <Outlet />
      </div>
    </div>
  ) : (
    <>{children}</>
  )}
</main>
      </div>

      <div className={`sidebar-shell ${isSidebarOpen ? "open" : "closed"}`}>
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setParams({ sidebar: isSidebarOpen ? "0" : "1" })}
          onSelectRecord={(record) => {
            setSelectedSystemName(null);
            setParams({
              unitId: selectedUnitId ?? null,
              recordId: record.sys_id,
              systemId: null,
              services: null,
            });
          }}
        />

      </div>
    </div>
  );
}
