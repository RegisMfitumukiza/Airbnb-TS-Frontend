export type ListingType = "APARTMENT" | "HOUSE" | "VILLA" | "CABIN";

export type ListingCategory =
    | "BEACH"
    | "MOUNTAIN"
    | "CITY"
    | "COUNTRYSIDE";

export type ListingHost = {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
};

export type Listing = {
    id: string;
    title: string;
    description: string;
    location: string;
    latitude?: number | null;
    longitude?: number | null;
    pricePerNight: number;
    guests: number;
    type: ListingType;
    amenities: string[];
    rating: number | null;

    reviews?: {
        id: string;
        rating: number;
        comment: string;
        userId: string;
        listingId: string;
        createdAt: string;
        user?: {
            id: string;
            name: string;
            avatar: string | null;
        };
    }[];

    coverImage: string | null;
    coverImagePublicId?: string | null;

    images: string[];
    imagesPublicIds?: string[];

    available: boolean;
    availableFrom: string | null;
    category: ListingCategory;
    superhost: boolean;

    hostId: string;
    host?: ListingHost;

    createdAt: string;
    updatedAt: string;
};