
import axios from "axios";
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { deleteNote } from '../../services/noteService';


function App() {
const [query, setQuery] = useState<string>('');
const [currentPage, setCurrentPage] = useState(1);
const [isModalOpen, setIsModalOpen] = useState(false);
const [debouncedQuery] = useDebounce(query, 1000);

  const { data, isLoading, isError, isSuccess, isFetched} = useQuery({
    queryKey: ['notes', debouncedQuery, currentPage],
    queryFn: () => fetchNotes(debouncedQuery, currentPage),
    enabled: true,
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  
  
  const handleSearch = (topic: string) => {
    setQuery(topic)
    setCurrentPage(1);
  };

const queryClient = useQueryClient();

const mutation = useMutation ({
    mutationFn: async (newNote: { title: string; content: string; tag: string }) => {
      const res = await axios.post('https://notehub-public.goit.study/api/notes', newNote);
      return res.data;
  },
  
    onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
    }
  );

  const handleCreate = () => {
     setIsModalOpen(true); 
	  }
  
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
       <button onClick={handleCreate}
         className={css.button}
       >
        Create note +
       </button>
      {mutation.isPending && <div>Adding note...</div>}
	    {mutation.isError && <div>An error occurred</div>}
	    {mutation.isSuccess && <div>Note added!</div>}
    </div>

    {isLoading && <Loader />}
    {isError && <ErrorMessage />}

    {!isLoading && !isError && notes.length > 0 && (
    <NoteList notes={notes}
        onSelect={(note: Note) => console.log("Selected:", note)}
    onDelete={(id: string) => deleteMutation.mutate(id)} 
    />
    )}

  {isModalOpen && (
    <NoteModal onClose={() => setIsModalOpen(false)} /> 
)}
  <Toaster position="top-center" reverseOrder={false} />
    
  </>
)
}

export default App