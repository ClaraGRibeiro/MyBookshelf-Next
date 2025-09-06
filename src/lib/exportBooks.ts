const fs = require("fs");

async function exportBooks() {
  try {
    const res = await fetch("http://localhost:3000/api/books");
    if (!res.ok) throw new Error("API Error");

    let books = await res.json();

    // Converter price de string para número
    books = books.map((book: { price: number }) => ({
      ...book,
      price: Number(book.price),
    }));

    fs.writeFileSync("src/data/books.json", JSON.stringify(books, null, 2));
    console.log("books.json updated!");
  } catch (error) {
    console.error(error);
  }
}

exportBooks();
