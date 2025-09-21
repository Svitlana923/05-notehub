
import { Toaster, toast } from 'react-hot-toast'
import SearchBox from '../SearchBox/SearchBox'
import css from './App.module.css';
import { useState, useEffect } from 'react'
import NoteList from '../NoteList/NoteList'
import type { Note } from '../../types/note'
import { fetchNotes } from '../../services/noteService'
import NoteModal from '../NoteModal/NoteModal'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Pagination from '../Pagination/Pagination';
import { useMutation } from '@tanstack/react-query';


function App() {
  const [query, setQuery] = useState<string>('');

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess, isFetched} = useQuery({
    queryKey: ['notes', query, currentPage],
    queryFn: () => fetchNotes(query, currentPage),
    //enabled: query !== '',
    enabled: true,
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  
  const openModal = (note: Note) => {
    setSelectedNote(note);
  }

  const closeModal = () => {
    setSelectedNote(null);
  }
  
  const handleSearch = (topic: string) => {
    setQuery(topic)
    setCurrentPage(1);
  };

  const handleCreate = () => {
  setSelectedNote({ id: '', title: '', content: '' });
  };
  
  useEffect(() => {
    if (isFetched && isSuccess && notes.length === 0 && query) {
      toast.error("No notes found for your request.");
    }
  }, [isFetched, isSuccess, notes.length, query]);

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
      <button className={css.button} onClick={handleCreate}>
        Create note +
      </button>
    </div>

    {isLoading && <Loader />}
    {isError && <ErrorMessage />}

    {!isLoading && !isError && notes.length > 0 && (
      <NoteList notes={notes} onSelect={openModal} />
    )}

    {selectedNote && <NoteModal onClose={closeModal} note={selectedNote} />}
    <Toaster position="top-center" reverseOrder={false} />
  </>
)
}

export default App