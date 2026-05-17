import { FaHeart } from "react-icons/fa";

type SavedBadgeProps = {
  count: number;
};

export function SavedBadge({ count }: SavedBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-rose-50 px-5 py-3 text-sm font-bold text-rose-500">
      <FaHeart />
      <span>{count} saved</span>
    </div>
  );
}