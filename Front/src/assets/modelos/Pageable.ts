export interface FilterPageable {
  page?: number;
  size?: number;
  sortBy?: string | string[];
  direction?: string | string[];
}

export interface Paginator {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}