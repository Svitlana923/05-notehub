import css from './NoteModal.module.css'
import { createPortal } from "react-dom";
import { useEffect } from 'react';
import type { Note } from '../../types/note'

interface NoteModalProps {
    onClose: () => void;
    note: Note | null;
    }


export default function NoteModal({ onClose, note }: NoteModalProps) {
 if (!note) return null;
    
    useEffect(() => {
	  const handleKeyDown = (e: KeyboardEvent) => {
	    if (e.key === "Escape") {
	      onClose();
	    }
	  };
	
	  document.addEventListener("keydown", handleKeyDown);
	  document.body.style.overflow = "hidden";
	  return () => {
          document.removeEventListener("keydown", handleKeyDown);
           document.body.style.overflow = "";
	  };
	}, [onClose]);


    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    }


    return createPortal(
        <div className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={handleBackdropClick}>
        
<div className={css.modal}>
    <button className={css.closeButton}
                onClick={onClose}
                aria-label="Close modal">
                &times;
            </button>
            <div className={css.content}>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
                <p><strong>Tag:</strong> {note.tag}</p>
                    </div>
                </div>
            </div>,
        document.body);
}