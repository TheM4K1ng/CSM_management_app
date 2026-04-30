import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../../api/http";
import type { ServiceNode } from "../../types/services";

export function useServiceBySystem(systemId: number | null, open: boolean) {
    const enabled = open && typeof systemId === "number" && systemId > 0;

    return useQuery({
        queryKey: ["services", "bySystem", systemId],
        queryFn: () => apiGet<ServiceNode[]>(`/services/by_system/?systemId=${systemId}`),
        enabled,
        staleTime: 60_000,
    });
}