import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  generateListingDescription,
  type GenerateListingDescriptionPayload,
} from "../api/aiApi";

export function useAiDescription() {
  return useMutation({
    mutationFn: (payload: GenerateListingDescriptionPayload) =>
      generateListingDescription(payload),
    onError: () => {
      toast.error("Failed to generate description");
    },
  });
}