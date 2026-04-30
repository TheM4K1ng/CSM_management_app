type Meeting = {
  id: string;
  title: string;
  date: string;
  summary?: string | null;
};

function clamp3<T>(arr: T[]) {
  return arr.slice(0, 3);
}

export function MeetingsStrip({
  meetings,
  onOpenCreate,
  onOpenDetails,
}: {
  meetings: Meeting[];
  onOpenCreate: () => void;
  onOpenDetails: (id: string) => void;
}) {
  const visible = clamp3(meetings);
  const count = visible.length;

  // fixed card width; strip width adjusts to 1/2/3 cards
  const stripWidth =
    count === 0 ? "w-[260px]" :
    count === 1 ? "w-[260px]" :
    count === 2 ? "w-[540px]" :
    "w-[820px]";

  return (
    <section className={`shrink-0 ${stripWidth} min-w-65`}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-200">Meetings</h2>
        <button
          type="button"
          onClick={onOpenCreate}
          className="px-3 py-1.5 rounded-lg text-sm bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200"
        >
          New
        </button>
      </div>

      <div className="flex gap-3">
        {count === 0 ? (
          <button
            type="button"
            onClick={onOpenCreate}
            className="h-42.5 w-65 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60 text-zinc-300 flex items-center justify-center"
          >
            Create first meeting
          </button>
        ) : (
          visible.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onOpenDetails(m.id)}
              className="h-42.5 w-65 rounded-2xl border border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900/80 shadow-sm text-left p-4"
            >
              <div className="text-xs text-zinc-400">{m.date}</div>
              <div className="mt-1 text-base font-semibold text-zinc-100 line-clamp-1">
                {m.title}
              </div>
              <div className="mt-2 text-sm text-zinc-300 line-clamp-3">
                {m.summary ?? "—"}
              </div>
              <div className="mt-3 text-xs text-zinc-400">Open →</div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}