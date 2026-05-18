import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaHome, FaMagic, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

import { useAiDescription } from "../../ai";
import { useCreateListing } from "../hooks/useCreateListing";
import {
  createListingSchema,
  type CreateListingFormValues,
  type CreateListingSubmitValues,
} from "../schemas/listingSchema";

async function geocodeLocation(location: string) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
        location
      )}`
    );

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) return null;

    return {
      latitude: Number(data[0].lat),
      longitude: Number(data[0].lon),
    };
  } catch {
    return null;
  }
}

export function CreateListingPage() {
  const createListing = useCreateListing();
  const aiDescription = useAiDescription();

  const {
    register,
    handleSubmit,
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

  const onSubmit = async (values: CreateListingSubmitValues) => {
    const coords = await geocodeLocation(values.location);

    if (!coords) {
      toast.error("Could not find this location. Try a more specific address.");
      return;
    }

    createListing.mutate({
      ...values,
      latitude: coords.latitude,
      longitude: coords.longitude,
      amenities: values.amenities
        .split(",")
        .map((item: string) => item.trim())
        .filter(Boolean),
      availableFrom: values.availableFrom
        ? new Date(values.availableFrom).toISOString()
        : undefined,
    });
  };

  return (
    <main>
      <section className="mb-8 rounded-[2rem] bg-neutral-950 p-10 text-white">
        <p className="text-sm font-extrabold uppercase tracking-wide text-rose-400">
          Host
        </p>

        <h1 className="mt-3 text-4xl font-black">Create listing</h1>

        <p className="mt-3 max-w-2xl text-neutral-300">
          Add a new property to your host account. You can upload photos after
          creating the listing.
        </p>
      </section>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60"
      >
        <div className="mb-8 flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-2xl text-rose-500">
            <FaHome />
          </div>

          <div>
            <h2 className="text-2xl font-black text-neutral-950">
              Listing details
            </h2>
            <p className="text-sm text-neutral-500">
              Fill in the basic information for your property.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Title" error={errors.title?.message}>
            <input {...register("title")} className="input" />
          </Field>

          <Field label="Location" error={errors.location?.message}>
            <input
              {...register("location")}
              className="input"
              placeholder="Kacyiru, Kigali, Rwanda"
            />
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
                    : "Generate with AI"}
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
            disabled={createListing.isPending}
            className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-8 py-3 font-bold text-white transition hover:bg-rose-600 disabled:opacity-60"
          >
            <FaPlus />
            {createListing.isPending ? "Creating..." : "Create listing"}
          </button>

          <Link
            to="/host/listings"
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