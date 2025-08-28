import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

const categories = [
  {
    name: "Autoajuda",
    url: "https://www.amazon.com.br/gp/bestsellers/books/7841720011",
  },
  {
    name: "FantasiaHorrorFiccaoCientifica",
    url: "https://www.amazon.com.br/gp/bestsellers/books/7841775011",
  },
  {
    name: "PolicialSuspenseMistério",
    url: "https://www.amazon.com.br/gp/bestsellers/books/7872829011",
  },
];

export async function GET() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const books: any[] = [];

  for (const category of categories) {
    await page.goto(category.url, { waitUntil: "networkidle0" });

    const book = await page.evaluate(() => {
      const el = document.querySelector("div.p13n-sc-uncoverable-faceout");
      if (!el) return null;
      const img = el.querySelector("img");
      const title = img?.alt || "";
      const author =
        el.querySelector("a.a-size-small.a-link-child div")?.textContent ||
        "Autor não encontrado";
      const link =
        "https://www.amazon.com.br" +
        (el.querySelector("a.a-link-normal")?.getAttribute("href") || "");
      return { title, author, image: img?.src, link };
    });

    if (book)
      books.push({ rank: books.length + 1, ...book, category: category.name });
  }

  await browser.close();
  return NextResponse.json(books);
}
