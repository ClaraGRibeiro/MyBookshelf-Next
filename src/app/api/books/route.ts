import { Book } from "@/types/books";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

function gitCommitAndPush() {
  // exec(`git add . && git commit -m "Updating books data" && git push`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Erro ao executar Git: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     console.error(`stderr: ${stderr}`);
  //     return;
  //   }
  //   console.log(`stdout: ${stdout}`);
  // });
}

const dev = process.env.NODE_ENV === "development";
const filePath = path.join(process.cwd(), "src", "data", "books.json");

function readBooks() {
  if (!dev) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function writeBooks(books: any[]) {
  if (!dev) return;
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
}

// GET /api/books
export async function GET() {
  const books = readBooks();
  return NextResponse.json(books);
}

// POST /api/books
export async function POST(req: Request) {
  const newBook = await req.json();
  const books = readBooks();
  const maxId = books.reduce(
    (max: number, book: Book) => Math.max(max, book.id),
    0,
  );
  books.push({ ...newBook, id: maxId + 1 });
  writeBooks(books);
  gitCommitAndPush();
  return NextResponse.json({ success: true, books });
}

// PUT /api/books
export async function PUT(req: Request) {
  const updatedBook = await req.json();
  let books = readBooks();
  books = books.map((b: any) => (b.id === updatedBook.id ? updatedBook : b));
  writeBooks(books);
  gitCommitAndPush();
  return NextResponse.json({ success: true, books });
}

// DELETE /api/books?id=123
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  let books = readBooks();
  books = books.filter((b: any) => b.id !== id);
  writeBooks(books);
  gitCommitAndPush();
  return NextResponse.json({ success: true, books });
}
