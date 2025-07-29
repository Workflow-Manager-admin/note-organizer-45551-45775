import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import Sidebar from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';

/**
 * PUBLIC_INTERFACE
 * Main Notes Application - minimalistic layout with Supabase integration.
 * - Auth: user signup/login/logout (via Supabase)
 * - Note CRUD, tag-based navigation, searching, responsive sidebar/main area
 */
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theme state (light/dark toggle, default "light")
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Notes state
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState(null);
  const [editorMode, setEditorMode] = useState(false); // false=view, true=create

  // Load authenticated session on mount
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    supabase.auth.getSession().then(({ data, error }) => {
      if (!ignore) {
        setSession(data?.session ?? null);
        setLoading(false);
      }
    });
    // Listen to auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      ignore = true;
      subscription?.unsubscribe?.();
    };
  }, []);

  // Load notes from DB
  useEffect(() => {
    if (!session) {
      setNotes([]);
      setSelectedNoteId(null);
      return;
    }
    fetchNotes();
    // eslint-disable-next-line
  }, [session, activeTag, searchQuery]);

  // Fetch all notes for current user, filter by tag/search
  async function fetchNotes() {
    let q = supabase
      .from('notes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });
    if (activeTag) q = q.contains('tags', [activeTag]);
    let { data, error } = await q;
    if (!data) data = [];
    // Filter for search query (client-side)
    if (searchQuery)
      data = data.filter(
        n =>
          (n.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (n.content || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    setNotes(data || []);
    // Deselect if current note is not found
    if (selectedNoteId && !data.find(n => n.id === selectedNoteId)) setSelectedNoteId(null);
  }

  // Unique tags for sidebar
  const tags = Array.from(
    new Set([].concat(...notes.map(n => Array.isArray(n.tags) ? n.tags : [])))
  ).filter(Boolean);

  // Selected note
  const selectedNote = notes.find(n => n.id === selectedNoteId);

  // Create or update a note
  async function handleSave(note) {
    if (!note.title && !note.content) return; // skip empty
    let res;
    if (note.id) {
      // Update
      res = await supabase
        .from('notes')
        .update({
          ...note,
          tags: note.tags,
          updated_at: new Date().toISOString(),
        })
        .eq('id', note.id)
        .select()
        .single();
    } else {
      // New
      res = await supabase
        .from('notes')
        .insert([
          {
            user_id: session.user.id,
            title: note.title,
            content: note.content,
            tags: note.tags,
          }
        ])
        .select()
        .single();
    }
    if (res.error) {
      alert('Save failed: ' + res.error.message);
    } else {
      await fetchNotes();
      setEditorMode(false);
      setSelectedNoteId(res.data.id);
    }
  }

  // Delete a note
  async function handleDelete(noteId) {
    const res = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);
    if (res.error) {
      alert('Delete failed: ' + res.error.message);
    } else {
      await fetchNotes();
      setSelectedNoteId(null);
      setEditorMode(false);
    }
  }

  // When clicking outside or cancel, exit create/editor mode
  function handleCancel() {
    setEditorMode(false);
    setSelectedNoteId(null);
  }

  // If not logged in, show Auth
  if (!session) {
    return (
      <div className="App">
        <header className="App-header">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <Auth session={session} onSessionUpdate={setSession} />
        </header>
      </div>
    );
  }

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      <Sidebar
        tags={tags}
        activeTag={activeTag}
        onTagSelect={(tag) => { setActiveTag(tag); setSelectedNoteId(null); }}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />
      <div style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-color)'
      }}>
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem",
          borderBottom: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
        }}>
          <div style={{ fontWeight: 600 }}>Notes</div>
          <div>
            <button className="btn btn-primary" onClick={() => { setEditorMode(true); setSelectedNoteId(null); }}>
              + New Note
            </button>
            <button
              className="theme-toggle"
              style={{ marginLeft: 12 }}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <Auth session={session} onSessionUpdate={setSession} />
          </div>
        </header>
        <main style={{ display: "flex", flex: 1, minHeight: 0 }}>
          <section style={{
            width: 320,
            borderRight: "1px solid var(--border-color)",
            background: "var(--bg-primary)",
            overflowY: "auto"
          }}>
            <NoteList
              notes={notes}
              selectedNoteId={selectedNoteId}
              onSelect={id => { setSelectedNoteId(id); setEditorMode(false); }}
            />
          </section>
          <section style={{
            flex: 1,
            background: "var(--bg-secondary)",
            padding: "2rem",
            minWidth: 0,
            overflowY: "auto"
          }}>
            {editorMode ? (
              <NoteEditor
                note={null}
                onSave={handleSave}
                onDelete={handleDelete}
                onCancel={handleCancel}
                editable={true}
              />
            ) : (
              <NoteEditor
                note={selectedNote}
                onSave={handleSave}
                onDelete={handleDelete}
                onCancel={handleCancel}
                editable={!!selectedNote}
              />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
