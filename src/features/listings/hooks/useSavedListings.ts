import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/hooks/useAuth";

const SAVED_KEY = "saved-listings";

export function useSavedListings() {
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(SAVED_KEY);
    if (stored) setSaved(JSON.parse(stored));
  }, []);

  const toggleSave = (listingId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to save listings");
      return;
    }

    setSaved((current) => {
      const next = current.includes(listingId)
        ? current.filter((id) => id !== listingId)
        : [...current, listingId];

      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  return {
    saved,
    toggleSave,
    isSaved: (listingId: string) => saved.includes(listingId),
  };
}