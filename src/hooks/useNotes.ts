import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/contexts/SessionContext';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  created_at: string;
  updated_at: string;
}

const STORAGE_KEY = 'monna-notes';

const NOTE_COLORS = [
  'default',
  'rose',
  'peach',
  'sand',
  'mint',
  'sky',
  'lavender',
] as const;

export type NoteColor = (typeof NOTE_COLORS)[number];

export { NOTE_COLORS };

function loadNotes(): Note[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useNotes() {
  const { user } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setNotes(loadNotes());
    }
    setIsLoading(false);
  }, [user]);

  const addNote = useCallback((data: { title: string; content: string; color: string }) => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      color: data.color,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      saveNotes(updated);
      return updated;
    });
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, data: { title?: string; content?: string; color?: string }) => {
    setNotes((prev) => {
      const updated = prev.map((note) =>
        note.id === id
          ? { ...note, ...data, updated_at: new Date().toISOString() }
          : note
      );
      saveNotes(updated);
      return updated;
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => {
      const updated = prev.filter((note) => note.id !== id);
      saveNotes(updated);
      return updated;
    });
  }, []);

  return {
    notes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
  };
}
