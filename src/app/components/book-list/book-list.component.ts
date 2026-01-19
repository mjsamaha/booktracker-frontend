import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { BookService } from '../../services/book.service';
import { BookResponse } from '../../models/book.interface';
import { BookStatus, BookStatusLabels, BookStatusColors } from '../../models/book-status.enum';
import { BookFormComponent } from '../book-form/book-form.component';
import { BookDetailComponent } from '../book-detail/book-detail.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzTagModule,
    NzSpaceModule,
    NzSelectModule,
    NzModalModule,
    NzEmptyModule,
    NzPopconfirmModule,
    NzToolTipModule,
    BookFormComponent,
    BookDetailComponent
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.sass'
})
export class BookListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Signals for reactive state management
  books = signal<BookResponse[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  selectedStatus = signal<BookStatus | 'ALL'>('ALL');

  // Modal visibility states
  showBookForm = signal(false);
  showBookDetail = signal(false);
  selectedBookForEdit = signal<BookResponse | null>(null);
  selectedBookForView = signal<BookResponse | null>(null);

  // Computed filtered books
  filteredBooks = computed(() => {
    const books = this.books();
    const term = this.searchTerm().toLowerCase();
    const status = this.selectedStatus();

    return books.filter(book => {
      // Filter by search term (title, author, genre)
      const matchesSearch = term === '' ||
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        book.genre.toLowerCase().includes(term);

      // Filter by status
      const matchesStatus = status === 'ALL' || book.status === status;

      return matchesSearch && matchesStatus;
    });
  });

  // Enums and helpers for template
  readonly BookStatus = BookStatus;
  readonly BookStatusLabels = BookStatusLabels;
  readonly BookStatusColors = BookStatusColors;
  readonly statusOptions = [
    { label: 'All Books', value: 'ALL' },
    { label: 'Not Started', value: BookStatus.NOT_STARTED },
    { label: 'In Progress', value: BookStatus.IN_PROGRESS },
    { label: 'Completed', value: BookStatus.COMPLETED }
  ];

  constructor(
    private bookService: BookService,
    private message: NzMessageService,
    private modal: NzModalService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.handleQueryParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all books from the backend
   */
  loadBooks(): void {
    this.loading.set(true);
    this.bookService.getAllBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (books) => {
          this.books.set(books);
          this.loading.set(false);
          this.message.success(`Loaded ${books.length} books`);
        },
        error: (error) => {
          this.loading.set(false);
          this.message.error('Failed to load books');
          console.error('Error loading books:', error);
        }
      });
  }

  /**
   * Handle query parameters for filtering
   */
  private handleQueryParams(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['status']) {
          this.selectedStatus.set(params['status'] as BookStatus);
        }
      });
  }

  /**
   * Search input change handler
   */
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  /**
   * Status filter change handler
   */
  onStatusFilterChange(value: BookStatus | 'ALL'): void {
    this.selectedStatus.set(value);
  }

  /**
   * Open add book modal
   */
  onAddBook(): void {
    this.selectedBookForEdit.set(null);
    this.showBookForm.set(true);
  }

  /**
   * Open edit book modal
   */
  onEditBook(book: BookResponse): void {
    this.selectedBookForEdit.set(book);
    this.showBookForm.set(true);
  }

  /**
   * View book details
   */
  onViewBook(book: BookResponse): void {
    this.selectedBookForView.set(book);
    this.showBookDetail.set(true);
  }

  /**
   * Handle book form modal close
   */
  onBookFormClose(): void {
    this.showBookForm.set(false);
    this.selectedBookForEdit.set(null);
  }

  /**
   * Handle book saved (create or update)
   */
  onBookSaved(): void {
    this.loadBooks(); // Reload the list
  }

  /**
   * Handle edit request from detail modal
   */
  onEditFromDetail(book: BookResponse): void {
    this.showBookDetail.set(false);
    this.selectedBookForEdit.set(book);
    this.showBookForm.set(true);
  }

  /**
   * Delete book with confirmation
   */
  onDeleteBook(book: BookResponse): void {
    this.bookService.deleteBook(book.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.message.success(`Deleted "${book.title}"`);
          this.loadBooks(); // Reload the list
        },
        error: (error) => {
          this.message.error('Failed to delete book');
          console.error('Error deleting book:', error);
        }
      });
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
