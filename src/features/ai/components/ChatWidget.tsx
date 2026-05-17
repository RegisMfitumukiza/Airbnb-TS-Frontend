import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaPaperPlane, FaRobot, FaTimes } from "react-icons/fa";

import { useAiChat } from "../hooks/useAiChat";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function getOrCreateSessionId() {
  const existing = localStorage.getItem("ai-chat-session-id");

  if (existing) return existing;

  const next =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? `session-${crypto.randomUUID()}`
      : `session-${Date.now()}`;

  localStorage.setItem("ai-chat-session-id", next);

  return next;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I can help you find stays, compare listings, or answer questions about booking.",
    },
  ]);

  const sessionId = useMemo(() => getOrCreateSessionId(), []);

  const aiChat = useAiChat();

  const handleSend = () => {
    const message = input.trim();

    if (message.length < 2) {
      toast.error("Type a message first");
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");

    aiChat.mutate(
      {
        message,
        sessionId,
      },
      {
        onSuccess: (data) => {
          const assistantText =
            data.answer ||
            data.reply ||
            data.message ||
            "I received your message, but I could not generate a clear response.";

          setMessages((current) => [
            ...current,
            {
              id: `assistant-${Date.now()}`,
              role: "assistant",
              content: assistantText,
            },
          ]);
        },
        onError: () => {
          toast.error("Chatbot failed to respond");
        },
      }
    );
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-rose-500 text-xl text-white shadow-2xl transition hover:bg-rose-600"
          aria-label="Open AI chat"
        >
          <FaRobot />
        </button>
      )}

      {open && (
        <section className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-rose-50 text-rose-500">
                <FaRobot />
              </div>

              <div>
                <h2 className="font-black text-neutral-950">AI Assistant</h2>
                <p className="text-xs text-neutral-500">Ask about stays</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full bg-neutral-100 transition hover:bg-rose-500 hover:text-white"
              aria-label="Close AI chat"
            >
              <FaTimes />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "bg-rose-500 text-white"
                      : "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {aiChat.isPending && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-500">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <footer className="border-t border-neutral-200 p-4">
            <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 focus-within:border-rose-500">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask something..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={aiChat.isPending}
                className="grid h-9 w-9 place-items-center rounded-full bg-neutral-950 text-white transition hover:bg-rose-500 disabled:opacity-50"
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </div>
          </footer>
        </section>
      )}
    </>
  );
}