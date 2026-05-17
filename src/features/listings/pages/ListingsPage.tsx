import { differenceInDays } from "date-fns";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
    FaFacebookF,
    FaHeart,
    FaInstagram,
    FaLinkedinIn,
    FaMagic,
    FaMapMarkerAlt,
    FaMountain,
    FaRegCheckCircle,
    FaSearch,
    FaShieldAlt,
    FaSlidersH,
    FaStar,
    FaTimes,
    FaTwitter,
    FaUmbrellaBeach,
    FaCity,
    FaLeaf,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

import { Spinner } from "../../../shared/components/Spinner";
import { useAiSearch } from "../../ai";
import { ListingCard } from "../components/ListingCard";
import { useListings } from "../hooks/useListings";
import { useSavedListings } from "../hooks/useSavedListings";
import type { Listing, ListingType } from "../types";

const typeFilters: Array<"ALL" | ListingType> = [
    "ALL",
    "APARTMENT",
    "HOUSE",
    "VILLA",
    "CABIN",
];

const categoryFilters = ["ALL", "CITY", "BEACH", "MOUNTAIN", "COUNTRYSIDE"];

const destinations = [
    {
        name: "Kigali",
        description: "City apartments and modern stays",
    },
    {
        name: "Rwamagana",
        description: "Quiet homes and countryside stays",
    },
    {
        name: "Musanze",
        description: "Mountain escapes and nature retreats",
    },
    {
        name: "Rubavu",
        description: "Beach-style stays and lake trips",
    },
];

const inspiration = [
    {
        label: "Beach escapes",
        value: "BEACH",
        icon: <FaUmbrellaBeach />,
    },
    {
        label: "Mountain retreats",
        value: "MOUNTAIN",
        icon: <FaMountain />,
    },
    {
        label: "City adventures",
        value: "CITY",
        icon: <FaCity />,
    },
    {
        label: "Countryside homes",
        value: "COUNTRYSIDE",
        icon: <FaLeaf />,
    },
];

function formatFilterLabel(value: string) {
    return value === "ALL"
        ? "All stays"
        : value.charAt(0) + value.slice(1).toLowerCase();
}

type AiSearchResult = {
    listings?: Listing[];
    results?: Listing[];
    filters?: {
        location?: string;
        type?: ListingType;
        category?: string;
        guests?: number;
        maxPrice?: number;
    };
    extractedFilters?: {
        location?: string;
        type?: ListingType;
        category?: string;
        guests?: number;
        maxPrice?: number;
    };
    count?: number;
};

export function ListingsPage() {
    const [query, setQuery] = useState("");
    const [savedOnly, setSavedOnly] = useState(false);
    const [aiListings, setAiListings] = useState<Listing[] | null>(null);
    const [selectedType, setSelectedType] = useState<"ALL" | ListingType>("ALL");
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const aiSearch = useAiSearch();
    const { saved, toggleSave, isSaved } = useSavedListings();

    const {
        data: listings = [],
        isLoading,
        isError,
        error,
    } = useListings();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const clearFilters = () => {
        setQuery("");
        setSelectedType("ALL");
        setSelectedCategory("ALL");
        setSavedOnly(false);
        setAiListings(null);
    };

    const handleDestinationClick = (destination: string) => {
        setQuery(destination);
        setSelectedType("ALL");
        setSelectedCategory("ALL");
        setAiListings(null);
        scrollToTop();
    };

    const handleInspirationClick = (category: string) => {
        setQuery("");
        setSelectedType("ALL");
        setSelectedCategory(category);
        setAiListings(null);
        scrollToTop();
    };

    const handleAiSearch = () => {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length < 5) {
            toast.error("AI search needs at least 5 characters");
            return;
        }

        aiSearch.mutate(trimmedQuery, {
            onSuccess: (result: AiSearchResult) => {
                const resultListings = result.results || result.listings;

                if (resultListings) {
                    setAiListings(resultListings);

                    toast.success(
                        resultListings.length > 0
                            ? `AI found ${resultListings.length} stay${resultListings.length === 1 ? "" : "s"
                            }`
                            : "AI found no matching stays"
                    );

                    return;
                }

                const filters = result.extractedFilters || result.filters;

                if (filters) {
                    const filtered = listings.filter((listing) => {
                        const matchesLocation = filters.location
                            ? listing.location
                                .toLowerCase()
                                .includes(filters.location.toLowerCase())
                            : true;

                        const matchesType = filters.type
                            ? listing.type === filters.type
                            : true;

                        const matchesCategory = filters.category
                            ? listing.category.toLowerCase() ===
                            filters.category.toLowerCase()
                            : true;

                        const matchesGuests = filters.guests
                            ? listing.guests >= filters.guests
                            : true;

                        const matchesPrice = filters.maxPrice
                            ? listing.pricePerNight <= filters.maxPrice
                            : true;

                        return (
                            matchesLocation &&
                            matchesType &&
                            matchesCategory &&
                            matchesGuests &&
                            matchesPrice
                        );
                    });

                    setAiListings(filtered);

                    toast.success(
                        filtered.length > 0
                            ? `AI found ${filtered.length} stay${filtered.length === 1 ? "" : "s"
                            }`
                            : "AI found no matching stays"
                    );

                    return;
                }

                setAiListings([]);
                toast.error("AI search returned no usable results");
            },
            onError: () => {
                toast.error("AI search failed. Try a clearer sentence.");
            },
        });
    };

    const filteredListings = useMemo(() => {
        const normalizedQuery = query.toLowerCase().trim();
        const sourceListings = aiListings || listings;

        return sourceListings
            .filter((listing) => {
                if (selectedType !== "ALL" && listing.type !== selectedType) {
                    return false;
                }

                if (
                    selectedCategory !== "ALL" &&
                    listing.category !== selectedCategory
                ) {
                    return false;
                }

                return true;
            })
            .filter((listing) => {
                if (!normalizedQuery || aiListings) return true;

                const isLuxury = listing.pricePerNight > 300;

                return (
                    listing.title.toLowerCase().includes(normalizedQuery) ||
                    listing.description.toLowerCase().includes(normalizedQuery) ||
                    listing.location.toLowerCase().includes(normalizedQuery) ||
                    listing.type.toLowerCase().includes(normalizedQuery) ||
                    listing.category.toLowerCase().includes(normalizedQuery) ||
                    listing.amenities.some((amenity) =>
                        amenity.toLowerCase().includes(normalizedQuery)
                    ) ||
                    String(listing.pricePerNight).includes(normalizedQuery) ||
                    (normalizedQuery.includes("luxury") && isLuxury) ||
                    (normalizedQuery.includes("available") && listing.available)
                );
            })
            .filter((listing) => {
                if (!savedOnly) return true;
                return isSaved(listing.id);
            });
    }, [
        query,
        listings,
        aiListings,
        savedOnly,
        isSaved,
        selectedType,
        selectedCategory,
    ]);

    const luxuryListings = filteredListings.filter(
        (listing) => listing.pricePerNight > 300
    );

    const normalListings = filteredListings.filter(
        (listing) => listing.pricePerNight <= 300
    );

    const superhostListings = filteredListings.filter(
        (listing) => listing.superhost
    );

    const guestFavorites = filteredListings.filter(
        (listing) => (listing.rating ?? 0) >= 4.5
    );

    const recentlyAdded = filteredListings.filter(
        (listing) => differenceInDays(new Date(), new Date(listing.createdAt)) <= 7
    );

    if (isLoading) return <Spinner />;

    if (isError) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-12">
                <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-8 text-center font-semibold text-rose-600">
                    Failed to load listings: {error.message}
                </div>
            </main>
        );
    }

    return (
        <main className="bg-white">
            <section className="mx-auto max-w-7xl px-6 py-10">
                <section className="mb-10 rounded-[3rem] bg-gradient-to-r from-rose-50 via-white to-white p-8 md:p-12">
                    <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-rose-500">
                        Explore stays
                    </p>

                    <h1 className="mt-4 max-w-5xl text-5xl font-black tracking-tight text-neutral-950 md:text-7xl">
                        Find stays you&apos;ll love
                    </h1>

                    <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-500">
                        Discover villas, homes, apartments, and peaceful places to stay.
                    </p>

                    <div className="mt-8 rounded-[2rem] border border-neutral-200 bg-white p-3 shadow-xl shadow-neutral-200/70">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                            <label className="flex flex-1 items-center gap-3 rounded-full px-5 py-4 transition focus-within:bg-neutral-50">
                                <FaSearch className="text-neutral-400" />

                                <input
                                    value={query}
                                    onChange={(event) => {
                                        setQuery(event.target.value);
                                        if (aiListings) setAiListings(null);
                                    }}
                                    placeholder="Search stays, location, wifi, price, or ask AI..."
                                    className="w-full bg-transparent text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400"
                                />
                            </label>

                            <button
                                type="button"
                                onClick={handleAiSearch}
                                disabled={aiSearch.isPending}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 py-4 text-sm font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
                            >
                                <FaMagic />
                                {aiSearch.isPending ? "Searching..." : "AI Search"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setSavedOnly((current) => !current)}
                                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold transition ${savedOnly
                                        ? "bg-rose-500 text-white"
                                        : "bg-rose-50 text-rose-500 hover:bg-rose-100"
                                    }`}
                            >
                                <FaHeart />
                                {savedOnly ? "Show all" : `${saved.length} saved`}
                            </button>
                        </div>
                    </div>
                </section>

                <section className="mb-8 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-500">
                        <FaSlidersH className="text-rose-500" />
                        Filter stays
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {typeFilters.map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setSelectedType(type)}
                                className={`whitespace-nowrap rounded-full border px-5 py-3 text-sm font-bold transition ${selectedType === type
                                        ? "border-neutral-950 bg-neutral-950 text-white"
                                        : "border-neutral-200 text-neutral-700 hover:border-rose-500 hover:text-rose-500"
                                    }`}
                            >
                                {formatFilterLabel(type)}
                            </button>
                        ))}
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {categoryFilters.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setSelectedCategory(category)}
                                className={`whitespace-nowrap rounded-full border px-5 py-3 text-sm font-bold transition ${selectedCategory === category
                                        ? "border-rose-500 bg-rose-500 text-white"
                                        : "border-neutral-200 text-neutral-700 hover:border-rose-500 hover:text-rose-500"
                                    }`}
                            >
                                {formatFilterLabel(category)}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <p className="font-semibold text-neutral-600">
                        {filteredListings.length}{" "}
                        {filteredListings.length === 1 ? "stay" : "stays"} found
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {aiListings && (
                            <button
                                type="button"
                                onClick={() => setAiListings(null)}
                                className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-500"
                            >
                                AI results active
                                <FaTimes />
                            </button>
                        )}

                        {(selectedType !== "ALL" ||
                            selectedCategory !== "ALL" ||
                            savedOnly ||
                            aiListings ||
                            query.trim()) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-black text-neutral-700 transition hover:bg-neutral-950 hover:text-white"
                                >
                                    Clear filters
                                </button>
                            )}
                    </div>
                </div>

                {filteredListings.length === 0 ? (
                    <section className="rounded-[2rem] border border-dashed border-neutral-300 p-12 text-center">
                        <h2 className="text-2xl font-black text-neutral-950">
                            No stays found
                        </h2>

                        <p className="mt-3 text-neutral-500">
                            Try another search, clear AI results, or change filters.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-5 rounded-full bg-neutral-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-500"
                        >
                            Clear filters
                        </button>
                    </section>
                ) : (
                    <div className="space-y-16">
                        {luxuryListings.length > 0 && (
                            <ListingSection
                                title="Popular luxury stays"
                                subtitle="Spacious and premium places for memorable trips."
                                listings={luxuryListings}
                                isSaved={isSaved}
                                toggleSave={toggleSave}
                            />
                        )}

                        {normalListings.length > 0 && (
                            <ListingSection
                                title="Available homes"
                                subtitle="Browse comfortable stays ready for guests."
                                listings={normalListings}
                                isSaved={isSaved}
                                toggleSave={toggleSave}
                            />
                        )}

                        {superhostListings.length > 0 && (
                            <ListingSection
                                title="Superhost picks"
                                subtitle="Stay with trusted hosts known for great service."
                                listings={superhostListings}
                                isSaved={isSaved}
                                toggleSave={toggleSave}
                            />
                        )}

                        {guestFavorites.length > 0 && (
                            <ListingSection
                                title="Guest favorites"
                                subtitle="Top-rated stays guests love most."
                                listings={guestFavorites}
                                isSaved={isSaved}
                                toggleSave={toggleSave}
                            />
                        )}

                        {recentlyAdded.length > 0 && (
                            <ListingSection
                                title="Recently added stays"
                                subtitle="Fresh listings newly added to Ruhuka."
                                listings={recentlyAdded}
                                isSaved={isSaved}
                                toggleSave={toggleSave}
                            />
                        )}

                        <DestinationsSection onDestinationClick={handleDestinationClick} />

                        <TravelInspirationSection
                            onInspirationClick={handleInspirationClick}
                        />

                        <WhyChooseRuhuka />
                    </div>
                )}
            </section>

            <RuhukaFooter />
        </main>
    );
}

type ListingSectionProps = {
    title: string;
    subtitle: string;
    listings: Listing[];
    isSaved: (id: string) => boolean;
    toggleSave: (id: string) => void;
};

function ListingSection({
    title,
    subtitle,
    listings,
    isSaved,
    toggleSave,
}: ListingSectionProps) {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-3xl font-black text-neutral-950">{title}</h2>
                <p className="mt-2 text-neutral-500">{subtitle}</p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {listings.map((listing) => (
                    <ListingCard
                        key={listing.id}
                        listing={listing}
                        saved={isSaved(listing.id)}
                        onToggleSave={() => toggleSave(listing.id)}
                    />
                ))}
            </div>
        </section>
    );
}

function DestinationsSection({
    onDestinationClick,
}: {
    onDestinationClick: (destination: string) => void;
}) {
    return (
        <section>
            <div className="mb-6">
                <h2 className="text-3xl font-black text-neutral-950">
                    Explore destinations
                </h2>
                <p className="mt-2 text-neutral-500">
                    Find stays by places guests often search.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {destinations.map((destination) => (
                    <button
                        key={destination.name}
                        type="button"
                        onClick={() => onDestinationClick(destination.name)}
                        className="group rounded-[2rem] border border-neutral-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-rose-500 hover:shadow-xl hover:shadow-neutral-200/70"
                    >
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-500 transition group-hover:bg-rose-500 group-hover:text-white">
                            <FaMapMarkerAlt />
                        </div>

                        <h3 className="mt-5 text-xl font-black text-neutral-950">
                            {destination.name}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                            {destination.description}
                        </p>
                    </button>
                ))}
            </div>
        </section>
    );
}

function TravelInspirationSection({
    onInspirationClick,
}: {
    onInspirationClick: (category: string) => void;
}) {
    return (
        <section className="rounded-[3rem] bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-rose-500">
                        Travel inspiration
                    </p>

                    <h2 className="mt-4 text-4xl font-black text-neutral-950 md:text-5xl">
                        Need ideas for your next trip?
                    </h2>

                    <p className="mt-5 max-w-xl text-neutral-600">
                        Explore stays by travel mood, place type, and guest experience.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {inspiration.map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => onInspirationClick(item.value)}
                            className="group rounded-[2rem] border border-white bg-white/80 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-rose-500 hover:bg-white hover:shadow-xl hover:shadow-rose-100"
                        >
                            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-500 transition group-hover:bg-rose-500 group-hover:text-white">
                                {item.icon}
                            </div>

                            <p className="mt-4 text-lg font-black text-neutral-950">
                                {item.label}
                            </p>

                            <p className="mt-1 text-sm text-neutral-500">
                                Browse {item.label.toLowerCase()}.
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

function WhyChooseRuhuka() {
    const items = [
        {
            icon: <FaRegCheckCircle />,
            title: "Verified stays",
            text: "Listings are reviewed to help guests book with more confidence.",
        },
        {
            icon: <FaShieldAlt />,
            title: "Secure bookings",
            text: "Manage requests and reservations through your Ruhuka account.",
        },
        {
            icon: <FaStar />,
            title: "Trusted hosts",
            text: "Ratings, reviews, and superhost badges help you choose better.",
        },
        {
            icon: <FaHeart />,
            title: "Saved favorites",
            text: "Keep your favorite homes in one place before you book.",
        },
    ];

    return (
        <section>
            <div className="mb-6">
                <h2 className="text-3xl font-black text-neutral-950">
                    Why choose Ruhuka?
                </h2>
                <p className="mt-2 text-neutral-500">
                    Built to make discovering and booking stays simple.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((item) => (
                    <article
                        key={item.title}
                        className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm"
                    >
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-xl text-rose-500">
                            {item.icon}
                        </div>

                        <h3 className="mt-5 text-lg font-black text-neutral-950">
                            {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                            {item.text}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}

function RuhukaFooter() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleTripsClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to view your trips");
      navigate("/login");
      return;
    }

    navigate("/my-bookings");
  };

  return (
    <footer className="mt-32 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-2xl font-black text-rose-500">Ruhuka</h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-500">
              Find your next peaceful stay, save favorites, and book homes with
              trusted hosts.
            </p>

            <div className="mt-6 flex gap-3">
              {[FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn].map(
                (Icon, index) => (
                  <span
                    key={index}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white text-neutral-700 shadow-sm"
                  >
                    <Icon />
                  </span>
                )
              )}
            </div>
          </div>

          <FooterColumn
            title="Explore"
            links={[
              { label: "Stays", to: "/listings" },
              { label: "Guest favorites", to: "/listings?filter=favorites" },
              { label: "Destinations", to: "/listings?section=destinations" },
              { label: "Trips", onClick: handleTripsClick },
            ]}
          />

          <FooterColumn
            title="Hosting"
            links={[
              { label: "Become a host", to: "/become-host" },
              { label: "Hosting tools" },
              { label: "Safety for hosts" },
            ]}
          />

          <FooterColumn
            title="Support"
            links={[
              { label: "Help center" },
              { label: "Contact" },
              { label: "Terms" },
              { label: "Privacy" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Ruhuka. All rights reserved.</p>
          <p>Built for stays, hosts, and memorable trips.</p>
        </div>
      </div>
    </footer>
  );
}

type FooterLink = {
  label: string;
  to?: string;
  onClick?: () => void;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <h3 className="font-black text-neutral-950">{title}</h3>

      <div className="mt-4 space-y-3">
        {links.map((link) => {
          if (link.to) {
            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={scrollTop}
                className="block text-sm font-medium text-neutral-500 transition hover:text-rose-500"
              >
                {link.label}
              </Link>
            );
          }

          if (link.onClick) {
            return (
              <button
                key={link.label}
                type="button"
                onClick={link.onClick}
                className="block text-left text-sm font-medium text-neutral-500 transition hover:text-rose-500"
              >
                {link.label}
              </button>
            );
          }

          return (
            <p
              key={link.label}
              className="text-sm font-medium text-neutral-400"
            >
              {link.label}
            </p>
          );
        })}
      </div>
    </div>
  );
}