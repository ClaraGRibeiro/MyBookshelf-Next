export type Book = {
  id: number;
  title: string;
  subtitle?: string | null;
  author: string;
  publisher?: string | null;
  pages?: number | null;
  gotDate?: string | null;
  readDate?: string | null;
  price: number;
  image?: string | null;
  link?: string | null;
  ownership: string;
  mode: string;
  status: string;
};
