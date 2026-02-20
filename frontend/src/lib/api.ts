const API_URL = "http://localhost:3001";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
      if (typeof window !== "undefined") {
        window.location.reload(); // Simple way to reset state
      }
      throw new Error("Unauthorized");
    }
    throw new Error("API error");
  }

  return res.json();
}



export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};


export async function login(email: string, password: string) {
  const res = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("token", res.access_token);
  return res;
}

export function logout() {
  localStorage.removeItem("token");
}


export function getNotes() {
  return request("/notes");
}

export function createNote(title: string, content: string) {
  return request("/notes", {
    method: "POST",
    body: JSON.stringify({ title, content }),
  });
}

type UpdateNoteDto = {
  title?: string;
  content?: string;
};

export function updateNote(id: string, data: UpdateNoteDto) {
  return request(`/notes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}


export async function signup(email: string, password: string) {
  const res = await request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem("token", res.access_token);
  return res;
}

export function deleteNote(id: string) {
  return request(`/notes/${id}`, {
    method: "DELETE",
  });
}
