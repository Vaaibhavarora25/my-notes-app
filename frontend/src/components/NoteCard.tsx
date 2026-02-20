"use client";

import { Note } from "@/lib/api";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-semibold text-gray-800 leading-tight">
        {note.title}
      </h2>
      <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">
        {note.content}
      </p>
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        <span className="text-xs text-gray-400">Updated {formattedDate}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(note)}
            className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
