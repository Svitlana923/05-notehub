import css from './MovieGrid.module.css'
import type { Movie } from '../../types/movie';

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies,  onSelect }: MovieGridProps) {
  return (
    <div>
      <ul className={css.grid}>
        {movies.map((item) => (
          <li key={item.id}>
            <div className={css.card}>
              <img
                className={css.image}
                src={`${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}${item.poster_path}`}
                alt={item.title}
                loading="lazy"
                onClick={() => onSelect(item)}
              />
              <h2 className={css.title}>{item.title}</h2>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
