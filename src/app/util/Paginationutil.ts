import { HttpHeaders } from "@angular/common/http";

export class PaginationUtil {

  static getRequestRange(pageNumber: number, pageSize: number): string {
    let startRange = (pageNumber * pageSize) + 1;
    let endRange = (pageNumber + 1) * pageSize;
    return `items=${startRange}-${endRange}`;
  }

  static getTotalRecords(headers: HttpHeaders): number {
    const rangeHeader = headers.get("content-range");
    const totalRecords = parseInt(rangeHeader?.split("/")?.[1] as string);
    return totalRecords;
  }
}
