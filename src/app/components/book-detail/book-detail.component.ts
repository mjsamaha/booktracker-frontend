import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { BookResponse } from '../../models/book.interface';
import { BookStatus, BookStatusLabels, BookStatusColors } from '../../models/book-status.enum';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzDescriptionsModule,
    NzTagModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    NzEmptyModule
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.sass'
})
export class BookDetailComponent {
  @Input() visible = false;
  @Input() book: BookResponse | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() editRequested = new EventEmitter<BookResponse>();

  readonly BookStatusLabels = BookStatusLabels;
  readonly BookStatusColors = BookStatusColors;

  /**
   * Handle modal close
   */
  handleCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  /**
   * Handle edit button click
   */
  handleEdit(): void {
    if (this.book) {
      this.editRequested.emit(this.book);
      this.handleCancel();
    }
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get status icon based on book status
   */
  getStatusIcon(status: BookStatus): string {
    switch (status) {
      case BookStatus.NOT_STARTED:
        return 'file-add';
      case BookStatus.IN_PROGRESS:
        return 'read';
      case BookStatus.COMPLETED:
        return 'check-circle';
      default:
        return 'book';
    }
  }
}
