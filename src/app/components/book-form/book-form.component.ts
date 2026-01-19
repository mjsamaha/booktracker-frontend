import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';

import { BookService } from '../../services/book.service';
import { BookRequest, BookResponse } from '../../models/book.interface';
import { BookStatus, BookStatusLabels } from '../../models/book-status.enum';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzGridModule
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.sass'
})
export class BookFormComponent implements OnInit {
  @Input() visible = false;
  @Input() book: BookResponse | null = null; // For editing
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() bookSaved = new EventEmitter<void>();

  bookForm!: FormGroup;
  isSubmitting = false;
  isEditMode = false;

  // Status options for dropdown
  readonly statusOptions = [
    { label: BookStatusLabels[BookStatus.NOT_STARTED], value: BookStatus.NOT_STARTED },
    { label: BookStatusLabels[BookStatus.IN_PROGRESS], value: BookStatus.IN_PROGRESS },
    { label: BookStatusLabels[BookStatus.COMPLETED], value: BookStatus.COMPLETED }
  ];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    // When book input changes (for edit mode)
    if (this.book) {
      this.isEditMode = true;
      this.populateForm();
    } else {
      this.isEditMode = false;
      if (this.bookForm) {
        this.bookForm.reset({
          status: BookStatus.NOT_STARTED // Default status
        });
      }
    }
  }

  /**
   * Initialize the reactive form with validation
   */
  private initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      author: ['', [Validators.required, Validators.maxLength(255)]],
      genre: ['', [Validators.required, Validators.maxLength(100)]],
      status: [BookStatus.NOT_STARTED, [Validators.required]],
      notes: ['', [Validators.maxLength(1000)]]
    });
  }

  /**
   * Populate form with book data for editing
   */
  private populateForm(): void {
    if (this.book && this.bookForm) {
      this.bookForm.patchValue({
        title: this.book.title,
        author: this.book.author,
        genre: this.book.genre,
        status: this.book.status,
        notes: this.book.notes || ''
      });
    }
  }

  /**
   * Handle form submission
   */
  handleSubmit(): void {
    // Validate all form fields
    Object.keys(this.bookForm.controls).forEach(key => {
      this.bookForm.controls[key].markAsDirty();
      this.bookForm.controls[key].updateValueAndValidity();
    });

    if (this.bookForm.valid) {
      this.isSubmitting = true;
      const bookRequest: BookRequest = this.bookForm.value;

      const request$ = this.isEditMode && this.book
        ? this.bookService.updateBook(this.book.id, bookRequest)
        : this.bookService.createBook(bookRequest);

      request$.subscribe({
        next: (response) => {
          this.isSubmitting = false;
          const action = this.isEditMode ? 'updated' : 'created';
          this.message.success(`Book "${response.title}" ${action} successfully!`);
          this.handleCancel();
          this.bookSaved.emit();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.message.error(`Failed to ${this.isEditMode ? 'update' : 'create'} book`);
          console.error('Error saving book:', error);
        }
      });
    }
  }

  /**
   * Handle modal cancel/close
   */
  handleCancel(): void {
    this.bookForm.reset({
      status: BookStatus.NOT_STARTED
    });
    this.visible = false;
    this.visibleChange.emit(false);
  }

  /**
   * Get modal title based on mode
   */
  get modalTitle(): string {
    return this.isEditMode ? 'Edit Book' : 'Add New Book';
  }

  /**
   * Get submit button text based on mode
   */
  get submitButtonText(): string {
    return this.isEditMode ? 'Update Book' : 'Create Book';
  }
}
