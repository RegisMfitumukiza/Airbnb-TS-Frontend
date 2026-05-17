import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { sendAiChat, type AiChatPayload } from "../api/aiApi";

export function useAiChat() {
  return useMutation({
    mutationFn: (payload: AiChatPayload) => sendAiChat(payload),
    onError: () => {
      toast.error("Chatbot failed to respond");
    },
  });
}