import type { DC } from "../../types/dc";


type TopBarProps = {
  dc: DC;
  onChangeDc: (dc:DC) => void;

  clusterId: string;
  onChangeClusterId: (clusterId: string) => void;

  isUnitSelected: boolean;

  isSidebarOpen: boolean;
  onOpenSidebar: () => void;
};

function clustersForDc(dc:DC) {
  const prefix = dc === "south" ? "south" : "central";
  return Array.from({length: 6}, (_, i) => `${prefix}-${i + 1}`);
}

export function TopBar({
  dc,
  onChangeDc,
  clusterId,
  onChangeClusterId,
  isUnitSelected,
  isSidebarOpen,
  onOpenSidebar,
} : TopBarProps) {

  const clusters = clustersForDc(dc);
  return (
      <header className="
       flex h-16 items-center gap-3 overflow-hidden
       border-b border-white/10 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          <h1 className="
           m-0 max-w-90 truncate text-[20px] leading-none
           [max-width:1100px]:max-w-55 [max-width:980px]:max-w-35">Units Overview</h1>

          <div className="
           inline-flex whitespace-nowrap rounded-xl border
           border-white/10 bg-[#0f0f0f] p-1">
            <button 
            type="button"
            className={[
              "cursor-pointer rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition",
              "text-white/60 hover:text-white",
              dc === "south"
                ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]"
                : "",
            ].join(" ")}
            onClick={() => onChangeDc("south")}
            >South
            </button>

            <button 
            type="button"
            className={[
              "cursor-pointer rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition",
              "text-white/60 hover:text-white",
              dc === "central"
                ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]"
                : "",
            ].join(" ")}
            onClick={() => onChangeDc("central")}
            >Central
            </button>
          </div>
        </div>

        <div className="
        flex min-w-0 flex-nowrap items-center gap-2.5 
        overflow-x-auto whitespace-nowrap [scrollbar-width:thin]">
          {isUnitSelected && (
            <select
            className="
             h-9 w-27.5 min-w-27.5
              rounded-[10px]
              border border-white/15
              bg-[#0f0f0f]
              px-2.5
              text-[13px]
              text-white
              outline-none
              focus:border-white/25
              [max-width:900px]:w-27.5
            "
            value={clusterId}
            onChange={e => onChangeClusterId(e.target.value)}
            title="Cluster"
            >
              {clusters.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>
      </header>
  )
}