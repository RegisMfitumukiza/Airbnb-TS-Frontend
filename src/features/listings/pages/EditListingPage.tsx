import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaMagic, FaSave } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

import { Spinner } from "../../../shared/components/Spinner";
import { useAiDescription } from "../../ai";
import { useListing } from "../hooks/useListings";
import { useUpdateListing } from "../hooks/useUpdateListing";
import {
    createListingSchema,
    type CreateListingFormValues,
    type CreateListingSubmitValues,
} from "../schemas/listingSchema";

export function EditListingPage() {
    const { id } = useParams<{ id: string }>();

    const { data: listing, isLoading } = useListing(id);
    const updateListing = useUpdateListing();
    const aiDescription = useAiDescription();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateListingFormValues, unknown, CreateListingSubmitValues>({
        resolver: zodResolver(createListingSchema),
        defaultValues: {
            available: true,
            type: "APARTMENT",
            category: "CITY",
        },
    });

    useEffect(() => {
        if (!listing) return;

        reset({
            title: listing.title,
            description: listing.description,
            location: listing.location,
            pricePerNight: listing.pricePerNight,
            guests: listing.guests,
            type: listing.type,
            category: listing.category,
            amenities: listing.amenities.join(", "),
            available: listing.available,
            availableFrom: listing.availableFrom
                ? listing.availableFrom.slice(0, 10)
                : "",
        });
    }, [listing, reset]);

    const handleGenerateDescription = () => {
        const title = watch("title");
        const location = watch("location");
        const type = watch("type");
        const category = watch("category");
        const amenities = watch("amenities");

        const guests = Number(watch("guests"));
        const pricePerNight = Number(watch("pricePerNight"));

        const parsedAmenities = amenities
            ? amenities
                .split(",")
                .map((item: string) => item.trim())
                .filter(Boolean)
            : [];

        if (
            !title ||
            !location ||
            !type ||
            !category ||
            Number.isNaN(guests) ||
            guests <= 0 ||
            Number.isNaN(pricePerNight) ||
            pricePerNight <= 0 ||
            parsedAmenities.length === 0
        ) {
            toast.error(
                "Fill title, location, type, category, guests, price, and amenities first"
            );
            return;
        }

        if (
            title.trim().length < 5 ||
            location.trim().length < 5
        ) {
            toast.error("Title and location must be at least 5 characters");
            return;
        }

        if (Number.isNaN(guests) || guests <= 0) {
            toast.error("Enter valid guests");
            return;
        }

        if (Number.isNaN(pricePerNight) || pricePerNight <= 0) {
            toast.error("Enter valid price");
            return;
        }

        if (parsedAmenities.length === 0) {
            toast.error("Add at least one amenity");
            return;
        }

        aiDescription.mutate(
            {
                title,
                location,
                type,
                category,
                guests,
                price: pricePerNight,
                amenities: parsedAmenities,
            },
            {
                onSuccess: (description) => {
                    setValue("description", description, {
                        shouldValidate: true,
                        shouldDirty: true,
                    });

                    toast.success("Description generated");
                },
            }
        );
    };

    const onSubmit = (values: CreateListingSubmitValues) => {
        if (!id) return;

        updateListing.mutate({
            id,
            payload: {
                ...values,
                amenities: values.amenities
                    .split(",")
                    .map((item: string) => item.trim())
                    .filter(Boolean),
                availableFrom: values.availableFrom
                    ? new Date(values.availableFrom).toISOString()
                    : undefined,
            },
        });
    };

    if (isLoading) return <Spinner />;

    if (!listing) {
        return (
            <section className="rounded-[2rem] border border-neutral-200 bg-white p-10 text-center">
                <h1 className="text-2xl font-black">Listing not found</h1>
                <Link
                    to="/host/listings"
                    className="mt-5 inline-flex rounded-full bg-neutral-950 px-6 py-3 font-bold text-white"
                >
                    Back to listings
                </Link>
            </section>
        );
    }

    return (
        <main>
            <section className="mb-8 rounded-[2rem] bg-neutral-950 p-10 text-white">
                <p className="text-sm font-extrabold uppercase tracking-wide text-rose-400">
                    Host
                </p>

                <h1 className="mt-3 text-4xl font-black">Edit listing</h1>

                <p className="mt-3 max-w-2xl text-neutral-300">
                    Update your property details, pricing, availability, and description.
                </p>
            </section>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60"
            >
                <div className="grid gap-5 md:grid-cols-2">
                    <Field label="Title" error={errors.title?.message}>
                        <input {...register("title")} className="input" />
                    </Field>

                    <Field label="Location" error={errors.location?.message}>
                        <input {...register("location")} className="input" />
                    </Field>

                    <Field label="Price per night" error={errors.pricePerNight?.message}>
                        <input
                            type="number"
                            {...register("pricePerNight")}
                            className="input"
                        />
                    </Field>

                    <Field label="Guests" error={errors.guests?.message}>
                        <input type="number" {...register("guests")} className="input" />
                    </Field>

                    <Field label="Property type" error={errors.type?.message}>
                        <select {...register("type")} className="input">
                            <option value="APARTMENT">Apartment</option>
                            <option value="HOUSE">House</option>
                            <option value="VILLA">Villa</option>
                            <option value="CABIN">Cabin</option>
                        </select>
                    </Field>

                    <Field label="Category" error={errors.category?.message}>
                        <select {...register("category")} className="input">
                            <option value="CITY">City</option>
                            <option value="BEACH">Beach</option>
                            <option value="MOUNTAIN">Mountain</option>
                            <option value="COUNTRYSIDE">Countryside</option>
                        </select>
                    </Field>

                    <Field label="Available from" error={errors.availableFrom?.message}>
                        <input
                            type="date"
                            {...register("availableFrom")}
                            className="input"
                        />
                    </Field>

                    <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-3">
                        <input
                            type="checkbox"
                            {...register("available")}
                            className="h-4 w-4 accent-rose-500"
                        />
                        <span className="text-sm font-bold text-neutral-700">
                            Listing is available
                        </span>
                    </label>

                    <div className="md:col-span-2">
                        <Field label="Amenities" error={errors.amenities?.message}>
                            <input
                                {...register("amenities")}
                                className="input"
                                placeholder="wifi, parking, kitchen"
                            />
                        </Field>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <span className="text-sm font-bold text-neutral-700">
                                    Description
                                </span>

                                <button
                                    type="button"
                                    onClick={handleGenerateDescription}
                                    disabled={aiDescription.isPending}
                                    className="inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
                                >
                                    <FaMagic />
                                    {aiDescription.isPending
                                        ? "Generating..."
                                        : "Regenerate with AI"}
                                </button>
                            </div>

                            <textarea
                                rows={5}
                                {...register("description")}
                                className="input resize-none"
                            />

                            {errors.description && (
                                <p className="mt-1 text-sm text-rose-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        type="submit"
                        disabled={updateListing.isPending}
                        className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-8 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
                    >
                        <FaSave />
                        {updateListing.isPending ? "Saving..." : "Save changes"}
                    </button>

                    <Link
                        to={`/host/listings/${listing.id}`}
                        className="rounded-2xl border border-neutral-200 px-8 py-3 font-bold text-neutral-900 transition hover:border-rose-500 hover:text-rose-500"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </main>
    );
}

type FieldProps = {
    label: string;
    error?: string;
    children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
    return (
        <label className="block">
            <span className="mb-2 block text-sm font-bold text-neutral-700">
                {label}
            </span>

            {children}

            {error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
        </label>
    );
}