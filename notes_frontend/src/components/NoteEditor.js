import React, { useState, useEffect } from "react";

/**
 * PUBLIC_INTERFACE
 * - note: {id, title, content, tags}
 * - onSave: function(updatedNote) - create or update note
 * - onDelete: function(noteId) - delete note
 * - onCancel: cancel editing
 * - editable: boolean; true = edit/create, false = view
 */
function NoteEditor({ note, onSave, onDelete, onCancel, editable }) {
  const [editMode, setEditMode] = useState(editable);
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState(note?.tags?.join(", ") || "");

  // If note changes, reset state
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setTags(note?.tags?.join(", ") || "");
    setEditMode(editable);
  }, [note, editable]);

  function handleSave(e) {
    e.preventDefault();
    onSave({
      ...note,
      title: title.trim(),
      content: content.trim(),
      tags: tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean),
    });
  }

  if (!note && !editMode)
    return (
      <div className="note-detail">
        <p>Select a note or create a new one ↗</p>
      </div>
    );

  if (editMode) {
    return (
      <form className="note-editor" onSubmit={handleSave}>
        <input
          className="input note-title-input"
          required
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="input note-content-input"
          rows={10}
          required
          placeholder="Write your note here..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <input
          className="input note-tags-input"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />
        <div style={{ marginTop: "1rem" }}>
          <button className="btn btn-primary" type="submit">
            Save
          </button>
          <button
            className="btn btn-link"
            type="button"
            onClick={() => {
              if (note?.id) setEditMode(false);
              else onCancel();
            }}
          >
            Cancel
          </button>
          {note?.id && (
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => window.confirm('Delete this note?') && onDelete(note.id)}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    );
  }

  // View mode
  return (
    <div className="note-detail">
      <h2>{note?.title}</h2>
      <div className="note-content">{note?.content}</div>
      <div className="note-meta-inline">
        <span>
          Tags:{" "}
          {note?.tags?.length
            ? note.tags.join(", ")
            : "no tags"}
        </span>
      </div>
      <button className="btn btn-primary" onClick={() => setEditMode(true)}>
        Edit
      </button>
    </div>
  );
}

export default NoteEditor;
