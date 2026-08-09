type RequestOptions = RequestInit & {
  json?: unknown;
};

function getApiBaseUrl(baseUrl?: string) {
  if (baseUrl) return baseUrl;
  if (typeof window !== "undefined") return "";
  return process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
}

async function request<T>(path: string, options: RequestOptions = {}, baseUrl?: string) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl(baseUrl)}${path}`, {
      ...options,
      credentials: "include",
      headers,
      body: options.json ? JSON.stringify(options.json) : options.body,
    });
  } catch {
    throw new Error("Network request failed. Check the API URL and your connection.");
  }

  const rawText = await response.text();
  const payload = rawText ? (() => {
    try {
      return JSON.parse(rawText) as { error?: string; message?: string };
    } catch {
      return null;
    }
  })() : null;

  if (!response.ok) {
    const details = payload?.error ?? payload?.message ?? rawText;
    throw new Error(details ? `${response.status} ${details}` : `${response.status} Request failed`);
  }

  return (payload ?? (rawText ? JSON.parse(rawText) : null)) as T;
}

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  rank: string;
  interests: string[];
  picture?: string;
};

export type AuthSession = {
  user: AuthUser;
};

export type ChatSummary = {
  id: string;
  title: string;
  subtitle: string;
  unread: number;
  lastMessage: string;
  lastMessageAt: string;
  members: Array<Pick<AuthUser, "id" | "username" | "displayName" | "rank" | "picture">>;
};

export type ChatMessage = {
  id: string;
  body: string;
  createdAt: string;
  sender: Pick<AuthUser, "id" | "username" | "displayName" | "rank" | "picture">;
};

export async function registerUser(input: {
  username: string;
  email: string;
  password: string;
  displayName: string;
}) {
  return request<AuthSession>("/api/auth/register", {
    method: "POST",
    json: input,
  });
}

export async function loginUser(input: { email: string; password: string }) {
  return request<AuthSession>("/api/auth/login", {
    method: "POST",
    json: input,
  });
}

export async function updateOnboarding(input: { interests: string[]; bio: string }) {
  return request<AuthSession>("/api/onboarding", {
    method: "POST",
    json: input,
  });
}

export async function updateProfile(input: {
  displayName: string;
  bio: string;
  picture?: string;
}) {
  return request<AuthSession>("/api/profile", {
    method: "PUT",
    json: input,
  });
}

export async function getMe() {
  return request<AuthSession>("/api/auth/me");
}

export async function logoutUser() {
  return request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
}

export async function getInterests() {
  return request<{ interests: string[] }>("/api/interests");
}

export async function getProfile(username: string, baseUrl?: string) {
  return request<{ user: AuthUser }>(`/api/profile/${encodeURIComponent(username)}`, {}, baseUrl);
}

export async function checkUsernameAvailability(username: string) {
  const query = new URLSearchParams({ username });
  return request<{ available: boolean }>(`/api/auth/username-available?${query.toString()}`);
}

export async function getChats() {
  return request<{ chats: ChatSummary[] }>("/api/chats");
}

export async function startChat(username: string) {
  return request<{ conversationId: string }>("/api/chats", {
    method: "POST",
    json: { username },
  });
}

export async function getConversation(id: string) {
  return request<{ conversation: { id: string; participants: ChatSummary["members"]; messages: ChatMessage[] } }>(
    `/api/chats/${encodeURIComponent(id)}`
  );
}

export async function sendMessage(id: string, body: string) {
  return request<{ message: ChatMessage }>(`/api/chats/${encodeURIComponent(id)}`, {
    method: "POST",
    json: { body },
  });
}
