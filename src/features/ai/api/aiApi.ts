import api from "../../../lib/api";
import type { Listing, ListingCategory, ListingType } from "../../listings/types";

export type AiSearchFilters = {
  location?: string;
  type?: ListingType;
  category?: ListingCategory;
  guests?: number;
  maxPrice?: number;
};

export type AiSearchResponse = {
  filters?: AiSearchFilters;
  listings?: Listing[];
  count?: number;
};

export type GenerateListingDescriptionPayload = {
  title: string;
  location: string;
  type: ListingType;
  category?: ListingCategory;
  amenities: string[];
  guests: number;
  price: number;
};

export type AiChatPayload = {
  message: string;
  sessionId: string;
};

export type AiChatResponse = {
  answer?: string;
  reply?: string;
  message?: string;
};

export async function naturalLanguageSearch(
  query: string
): Promise<AiSearchResponse> {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: AiSearchResponse;
  }>("/ai/listings/search", { query });

  return response.data.data;
}

export async function generateListingDescription(
  payload: GenerateListingDescriptionPayload
): Promise<string> {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: {
      description: string;
    };
  }>("/ai/listings/description", payload);

  return response.data.data.description;
}

export async function sendAiChat(
  payload: AiChatPayload
): Promise<AiChatResponse> {
  const response = await api.post<{
    success: boolean;
    message: string;
    data: AiChatResponse;
  }>("/ai/chat", payload);

  return response.data.data;
}