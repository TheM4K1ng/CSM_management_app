import { Modal } from "./Modal";

export function ConfirmDeleteModal({
  title = "למחוק את הפגישה?",
  message,
  onCancel,
  onConfirm,
  pending,
}: {
  title?: string;
  message: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  pending: boolean;
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      widthClass="max-w-[520px]"
      footer={
        <div className="w-full flex items-center gap-2">
          {/* Primary on RIGHT in RTL */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="
              px-4 py-2 rounded-xl
              bg-red-600/90 hover:bg-red-600
              text-white
              disabled:opacity-60 disabled:cursor-not-allowed
              cursor-pointer
            "
          >
            {pending ? "מוחק…" : "מחק"}
          </button>

          <button
            className="btn-secondary cursor-pointer ms-auto"
            type="button"
            onClick={onCancel}
            disabled={pending}
          >
            ביטול
          </button>
        </div>
      }
    >
      <div className="text-sm text-white/80 text-right">{message}</div>

      <div className="mt-3 rounded-2xl border border-red-500/20 bg-red-950/30 px-4 py-3 text-sm text-red-200 text-right">
        לא ניתן לבטל פעולה זו.
      </div>
    </Modal>
  );
}