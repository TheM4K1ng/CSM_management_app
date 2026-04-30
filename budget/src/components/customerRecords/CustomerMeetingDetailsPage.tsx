import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CustomerMeeting } from "../../types/customerMeeting";
import { deleteMeeting, getMeeting } from "../../api/meetingsApi";
import { Modal } from "../../modal/Modal";
import { ConfirmDeleteModal } from "../../modal/ConfirmDeletionModal";

function fmtDate(isoOrDate: string) {
  try {
    return new Date(isoOrDate).toLocaleDateString("he-IL");
  } catch {
    return isoOrDate;
  }
}

function goBack(nav: ReturnType<typeof useNavigate>, returnTo?: string) {
  if (returnTo) nav(returnTo);
  else nav(-1);
}

export function CustomerMeetingDetailsPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const { id } = useParams<{ id: string }>();

  const returnTo = (loc.state as any)?.returnTo as string | undefined;

  const meetingId = useMemo(() => {
    if (!id) return null;
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  }, [id]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const qc = useQueryClient();

  const meetingQuery = useQuery<CustomerMeeting>({
    queryKey: ["meetings", "byId", meetingId],
    queryFn: () => {
      if (meetingId === null) throw new Error("Invalid meeting id");
      return getMeeting(meetingId);
    },
    enabled: meetingId !== null,
  });

  const del = useMutation({
    mutationFn: async () => {
      if (meetingId === null) throw new Error("Invalid meeting id");
      await deleteMeeting(meetingId);
    },
    onSuccess: async () => {
      const recordId = meetingQuery.data?.record;

      if (recordId) {
        await qc.invalidateQueries({ queryKey: ["meetings", "byRecord", recordId] });
      }
      await qc.invalidateQueries({ queryKey: ["meetings"] });

      setConfirmOpen(false);
      goBack(nav, returnTo);
    },
    onError: () => {
      // keep confirm open so user sees the error (if you want to show it later)
    },
  });

  if (!id || meetingId === null) {
    return (
      <Modal title="פגישה" onClose={() => goBack(nav, returnTo)}>
        <div className="text-sm text-white/70 text-right">מזהה פגישה לא תקין.</div>
      </Modal>
    );
  }

  if (meetingQuery.isLoading) {
    return (
      <Modal title="פגישה" onClose={() => goBack(nav, returnTo)}>
        <div className="text-sm text-white/70 text-right">טוען…</div>
      </Modal>
    );
  }

  if (meetingQuery.error) {
    return (
      <Modal title="פגישה" onClose={() => goBack(nav, returnTo)}>
        <div className="text-sm text-white/70 text-right">
          שגיאה: {(meetingQuery.error as Error).message}
        </div>
      </Modal>
    );
  }

  const record = meetingQuery.data;
  if (!record) {
    return (
      <Modal title="פגישה" onClose={() => goBack(nav, returnTo)}>
        <div className="text-sm text-white/70 text-right">לא נמצאה פגישה (ID: {id})</div>
      </Modal>
    );
  }

  return (
    <>
      <Modal
        title="פרטי פגישה"
        onClose={() => goBack(nav, returnTo)}
        footer={
          <div className="w-full flex items-center">
            {/* Primary on the right */}
            <button
              type="button"
              className="
                px-4 py-2 rounded-xl
                border border-red-500/25
                bg-red-600/15 hover:bg-red-600/25
                text-red-200
                cursor-pointer
              "
              onClick={() => setConfirmOpen(true)}
            >
              מחק
            </button>

            {/* Optional: keep a secondary action left, but not “Back” duplication */}
            <div className="ms-auto text-xs text-white/50">
              {fmtDate(record.date)}
            </div>
          </div>
        }
      >
        {/* Single “note” container */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-xs text-white/55 text-right">שם לקוח</div>
          <div className="mt-1 text-lg font-extrabold text-white text-right">
            {record.customer_name}
          </div>

          <div className="mt-4 h-px bg-white/10" />

          <div className="mt-4 text-xs text-white/55 text-right">סיכום פגישה</div>
          <div className="mt-2 text-sm text-white/80 whitespace-pre-wrap text-right leading-7">
            {record.summary || "—"}
          </div>
        </div>
      </Modal>

      {confirmOpen && (
        <ConfirmDeleteModal
          title="למחוק את הפגישה?"
          message={
            <>
              למחוק את הפגישה של{" "}
              <span className="font-bold text-white">{record.customer_name}</span>?
            </>
          }
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => del.mutate()}
          pending={del.isPending}
        />
      )}
    </>
  );
}