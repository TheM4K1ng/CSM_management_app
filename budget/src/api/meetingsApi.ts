import { apiGet, apiPost, apiDelete } from "./http";
import type { CustomerMeeting } from "../types/customerMeeting";

export function listMeetingsByRecord(recordSysId: string) {
    return apiGet<CustomerMeeting[]>(`/meetings/?record=${encodeURIComponent(recordSysId)}`);
}

export function getMeeting(id: number) {
    return apiGet<CustomerMeeting>(`/meetings/${id}`);
}

export function createMeeting(payload: {
    record: string;
    customer_name: string;
    date: string;
    summary: string;
}) {
    return apiPost<CustomerMeeting, typeof payload>(`/meetings/`, payload);
}

export function deleteMeeting(id: number) {
    return apiDelete<void>(`/meetings/${id}`);
}