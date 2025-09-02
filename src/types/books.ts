export type Book = {
  id: number;
  title: string;
  author: string;
  publisher?: string;
  pages?: number;
  gotDate?: string;
  readDate?: string;
  price: number;
  image?: string;
  link?: string;
  ownership: "Owned" | "Borrowed";
  mode: "Physical" | "Digital";
  status: "Reading" | "Read" | "Unread";
};
