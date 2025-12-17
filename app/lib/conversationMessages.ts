import type { Message } from "@/app/common/types/constants";

export function parseConversationMessages(value: unknown): Message[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value as Message[];
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "null") return [];

    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? (parsed as Message[]) : [];
    } catch {
      return [];
    }
  }

  return [];
}

