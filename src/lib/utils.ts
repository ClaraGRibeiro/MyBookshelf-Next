import { Book, SortKey } from "@/types/books";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const SORT_LABELS: Partial<Record<SortKey, string>> = {
  readDays: "Read Days",
};

export function getSortLabel(key: SortKey) {
  return SORT_LABELS[key] ?? key;
}

export function parseBookDate(value?: string | null) {
  if (!value || value === "-") return null;
  const parts = value.split("/");
  if (parts.length !== 3) return null;
  const date = new Date(parts.reverse().join("-"));
  return isNaN(date.getTime()) ? null : date.getTime();
}

export function getReadDays(book: Book) {
  const startDate = parseBookDate(book.startDate);
  const readDate = parseBookDate(book.readDate);
  if (startDate === null || readDate === null) return null;
  const days = Math.round((readDate - startDate) / DAY_IN_MS);
  return days < 1 ? 1 : days;
}
