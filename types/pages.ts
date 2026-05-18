export interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Página actual (0-indexed)
  first: boolean;
  last: boolean;
}