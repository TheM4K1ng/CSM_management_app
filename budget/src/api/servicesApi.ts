import { apiGet } from "./http";
import type { ServiceNode } from "../types/services";

export async function fetchServicesBySystem(systemId: number) {
    return apiGet<ServiceNode[]>(`/services/by_system/?systemId=${systemId}`);
}