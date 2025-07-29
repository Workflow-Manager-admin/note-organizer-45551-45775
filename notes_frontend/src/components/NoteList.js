import React from "react";

/**
 * PUBLIC_INTERFACE
 * Renders a list of notes (title + preview).
 * - "notes": array of note objects with id, title, content, tags, updated_at
 * - "selectedNoteId": id of the selected note
 * - "onSelect(noteId)": select a note by id
 */
function NoteList({ notes = [], selectedNoteId, onSelect }) {
  if (!notes.length) return <div className="no-notes">No notes found.</div>;
  return (
    <ul className="note-list">
      {notes.map(note => (
        <li
          key={note.id}
          className={selectedNoteId === note.id ? "note-item selected" : "note-item"}
          onClick={() => onSelect(note.id)}
          tabIndex={0}
        >
          <div className="note-title">{note.title || "(untitled)"}</div>
          <div className="note-preview">
            {note.content.length > 45
              ? note.content.slice(0, 45) + "..."
              : note.content}
          </div>
          <div className="note-meta">
            <span className="note-tag">{note.tags?.[0] || "no tag"}</span>
            <span className="note-date">
              {note.updated_at
                ? new Date(note.updated_at).toLocaleDateString()
                : ""}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default NoteList;
