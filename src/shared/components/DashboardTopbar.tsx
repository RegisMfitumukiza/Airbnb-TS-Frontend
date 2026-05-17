import { FaSearch } from "react-icons/fa";

type DashboardTopbarProps = {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
};

export function DashboardTopbar({
  title,
  subtitle,
  showSearch = true,
  searchValue = "",
  searchPlaceholder = "Search...",
  onSearchChange,
}: DashboardTopbarProps) {
  return (
    <header className="mb-6 flex flex-col gap-5 rounded-[2rem] border border-neutral-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-black text-neutral-950 md:text-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        )}
      </div>

      {showSearch && (
        <label className="flex min-w-[260px] items-center gap-3 rounded-full border border-neutral-200 px-4 py-3 transition focus-within:border-rose-500">
          <FaSearch className="text-neutral-400" />
          <input
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>
      )}
    </header>
  );
}