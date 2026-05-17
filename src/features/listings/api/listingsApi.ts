import api from "../../../lib/api";
import type { Listing } from "../types";


type ListingsResponse = {
    success: boolean,
    message: string,
    data: Listing[]
}

type ListingResponse = {
  success: boolean;
  message: string;
  data: Listing;
};


export async function getListings() {
    const response = await api.get<ListingsResponse>("/listings");
    return response.data.data
}

export async function getListingById(id: string): Promise<Listing> {
    const response = await api.get<ListingResponse>(`/listings/${id}`);
    return response.data.data;
}