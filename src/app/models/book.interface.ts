import { BookStatus } from "./book-status.enum";


export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  status: BookStatus;
  notes: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Request DTO for creating a new book (no id, timestamps)
export interface BookRequest {
  title: string;
  author: string;
  genre: string;
  status: BookStatus;
  notes?: string | null;
}

// Response DTO (same as Book interface)
export interface BookResponse extends Book {}

// Optional: Form model with all fields optional for editing
export interface BookFormModel {
  id?: number;
  title?: string;
  author?: string;
  genre?: string;
  status?: BookStatus;
  notes?: string | null;
}
