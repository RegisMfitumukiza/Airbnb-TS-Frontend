import { useQuery } from '@tanstack/react-query';
import  { getListings, getListingById } from '../api/listingsApi'


export function useListings() {
    return useQuery({
        queryKey: ['listings'],
        queryFn: getListings
    });
}

export function useListing(id?: string) {
    return useQuery({
        queryKey: ['listing', id],
        queryFn: () => getListingById(id!),
        enabled: Boolean(id)
    });
}