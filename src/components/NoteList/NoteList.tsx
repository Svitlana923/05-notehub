import css from './NoteList.module.css'
import type { Note } from '../../types/note';

interface NoteListProps {
  notes: Note[];
  onSelect?: (note: Note) => void;
  onDelete?: (id: string) => void;
}

export default function NoteList({ notes, onSelect, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li 
          key={note.id} 
          className={css.listItem}
          onClick={() => onSelect?.(note)}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              type="button"
              className={css.button}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(note.id);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
