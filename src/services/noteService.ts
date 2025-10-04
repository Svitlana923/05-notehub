import axios, { AxiosError } from "axios";
import type { Note } from "../types/note";

const BASE_URL = import.meta.env.VITE_NOTEHUB_BASE_URL;
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${TOKEN}` },
});

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  search: string,
  page: number
): Promise<NotesResponse> {
  const { data } = await api.get<NotesResponse>("/notes", {
    params: { search, page, perPage: 6 },
  });
  return data;
}

export async function createNote(noteData: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> {
  try {
    const { data } = await api.post<Note>("/notes", noteData);
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    console.error("Create note error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create note");
  }
}

export async function deleteNote(id: string): Promise<Note> {
  try {
    const { data } = await api.delete<Note>(`/notes/${id}`);
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    console.error("Delete note error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete note");
  }
}
