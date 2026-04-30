import { apiGet } from "./http";
import type { RecordNode } from "../types/recordNode";

export function fetchRecordChildren(parentSysId: string | null) {
  return apiGet<RecordNode[]>(
    `/records/?parent=${encodeURIComponent(parentSysId ?? "")}`
  );
}

export type RecordSearchHit = RecordNode & {
  parent_sys_id: string | null;
  path?: { sys_id: string; name: string }[];
};

export async function searchRecords(q: string) {
  return apiGet<RecordSearchHit[]>(`/records/search/?q=${encodeURIComponent(q)}`);
}
