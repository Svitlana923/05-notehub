import axios from "axios";
import type { Note } from "../types/note";


interface FetchNotesResponse {
  results: Note[];
  total_pages: number;
}


export const fetchNotes = async (
  query: string,
  page: number
): Promise<MoviesHttpResponse> => {
  const response = await axios.get<MoviesHttpResponse>(
`${import.meta.env.VITE_TMDB_BASE_URL}/search/movie`,
    {
      params: { query, page },
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
  return response.data;
};

export const createNote = async (note: Omit<Note, 'id'>): Promise<Note> => {
  const response = await axios.post<Note>(
    `${import.meta.env.VITE_API_BASE_URL}/notes`,)
}

export const deleteNote = async (id: number): Promise<void> => {
  await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/notes/${id}`);
} 