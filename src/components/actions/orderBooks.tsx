// components
import { Book } from "@/types/books";

type orderBooksProps = {
  books: Book[];
  sortBy: keyof Book;
  sortAsc: boolean;
  pinReadings: boolean;
  filterBy: Book["status"] | Book["ownership"] | Book["mode"] | null;
};

const orderBooks = ({
  books,
  sortBy,
  sortAsc,
  pinReadings,
  filterBy,
}: orderBooksProps): Book[] => {
  const parseDate = (val: string): null | number => {
    if (!val || val === "-") return null;
    const parts = val.split("/");
    if (parts.length !== 3) return 0;
    const d = new Date(parts.reverse().join("-"));
    return isNaN(d.getTime()) ? 0 : d.getTime();
  };

  const compareBooks = (a: Book, b: Book) => {
    if (!sortBy) return 0;
    const aValue = a[sortBy] ?? "";
    const bValue = b[sortBy] ?? "";

    if (sortBy === "gotDate" || sortBy === "readDate") {
      const aDate = parseDate(aValue as string);
      const bDate = parseDate(bValue as string);
      if (aDate === null && bDate === null) return 0;
      if (aDate === null) return 1;
      if (bDate === null) return -1;
      return sortAsc ? bDate - aDate : aDate - bDate;
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortAsc ? aValue - bValue : bValue - aValue;
    }

    return sortAsc
      ? aValue.toString().localeCompare(bValue.toString())
      : bValue.toString().localeCompare(aValue.toString());
  };

  let sortedBooks: Book[];
  if (pinReadings) {
    sortedBooks = [
      ...books.filter((b) => b.status === "Reading").sort(compareBooks),
      ...books.filter((b) => b.status === "Next").sort(compareBooks),
      ...books
        .filter((b) => b.status !== "Reading" && b.status !== "Next")
        .sort(compareBooks),
    ];
  } else {
    sortedBooks = [...books.sort(compareBooks)];
  }

  if (filterBy) {
    if (filterBy === "Owned" || filterBy === "Borrowed") {
      sortedBooks = sortedBooks.filter((b) => b.ownership === filterBy);
    } else if (filterBy === "Physical" || filterBy === "Digital") {
      sortedBooks = sortedBooks.filter((b) => b.mode === filterBy);
    } else if (filterBy === "Unread") {
      sortedBooks = sortedBooks.filter((b) => b.status !== "Read");
    } else {
      sortedBooks = sortedBooks.filter((b) => b.status === filterBy);
    }
  }

  return sortedBooks;
};

export default orderBooks;
