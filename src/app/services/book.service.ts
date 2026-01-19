import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book, BookRequest, BookResponse } from '../models/book.interface';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // Hardcode the URL temporarily to test
  private readonly apiUrl = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {
    console.log('BookService initialized with API URL:', this.apiUrl);
  }

  /**
   * GET /api/books - Get all books
   */
  getAllBooks(): Observable<BookResponse[]> {
    console.log('Fetching books from:', this.apiUrl);
    return this.http.get<BookResponse[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * GET /api/books/{id} - Get book by ID
   */
  getBookById(id: number): Observable<BookResponse> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Fetching book from:', url);
    return this.http.get<BookResponse>(url)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * POST /api/books - Create a new book
   */
  createBook(bookRequest: BookRequest): Observable<BookResponse> {
    console.log('Creating book at:', this.apiUrl, bookRequest);
    return this.http.post<BookResponse>(this.apiUrl, bookRequest)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * PUT /api/books/{id} - Update existing book
   */
  updateBook(id: number, bookRequest: BookRequest): Observable<BookResponse> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Updating book at:', url, bookRequest);
    return this.http.put<BookResponse>(url, bookRequest)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * DELETE /api/books/{id} - Delete book by ID
   */
  deleteBook(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Deleting book at:', url);
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  /**
   * Error handling
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Server Error: ${error.status} - ${error.message}`;

      // Handle specific error messages from backend
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    console.error('BookService Error:', {
      message: errorMessage,
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      error: error.error
    });

    return throwError(() => new Error(errorMessage));
  }
}
