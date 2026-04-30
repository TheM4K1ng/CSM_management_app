import { useSystemsByRecord } from "./api";

type Props = {
    recordId: string | null;
    selectedSystemId: number | null;
    onSelectSystem: (systemId: number, systemName: string) => void;
};


export function SystemsPanel({recordId, selectedSystemId, onSelectSystem}: Props) {
    const { data: systems = [], isLoading, error} = useSystemsByRecord(recordId);
    const errMsg = error ? (error as Error).message : null;

    return (
        <section 
        className="
        box-border
        flex h-(--top-panels-h) min-h-0 w-full min-w-0 flex-col
        rounded-2xl
        border border-white/10
        bg-[rgba(18,18,18,0.78)]
        p-3.5
        shadow-[0_10px_26px_rgba(0,0,0,0.30)]
        outline-1 outline-white/5
        lg:flex-[0_1_var(--systems-w)]
        [max-width:980px]:flex-none [max-width:980px]:w-full
        "
        aria-busy={isLoading ? "true" : "false"} 
        >
            <div className="flex items-center justify-between gap-2.5 px-1 pb-2.5 pt-1">
                <h3 className="m-0 text-[15px] font-extrabold tracking-[0.2px] text-white/90">
                Systems
                </h3>
            </div>

            <div className="scollbar-thin grid min-h-0 min-w-0 grid-cols-3 gap-2 overflow-auto pr-2 pt-1">
                {isLoading && <div className="text-xs text-white/60">Loading...</div>}
                {errMsg && <div className="text-xs text-white/60">{errMsg}</div>}

                {!isLoading && !errMsg && systems.map(system => {const active = selectedSystemId === system.id;

                    return (
                    <button 
                    key={system.id}  
                    onClick={ () => onSelectSystem(system.id, system.name)}  
                    type="button"
                    className={[
                        "flex h-23 w-full flex-col items-center justify-center gap-2 cursor-pointer",
                        "rounded-[14px] border border-white/10 bg-white/5 px-2 py-2.5",
                        "transition-transform duration-150 ease-out",
                        "hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10",
                        active ? "border-white/25 bg-white/12 -translate-y-0.5" : "",

                    ].join(" ")}
                    >
                       
                        <div className="grid h-10.5 place-items-center rounded-[14px]
                        border border-white/10 bg-black/30" aria-hidden="true">
                            {system.icon ? (
                                <img src={system.icon ?? undefined} alt="" className="system-icon"/>
                            ) : (
                                <div className="h-5.5 w-5.5" />
                            )}
                            
                        </div>
                        <div className="
                        w-full overflow-hidden text-ellipsis whitespace-nowrap
                        text-center text-xs font-extrabold text-white/90"
                        >
                            {system.name}
                        </div>
                    </button> );
                })}
                {!isLoading && !errMsg && systems.length === 0 && (
                    <div className="text-xs text-white/60">No systems found for this team</div>
                )}
            </div>
        </section>
    );
}