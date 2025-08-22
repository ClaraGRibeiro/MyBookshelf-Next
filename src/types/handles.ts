import { Book } from "./books";

export type Handles = {
  onAdd: (book: Book) => void;
  onEdit: (bookId: Book) => void;
  onDelete: (bookId: Book["id"]) => void;
  onChangeStatus: (bookId: Book["id"], newStatus: Book["status"]) => void;
};
