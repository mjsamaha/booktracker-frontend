export enum BookStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export const BookStatusLabels: Record<BookStatus, string> = {
  [BookStatus.NOT_STARTED]: 'Not Started',
  [BookStatus.IN_PROGRESS]: 'In Progress',
  [BookStatus.COMPLETED]: 'Completed'
}

export const BookStatusColors: Record<BookStatus, string> = {
  [BookStatus.NOT_STARTED]: 'default',
  [BookStatus.IN_PROGRESS]: 'processing',
  [BookStatus.COMPLETED]: 'success'
};
