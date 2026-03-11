import type { nullish } from "../types/global.types";

export interface PaginationOf<T> {
  first: T | nullish;
  last: T | nullish;
  next: T | nullish;
  prev: T | nullish;
}
