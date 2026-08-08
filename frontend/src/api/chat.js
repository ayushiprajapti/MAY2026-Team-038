import { apiFetch } from "./client";

export async function startSession() {
  return apiFetch("/chat/sessions", { method: "POST" });
}

export async function sendMessage(sessionId, content) {
  return apiFetch(`/chat/sessions/${sessionId}/messages`, {
    method: "POST",
    body: { content },
  });
}

export async function listMessages(sessionId) {
  return apiFetch(`/chat/sessions/${sessionId}/messages`);
}
