import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import type { IconBaseProps } from "react-icons";
import { listMeetingsByRecord } from "../../api/meetingsApi";
import type { CustomerMeeting } from "../../types/customerMeeting";

type Props = {
  recordId: string;
};

const PlusIcon = FaPlus as unknown as React.FC<IconBaseProps>;

function preview(text: string, max = 180) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  return t.length <= max ? t : t.slice(0, max).trimEnd() + "…";
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("he-IL");
  } catch {
    return iso;
  }
}

export function CustomerMeetingWidget({ recordId }: Props) {
  const nav = useNavigate();
  const loc = useLocation();
  const returnTo = loc.pathname + loc.search;

  const { data: records = [], isLoading, error } = useQuery({
    queryKey: ["meetings", "byRecord", recordId],
    queryFn: () => listMeetingsByRecord(recordId),
    enabled: !!recordId,
  });

  const errMsg = error ? (error as Error).message : null;

  // ===== carousel config =====
  const PAGE_SIZE = 3;
  const CARD_W = 320;
  const CARD_H_DEFAULT = 140; // baseline on bigger screens
  const GAP = 16;
  const ARROW_W = 44;

  // Corner + button
  const PLUS_SIZE = 40; // px
  const PLUS_INSET = Math.round(PLUS_SIZE / 4); // ~1/4 inside the container
  const PLUS_OFFSET = PLUS_SIZE - PLUS_INSET; // how much goes outside

  // Measure panel height and compute a responsive card height
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [cardH, setCardH] = useState<number>(CARD_H_DEFAULT);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const h = el.getBoundingClientRect().height;

      // Vertical "costs" inside the panel:
      // p-3 => 24px total
      // header row ~ 32px
      // mt-3 between header and cards => 12px
      // safety buffer => 10px
      const reserved = 24 + 32 + 12 + 10;

      const available = h - reserved;

      // clamp so it never gets too small / too huge
      const next = Math.max(110, Math.min(available, 175));
      setCardH(next);
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const sorted = useMemo(
    () =>
      records
        .slice()
        .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")),
    [records]
  );

  const total = sorted.length;
  const [start, setStart] = useState(0);

  useEffect(() => {
    if (total <= PAGE_SIZE) setStart(0);
    else setStart((s) => Math.min(s, total - PAGE_SIZE));
  }, [total]);

  const canPrev = start > 0;
  const canNext = start + PAGE_SIZE < total;

  const visibleCount = Math.min(PAGE_SIZE, total);
  const baseViewportW =
    visibleCount === 0
      ? 0
      : visibleCount === 1
      ? CARD_W
      : visibleCount === 2
      ? CARD_W * 2 + GAP
      : CARD_W * 3 + GAP * 2;

  const arrowsVisible = total > PAGE_SIZE;

  // tiny safe padding inside viewport when arrows exist
  const EDGE_PAD = arrowsVisible ? 10 : 0;
  const viewportW = baseViewportW + EDGE_PAD * 2;

  const translateX = start * (CARD_W + GAP);

  function openNew() {
    nav(`/meetings/new?record=${encodeURIComponent(recordId)}`, {
      state: { returnTo, background: loc },
    });
  }

  const panelW = viewportW + (arrowsVisible ? ARROW_W * 2 : 0) + 24;

  return (
    <section className="relative shrink-0" style={{ width: panelW }}>
      {/* Corner PLUS (sits outside + inside, not clipped) */}
      <button
        type="button"
        onClick={openNew}
        aria-label="New meeting"
        className="
          absolute z-30
          rounded-full
          text-white
          shadow-[0_12px_30px_rgba(0,0,0,0.45)]
          bg-[#22c55e]
          hover:bg-[#4ade80]
          ring-1 ring-white/15
          transition
          flex items-center justify-center cursor-pointer
        "
        style={{
          width: PLUS_SIZE,
          height: PLUS_SIZE,
          top: -PLUS_OFFSET + 20, // you said you moved it a bit down/right already
          left: -PLUS_OFFSET + 15,
        }}
      >
        <PlusIcon className="text-[25px]" />
      </button>

      <div
        ref={panelRef}
        className="
          h-(--top-panels-h)
          rounded-2xl
          border border-white/10
          bg-[rgba(18,18,18,0.62)]
          shadow-[0_10px_26px_rgba(0,0,0,0.30)]
          p-3
          box-border
          overflow-hidden
        "
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-end">
            <div className="text-lg font-extrabold rtl text-right text-white">
              פגישות אחרונות
            </div>
          </div>

          {/* Cards block */}
          <div className="mt-3">
            {isLoading ? (
              <div className="w-full rounded-xl border border-white/15 px-3 py-2 text-xs text-white/65 text-center">
                טוען…
              </div>
            ) : errMsg ? (
              <div className="w-full rounded-xl border border-white/15 px-3 py-2 text-xs text-red-400 text-center">
                שגיאה: {errMsg}
              </div>
            ) : total === 0 ? (
              <button
                type="button"
                className="
                  w-full
                  rounded-2xl
                  border border-dashed border-white/15
                  bg-white/5 hover:bg-white/10
                  text-white/70 text-sm
                  cursor-pointer
                "
                style={{ height: cardH }}
                onClick={openNew}
              >
                אין פגישות — לחץ כדי ליצור פגישה ראשונה
              </button>
            ) : (
              <div
                className="grid items-center justify-center"
                style={{
                  gridTemplateColumns: arrowsVisible
                    ? `${ARROW_W}px ${viewportW}px ${ARROW_W}px`
                    : `0px ${viewportW}px 0px`,
                  height: cardH,
                }}
              >
                {/* Left arrow */}
                <button
                  type="button"
                  onClick={() => setStart((s) => Math.max(0, s - PAGE_SIZE))}
                  disabled={!canPrev}
                  aria-label="Previous meetings"
                  className={[
                    "h-full flex items-center justify-center",
                    canPrev
                      ? "cursor-pointer text-white/70 hover:text-white"
                      : "text-white/20 cursor-default",
                  ].join(" ")}
                >
                  <IoChevronBack className="text-3xl" />
                </button>

                {/* Viewport */}
                <div
                  dir="ltr"
                  className="overflow-hidden"
                  style={{
                    height: cardH,
                    paddingLeft: EDGE_PAD,
                    paddingRight: EDGE_PAD,
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{
                      gap: GAP,
                      transform: `translateX(-${translateX}px)`,
                      height: cardH,
                      alignItems: "stretch",
                    }}
                  >
                    {sorted.map((m: CustomerMeeting) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          nav(`/meetings/${m.id}`, {
                            state: { returnTo, background: loc },
                          })
                        }
                        className="
                          shrink-0
                          rounded-xl
                          border border-white/10
                          bg-white/5 hover:bg-white/10
                          p-4
                          transition
                          cursor-pointer
                        "
                        style={{ width: CARD_W, height: cardH }}
                      >
                        {/* make content start from the TOP and use the full height */}
                        <div dir="rtl" className="h-full text-right flex flex-col">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0 truncate text-[16px] font-extrabold text-white">
                              {m.customer_name}
                            </div>
                            <div className="shrink-0 text-xs text-white/60 ltr">
                              {fmtDate(m.date)}
                            </div>
                          </div>

                          <div className="mt-3 text-sm text-white/70 rtl line-clamp-4 leading-6">
                            {preview(m.summary)}
                          </div>

                          {/* optional: if you want the bottom to feel “filled”, this pushes summary up nicely */}
                          <div className="mt-auto" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right arrow */}
                <button
                  type="button"
                  onClick={() =>
                    setStart((s) =>
                      Math.min(s + PAGE_SIZE, Math.max(0, total - PAGE_SIZE))
                    )
                  }
                  disabled={!canNext}
                  aria-label="Next meetings"
                  className={[
                    "h-full flex items-center justify-center",
                    canNext
                      ? "cursor-pointer text-white/70 hover:text-white"
                      : "text-white/20 cursor-default",
                  ].join(" ")}
                >
                  <IoChevronForward className="text-3xl" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}