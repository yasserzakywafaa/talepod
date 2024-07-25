export interface PageResponse<TResult> {
  results: TResult[];
  paging: PagingInfo;
}

export interface PagingInfo {
  pageNumber?: number;
  pageSize?: number;
  totalCount?: number;
  totalPagesCount?: number;
}
