import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  pricePerNight: z.coerce.number().positive("Price must be positive"),
  guests: z.coerce.number().int().min(1, "At least 1 guest is required"),
  type: z.enum(["APARTMENT", "HOUSE", "VILLA", "CABIN"]),
  category: z.enum(["BEACH", "MOUNTAIN", "CITY", "COUNTRYSIDE"]),
  amenities: z.string().min(2, "Add at least one amenity"),
  available: z.boolean().default(true),
  availableFrom: z.string().optional(),
});

export type CreateListingFormValues = z.input<typeof createListingSchema>;
export type CreateListingSubmitValues = z.output<typeof createListingSchema>;