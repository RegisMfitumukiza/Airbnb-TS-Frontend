import { FaSearch } from "react-icons/fa";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="flex w-full max-w-xl items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 py-3 shadow-sm transition focus-within:border-rose-500">
      <FaSearch className="text-neutral-400" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, location, type, or category"
        className="w-full bg-transparent text-sm font-medium text-neutral-900 outline-none placeholder:text-neutral-400"
      />
    </label>
  );
}