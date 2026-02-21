"use client";

import { useState, useEffect } from "react";
import {
  Note,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  login,
  signup,
  logout,
} from "@/lib/api";

import NoteCard from "@/components/NoteCard";
import NoteModal from "@/components/NoteModal";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      loadNotes();
    } else {
      setIsLoading(false);
    }
  }, []);

  /* ================= AUTH ================= */

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }

      setIsLoggedIn(true);
      loadNotes();
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError("Authentication failed");
      }
    }
  }

  function handleLogout() {
    logout();
    setIsLoggedIn(false);
    setNotes([]);
  }

  /* ================= NOTES ================= */

  async function loadNotes() {
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(title: string, content: string) {
    if (editingNote) {
      const updated = await updateNote(editingNote.id, { title, content });
      setNotes((prev) =>
        prev.map((n) => (n.id === updated.id ? updated : n)),
      );
    } else {
      const newNote = await createNote(title, content);
      setNotes((prev) => [newNote, ...prev]);
    }
    setEditingNote(null);
    setIsModalOpen(false);
  }

  async function handleDelete(id: string) {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  /* ================= AUTH UI ================= */

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <form
          onSubmit={handleAuth}
          className="bg-gray-800 p-8 rounded-xl w-80 shadow-lg"
        >
          <h1 className="text-xl font-bold mb-4">
            {isSignup ? "Create account" : "Login"}
          </h1>

          <input
            className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {authError && (
            <p className="text-red-400 text-sm mb-2">{authError}</p>
          )}

          <button className="w-full bg-blue-600 py-2 rounded mb-3">
            {isSignup ? "Sign up" : "Login"}
          </button>

          <p className="text-sm text-gray-400">
            {isSignup ? "Already have account?" : "No account?"}
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="ml-1 underline"
            >
              {isSignup ? "Login" : "Sign up"}
            </button>
          </p>
        </form>
      </main>
    );
  }

  /* ================= NOTES UI ================= */

  return (
    <main className="min-h-screen bg-gray-100 text-black">
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">My Notes</h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingNote(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              New
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {isLoading && <p>Loading...</p>}

        <div className="grid grid-cols-3 gap-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={(n) => {
                setEditingNote(n);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSave}
        editingNote={editingNote}
      />
    </main>
  );
}
