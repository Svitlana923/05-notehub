export interface Note {
    id: number;
    poster_path: string;
    backdrop_path: string;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    total_pages: number;
}

export interface NoteTag {
    id: number;
    noteId: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    color: string;
    description: string;
    category: string;
    icon: string;
    isPublic: boolean;}