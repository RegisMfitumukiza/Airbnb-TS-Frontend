import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaImage,
  FaImages,
  FaTrash,
} from "react-icons/fa";

import { Spinner } from "../../../shared/components/Spinner";
import { useListing } from "../hooks/useListings";

import {
  useDeleteAllListingImages,
  useDeleteListingCoverImage,
  useDeleteSingleListingImage,
  useUploadListingCoverImage,
  useUploadListingGalleryImages,
} from "../hooks/useListingImages";

export function ListingImagesPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const backTo = isAdminRoute ? "/admin/listings" : "/host/listings";
  const backLabel = isAdminRoute ? "Back to admin listings" : "Back to my listings";
  const sectionLabel = isAdminRoute ? "Admin moderation" : "Listing images";

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const { data: listing, isLoading } = useListing(id);

  const uploadCover = useUploadListingCoverImage(id || "");
  const uploadGallery = useUploadListingGalleryImages(id || "");
  const deleteCover = useDeleteListingCoverImage(id || "");
  const deleteAllGallery = useDeleteAllListingImages(id || "");
  const deleteSingleGallery = useDeleteSingleListingImage(id || "");

  if (!id) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="rounded-3xl bg-rose-50 p-8 text-center text-rose-600">
          Listing ID is missing.
        </p>
      </main>
    );
  }

  if (isLoading) return <Spinner />;

  if (!listing) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <p className="rounded-3xl bg-rose-50 p-8 text-center text-rose-600">
          Listing not found.
        </p>
      </main>
    );
  }

  const handleUploadCover = () => {
    if (!coverImage) return;
    uploadCover.mutate(coverImage, {
      onSuccess: () => setCoverImage(null),
    });
  };

  const handleUploadGallery = () => {
    if (galleryImages.length === 0) return;
    uploadGallery.mutate(galleryImages, {
      onSuccess: () => setGalleryImages([]),
    });
  };

  const handleDeleteCover = () => {
    if (!window.confirm("Delete this cover image?")) return;
    deleteCover.mutate();
  };

  const handleDeleteAllGallery = () => {
    if (!window.confirm("Delete all gallery images?")) return;
    deleteAllGallery.mutate();
  };

  const isUploading = uploadCover.isPending || uploadGallery.isPending;

  return (
    <main>
      <Link
        to={backTo}
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-neutral-700 transition hover:text-rose-500"
      >
        <FaArrowLeft />
        {backLabel}
      </Link>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-[2rem] bg-neutral-950 p-10 text-white"
      >
        <p className="text-sm font-extrabold uppercase tracking-wide text-rose-400">
          {sectionLabel}
        </p>

        <h1 className="mt-3 text-4xl font-black">
          {isAdminRoute ? "Moderate photos" : "Manage photos"}
        </h1>

        <p className="mt-3 max-w-2xl text-neutral-300">
          {isAdminRoute
            ? "Review, replace, or delete listing images when moderation is required."
            : "Upload, replace, and delete photos for"}{" "}
          <span className="font-bold text-white">{listing.title}</span>.
        </p>
      </motion.section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60">
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-2xl text-rose-500">
              <FaImage />
            </div>

            <div>
              <h2 className="text-2xl font-black text-neutral-950">
                Cover image
              </h2>
              <p className="text-sm text-neutral-500">
                This image appears on listing cards.
              </p>
            </div>
          </div>

          {listing.coverImage ? (
            <div className="mb-5 overflow-hidden rounded-3xl border border-neutral-200">
              <img
                src={listing.coverImage}
                alt={listing.title}
                className="h-72 w-full object-cover"
              />
            </div>
          ) : (
            <div className="mb-5 grid h-72 place-items-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-400">
              No cover image yet
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setCoverImage(file);
            }}
            className="block w-full rounded-2xl border border-neutral-200 p-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-rose-500 file:px-4 file:py-2 file:font-bold file:text-white"
          />

          {coverImage && (
            <div className="mt-5 overflow-hidden rounded-3xl border border-neutral-200">
              <img
                src={URL.createObjectURL(coverImage)}
                alt="Cover preview"
                className="h-72 w-full object-cover"
              />
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={!coverImage || uploadCover.isPending}
              onClick={handleUploadCover}
              className="rounded-2xl bg-rose-500 px-6 py-3 font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadCover.isPending ? "Uploading..." : "Upload cover"}
            </button>

            {listing.coverImage && (
              <button
                type="button"
                disabled={deleteCover.isPending}
                onClick={handleDeleteCover}
                className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-6 py-3 font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
              >
                <FaTrash />
                Delete cover
              </button>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl shadow-neutral-200/60">
          <div className="mb-6 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-2xl text-rose-500">
              <FaImages />
            </div>

            <div>
              <h2 className="text-2xl font-black text-neutral-950">
                Gallery images
              </h2>
              <p className="text-sm text-neutral-500">
                These appear on the listing detail page.
              </p>
            </div>
          </div>

          {listing.images.length > 0 ? (
            <div className="mb-5 grid grid-cols-2 gap-3">
              {listing.images.map((image: string, index: number) => {
                const publicId = listing.imagesPublicIds?.[index];

                return (
                  <div
                    key={image}
                    className="group relative overflow-hidden rounded-2xl bg-neutral-100"
                  >
                    <img
                      src={image}
                      alt={`${listing.title} ${index + 1}`}
                      className="h-40 w-full object-cover"
                    />

                    {publicId && (
                      <button
                        type="button"
                        disabled={deleteSingleGallery.isPending}
                        onClick={() => {
                          if (!window.confirm("Delete this image?")) return;
                          deleteSingleGallery.mutate(publicId);
                        }}
                        className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-rose-500 opacity-0 shadow transition group-hover:opacity-100"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mb-5 grid h-72 place-items-center rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-400">
              No gallery images yet
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              const files = Array.from(event.target.files || []);
              setGalleryImages(files);
            }}
            className="block w-full rounded-2xl border border-neutral-200 p-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-rose-500 file:px-4 file:py-2 file:font-bold file:text-white"
          />

          {galleryImages.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {galleryImages.map((file) => (
                <img
                  key={`${file.name}-${file.lastModified}`}
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-36 w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={galleryImages.length === 0 || uploadGallery.isPending}
              onClick={handleUploadGallery}
              className="rounded-2xl bg-rose-500 px-6 py-3 font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadGallery.isPending ? "Uploading..." : "Upload gallery"}
            </button>

            {listing.images.length > 0 && (
              <button
                type="button"
                disabled={deleteAllGallery.isPending}
                onClick={handleDeleteAllGallery}
                className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-6 py-3 font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
              >
                <FaTrash />
                Delete all
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 flex flex-col gap-4 rounded-[2rem] border border-neutral-200 bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <FaCheckCircle className="text-2xl text-green-600" />
          <div>
            <h3 className="font-black text-neutral-950">
              {isAdminRoute ? "Moderation complete" : "Finish setup"}
            </h3>
            <p className="text-sm text-neutral-500">
              View the public listing when your images are ready.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isUploading}
          onClick={() => navigate(`/host/listings/${id}`)}
          className="rounded-full bg-neutral-950 px-6 py-3 font-bold text-white transition hover:bg-rose-500 disabled:opacity-50"
        >
          View listing
        </button>
      </section>
    </main>
  );
}