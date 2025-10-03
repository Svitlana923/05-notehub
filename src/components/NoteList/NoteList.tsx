import css from './NoteList.module.css'
import type { Note } from '../../types/note';
import { useMutation, useQueryClient } from "@tanstack/react-query"; 
import { deleteNote } from "../../services/noteService";
import { toast } from "react-hot-toast";

interface NoteListProps {
  notes: Note[];
  onSelect?: (note: Note) => void;
}

export default function NoteList({ notes, onSelect }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted!");
    },
    onError: () => {
      toast.error("Failed to delete note");
    },
  });

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
                mutation.mutate(note.id);
              }}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
