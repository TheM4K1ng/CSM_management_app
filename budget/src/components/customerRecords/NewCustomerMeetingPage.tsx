import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMeeting } from "../../api/meetingsApi";
import { Modal } from "../../modal/Modal";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type FormValues = {
  customer_name: string;
  date: string;
  summary: string;
};

export function NewCustomerMeetingPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const returnTo = (loc.state as any)?.returnTo ?? "/";

  const [sp] = useSearchParams();
  const record = sp.get("record");

  const todayISO = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const {
  register,
  handleSubmit,
  setValue,
  watch,
  formState: { errors, isValid },
} = useForm<FormValues>({
  mode: "onChange",
  defaultValues: {
    customer_name: "",
    date: todayISO,
    summary: "",
  },
});

  const [selected, setSelected] = useState<Date | undefined>(() => new Date(todayISO));

  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (!record) throw new Error("Record not provided");
      return await createMeeting({
        record,
        customer_name: values.customer_name.trim(),
        date: values.date,
        summary: values.summary.trim(),
      });
    },
    onSuccess: async () => {
      if (record) {
        await qc.invalidateQueries({ queryKey: ["meetings", "byRecord", record] });
      }
      nav(returnTo);
    },
  });

  if (!record) {
    return <div className="text-xs text-white/70 text-right">חסר record.</div>;
  }

  return (
    <Modal
      title="פגישה חדשה"
      onClose={() => nav(returnTo)}
      footer={
        <div className="w-full flex items-center gap-2">
          <button
            className="btn-primary cursor-pointer"
            type="submit"
            form="new-meeting-form"
            disabled={!isValid || mutation.isPending}
          >
            {mutation.isPending ? "שומר..." : "הוסף פגישה"}
          </button>

          <button
            type="button"
            className="btn-secondary cursor-pointer ms-auto"
            onClick={() => nav(returnTo)}
            disabled={mutation.isPending}
          >
            ביטול
          </button>
        </div>
      }
    >
      <form
        id="new-meeting-form"
        dir="rtl"
        className="grid gap-3 md:grid-cols-[1fr_220px] grid-cols-1"
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
      >
        <label className="grid gap-1.5">
          <div className="label-muted text-right">שם לקוח</div>
          <input
            className="input-dark"
            placeholder="לדוגמה: Acme Corp"
            {...register("customer_name", { required: "חובה למלא שם לקוח" })}
          />
          {errors.customer_name && (
            <div className="text-xs text-white/70 text-right">
              {errors.customer_name.message}
            </div>
          )}
        </label>
        <label className="grid gap-2">
            <div className="label-muted text-right">תאריך</div>

            {/* keep RHF registered */}
            <input type="hidden" {...register("date", { required: true })} />

            {/* Selected date display */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
              <div className="text-sm text-white/90">
                {watch("date")
                  ? new Date(watch("date")).toLocaleDateString("he-IL")
                  : "בחר תאריך"}
              </div>
              <div className="text-[11px] text-white/40">YYYY-MM-DD</div>
            </div>

            {/* Calendar box */}
            <div className="inline-block w-fit max-w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3">
              <DayPicker
                mode="single"
                numberOfMonths={1}
                selected={selected}
                onSelect={(date) => {
                  setSelected(date);
                  if (date) {
                    const yyyy = date.getFullYear();
                    const mm = String(date.getMonth() + 1).padStart(2, "0");
                    const dd = String(date.getDate()).padStart(2, "0");
                    setValue("date", `${yyyy}-${mm}-${dd}`, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }
                }}
                showOutsideDays
                fixedWeeks
                className="text-white"
                styles={{
                  root: { width: 280 },
                  month: { width: 280 },
                  table: { width: "100%" },
                }}
                classNames={{
                  months: "flex justify-center",
                  month: "m-0",
                  caption: "flex items-center justify-between mb-2",
                  caption_label: "text-sm font-extrabold text-white/90",
                  nav: "flex items-center gap-1",
                  nav_button:
                    "h-7 w-7 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 grid place-items-center text-white/70 hover:text-white transition",

                  table: "w-full",
                  head_row: "grid grid-cols-7",
                  head_cell: "text-[10px] text-white/45 text-center",
                  row: "grid grid-cols-7 mt-1",
                  cell: "grid place-items-center",
                  day: "h-7 w-7 rounded-lg text-[11px] text-white/85 hover:bg-white/10 transition",
                  day_selected: "bg-fuchsia-500/35 text-white hover:bg-fuchsia-500/45",
                  day_today: "ring-1 ring-white/15",
                  day_outside: "text-white/25",
                }}
              />
            </div>

            {errors.date && (
              <div className="text-xs text-red-300 text-right">חובה לבחור תאריך</div>
            )}
          </label>

        <label className="grid gap-1.5 md:col-span-full col-span-1">
          <div className="label-muted text-right">סיכום פגישה</div>
          <textarea
            className="input-dark min-h-35 resize-y"
            {...register("summary", { required: "חובה למלא סיכום" })}
            placeholder="נקודות חשובות, נקיטת פעולות, סיכונים..."
            rows={6}
          />
          {errors.summary && (
            <div className="text-xs text-white/70 text-right">{errors.summary.message}</div>
          )}
        </label>

        {mutation.error && (
          <div className="rounded-xl border border-white/15 px-3 py-2 text-xs text-white/70 md:col-span-full">
            שגיאה: {(mutation.error as Error).message}
          </div>
        )}
      </form>
    </Modal>
  );
}