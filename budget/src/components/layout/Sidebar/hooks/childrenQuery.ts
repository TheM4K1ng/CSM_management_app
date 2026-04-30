import { useQuery } from "@tanstack/react-query";
import type { RecordNode } from "../../../../types/recordNode";
import { fetchRecordChildren } from "../../../../api/recordsApi";

export function useRecordChildren(parentSysId: string | null, enabled: boolean) {
    const key = parentSysId ?? "root";

    return useQuery<RecordNode[]>({
        queryKey: ["records", "children", key],
        queryFn: () => fetchRecordChildren(parentSysId),
        enabled,
        staleTime: 5 * 60_000,
    });
}