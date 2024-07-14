export class Pagination<T> {
  public pageSize: number = 10;
  public page: number = 0;
  public totalCount: number = 0;
  public orderBy: string = '';
  public data: T[] = [];

  constructor(
    pageSize?: number,
    page?: number,
    totalCount?: number,
    data?: T[],
  ) {
    this.pageSize = pageSize || this.pageSize;
    this.page = page || this.page;
    this.totalCount = totalCount || this.totalCount;
    this.data = data || this.data;
  }
}