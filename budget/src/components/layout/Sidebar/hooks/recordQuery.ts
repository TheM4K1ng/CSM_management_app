import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { fetchRecordChildren } from "../../../../api/recordsApi";
export function useRecordRoots(isOpen: boolean) {
    return useQuery({
        queryKey: ["records", "roots"],
        queryFn: () => fetchRecordChildren(null),
        enabled: isOpen,
        staleTime: 5 * 60_000,
    });
}