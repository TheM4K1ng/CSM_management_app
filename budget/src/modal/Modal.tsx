import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CgClose } from "react-icons/cg";

export function Modal({
  title,
  children,
  onClose,
  footer,
  widthClass = "max-w-[720px]",
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  widthClass?: string;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="סגור"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          dir="rtl"
          className={[
            "w-full",
            widthClass,
            "rounded-3xl border border-white/10 bg-[#0f0f0f] shadow-2xl overflow-hidden",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          {/* Header: title on the right, ONLY close icon on the left */}
          <div className="flex items-center px-6 py-4 border-b border-white/10">
            <div className="text-base font-extrabold text-white text-right">
              {title}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="סגור"
              className="
                ms-auto
                h-9 w-9
                rounded-xl
                border border-white/10
                bg-white/5 hover:bg-white/10
                text-white/70 hover:text-white
                grid place-items-center
                cursor-pointer
                transition
              "
            >
              <CgClose className="text-[18px]" />
            </button>
          </div>

          <div className="px-6 py-5">{children}</div>

          {footer && (
            <div className="px-6 py-4 border-t border-white/10 flex items-center gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}