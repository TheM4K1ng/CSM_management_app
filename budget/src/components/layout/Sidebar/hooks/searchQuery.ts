import { useQuery } from "@tanstack/react-query";
import { searchRecords } from "../../../../api/recordsApi";
import type { RecordSearchHit } from "../../../../api/recordsApi";

export function useRecordSearch(query: string, isOpen: boolean) {
    const q = query.trim();

    return useQuery<RecordSearchHit[]>({
        queryKey: ["records", "search", q],
        queryFn: () => searchRecords(q),
        enabled: isOpen && q.length> 0,
        staleTime: 20_000,
    });
}