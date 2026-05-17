import { useQuery } from "@tanstack/react-query";
import { getHostListings } from "../api/hostListingsApi";

export function useHostListings(hostId?: string) {
  return useQuery({
    queryKey: ["host-listings", hostId],
    queryFn: () => getHostListings(hostId!),
    enabled: Boolean(hostId),
  });
}