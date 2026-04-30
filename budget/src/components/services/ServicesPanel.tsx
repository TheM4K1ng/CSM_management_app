import { useServiceBySystem } from "./api";

type ServicesProps = {
  systemId: number;
  systemName?: string | null;
  open: boolean;
  onClosed: () => void;
};


export function ServicesPanel({ systemId, systemName, open, onClosed}: ServicesProps) {

    const { data: services = [], isLoading, error} = useServiceBySystem(systemId, open);
    const errMsg = error ? (error as Error).message : null;

   return (
    <section
      className={[
        "w-full overflow-hidden rounded-2xl",
        "border border-white/10 bg-[rgba(18,18,18,0.78)]",
        "shadow-[0px_14px_44px_rgba(0,0,0,0.28)]",
        "max-h-0 opacity-0 -translate-y-1.5 scale-[0.99]",
        "transition-[max-height,opacity,transform] duration-220 ease-out",
        open ? "max-h-105 opacity-100 translate-y-0 scale-100 outline-1 outline-white/5" : "",
      ].join(" ")}
      onTransitionEnd={(e) => {
        if (e.currentTarget === e.target && !open) onClosed();
      }}
    >
      <div className="grid gap-2.5 p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[13px] font-extrabold tracking-[0.2px] text-white/90">
            Services
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-extrabold text-white/85">
            {systemName ?? `#${systemId}`}
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {isLoading && <div className="text-xs text-white/60">Loading...</div>}
        {errMsg && <div className="text-xs text-white/60">{errMsg}</div>}

        {!isLoading && !errMsg && (
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-extrabold text-white/90"
              >
                <span className="h-1.75 w-1.75 rounded-full bg-white/35" aria-hidden="true" />
                <span className="whitespace-nowrap">{service.name}</span>
              </div>
            ))}

            {services.length === 0 && (
              <div className="text-xs text-white/60">No services for this system</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
