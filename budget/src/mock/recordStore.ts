import type { CustomerMeeting } from "../types/customerMeeting";

const KEY = "csm_customer_record_v1";

function safeParse(json: string | null): CustomerMeeting[] {
  if (!json) return [];
  try {
    const data = JSON.parse(json);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function getCustomerRecords(): CustomerMeeting[] {
  return safeParse(localStorage.getItem(KEY));
}

export function saveCustomerRecords(customerRecords: CustomerMeeting[]) {
  localStorage.setItem(KEY, JSON.stringify(customerRecords));
}

export function addCustomerRecord(customerRecord: CustomerMeeting) {
  const all = getCustomerRecords();
  saveCustomerRecords([customerRecord, ...all]);
}

export function getCustomerRecordById(id: number): CustomerMeeting | undefined {
  return getCustomerRecords().find(r => r.id === id);
}

export function deleteCustomerRecordById(id: number) {
  const all = getCustomerRecords();
  saveCustomerRecords(all.filter(r => r.id !== id));
}

export function getRecentCustomerRecordsForTeam(teamId: number, limit = 5): CustomerMeeting[] {
  return getCustomerRecords()
    .filter(r => r.teamId === teamId)
    .sort((a, b) => (b.createdAtISO || "").localeCompare(a.createdAtISO || ""))
    .slice(0, limit);
}
