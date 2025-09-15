
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast' 
import SearchBar from '../SearchBar/SearchBar'
import css from './App.module.css';
import { useState, useEffect } from 'react'
import MovieGrid from '../MovieGrid/MovieGrid'
import type { Movie } from '../../types/movie'
import { fetchMovies } from '../../services/movieService'
import MovieModal from '../MovieModal/MovieModal'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate'


function App() {
  const [query, setQuery] = useState<string>('');

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess, isFetched} = useQuery({
    queryKey: ['movies', query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;
  
  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  }

  const closeModal = () => {
    setSelectedMovie(null);
  }
  
  const handleSearch = (topic: string) => {
    setQuery(topic)
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isFetched && isSuccess && movies.length === 0 && query) {
      toast.error("No movies found for your request.");
    }
  }, [isFetched, isSuccess, movies.length, query]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
        
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {!isLoading && !isError && movies.length > 0 && 
      (<>
        <ReactPaginate
            pageCount={totalPages}
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            forcePage={currentPage - 1}
            marginPagesDisplayed={1}
            pageRangeDisplayed={5}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
        />
        <MovieGrid movies={movies} onSelect={openModal} />
  </>
)}
      {selectedMovie && (
        < MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App