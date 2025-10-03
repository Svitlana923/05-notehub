import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";
import { useState, useEffect } from "react";
import NoteList from "../NoteList/NoteList";
import type { Note } from "../../types/note";
import { fetchNotes, deleteNote } from "../../services/noteService";
import NoteModal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import NoteForm from "../NoteForm/NoteForm";

function App() {
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedQuery] = useDebounce(query, 1000);

  const { data, isLoading, isError, isSuccess, isFetched } = useQuery({
    queryKey: ["notes", debouncedQuery, currentPage],
    queryFn: () => fetchNotes(debouncedQuery, currentPage),
    enabled: true,
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearch = (topic: string) => {
    setQuery(topic);
    setCurrentPage(1);
  };

  const queryClient = useQueryClient();

  // CREATE NOTE
  const createMutation = useMutation({
    mutationFn: async (newNote: { title: string; content: string; tag: string }) => {
      const res = await axios.post(
        `${import.meta.env.VITE_NOTEHUB_BASE_URL}/notes`,
        newNote,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
            accept: "application/json",
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created!");
      setIsModalOpen(false); // ✅ закриває модалку після успішного створення
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  // DELETE NOTE
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted!");
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

  useEffect(() => {
    if (isFetched && isSuccess && notes.length === 0 && debouncedQuery) {
      toast.error("No notes found for your request.");
    }
  }, [isFetched, isSuccess, notes.length, debouncedQuery]);

  return (
    <>
      <div className={css.header}>
        <SearchBox onChange={handleSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </div>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && notes.length > 0 && (
        <NoteList
          notes={notes}
          onSelect={(note: Note) => console.log("Selected:", note)}
        />
      )}

      {isModalOpen && (
        <NoteModal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSubmit={(values) => createMutation.mutate(values)}
          />
        </NoteModal>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
