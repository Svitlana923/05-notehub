
import { Toaster, toast } from "react-hot-toast";
import SearchBox from "../SearchBox/SearchBox";
import css from "./App.module.css";
import { useState, useEffect } from "react";
import NoteList from "../NoteList/NoteList";
import { fetchNotes } from "../../services/noteService";
import Modal from "../Modal/Modal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
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
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearch = (topic: string) => {
    setQuery(topic);
    setCurrentPage(1);
  };

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
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
        )}

        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </div>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && notes.length > 0 && <NoteList notes={notes} onSelect={(n) => console.log("Selected:", n)} />}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} /> {}
        </Modal>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
