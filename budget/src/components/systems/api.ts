import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../api/http";
import type { SystemNode } from "../../types/system";

export function useSystemsByRecord(recordId: string | null) {
    return useQuery({
        queryKey: ["systems", "byRecord", recordId],
        queryFn: () => apiGet<SystemNode[]>(`/systems/by_record_tree/?recordId=${recordId}`),
        enabled: !!recordId,
        staleTime: 30_000,
    });
}