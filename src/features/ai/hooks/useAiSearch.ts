import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { naturalLanguageSearch } from "../api/aiApi";

export function useAiSearch() {
  return useMutation({
    mutationFn: (query: string) => naturalLanguageSearch(query),
    onError: () => {
      toast.error("AI search failed");
    },
  });
}