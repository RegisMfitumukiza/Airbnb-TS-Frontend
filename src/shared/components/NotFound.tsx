import { Link } from "react-router-dom";
import { FaAirbnb } from "react-icons/fa";

export function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-6 py-16">
      <section className="max-w-md rounded-4xlborder border-neutral-200 bg-white p-10 text-center shadow-xl shadow-neutral-200/70">
        <FaAirbnb className="mx-auto text-5xl text-rose-500" />

        <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-rose-500">
          404
        </p>

        <h1 className="mt-3 text-4xl font-black text-neutral-950">
          Page not found
        </h1>

        <p className="mt-4 leading-7 text-neutral-500">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          to="/listings"
          className="mt-8 inline-flex rounded-full bg-rose-500 px-6 py-3 font-bold text-white transition hover:bg-rose-600"
        >
          Back to listings
        </Link>
      </section>
    </main>
  );
}