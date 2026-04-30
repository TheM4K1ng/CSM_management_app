import { apiGet } from "./http";
import type { SystemNode } from "../types/system";

export function fetchSystemsByRecordTree(recordId: number) {
    return apiGet<SystemNode[]>(`/systems/by_record_tree/?recordId=${recordId}`)
}

export function fetchSystemsByRecord(recordId: number) {
    return apiGet<SystemNode[]>(`/systems/by_record/?recordId=${recordId}`)
}