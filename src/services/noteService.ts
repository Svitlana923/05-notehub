import axios from "axios";
import type { Note } from "../types/note";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  query: string,
  page: number
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    search: query,
    page,
    perPage: 12,
  };
  const response = await axios.get<FetchNotesResponse>(
    `${import.meta.env.VITE_NOTEHUB_BASE_URL}/notes`,
    {
      params,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
};



export const createNote = async (note: Omit<Note, "id">): Promise<Note> => {
  const response = await axios.post<Note>(
    `${import.meta.env.VITE_NOTEHUB_BASE_URL}/notes`,
    note,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
      },
    }
  );
  return response.data;
};

const BASE_URL = import.meta.env.VITE_NOTEHUB_BASE_URL;
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export const deleteNote = async (id: string): Promise<void> => {
  await axios.delete<void>(`${BASE_URL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
};