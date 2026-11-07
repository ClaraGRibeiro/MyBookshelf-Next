"use client";

import { Book } from "@/types/books";
import { getReadDays } from "@/lib/utils";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Download } from "lucide-react";

type XlsxProps = {
  books: Book[];
};

export default function Xlsx({ books }: XlsxProps) {
  const downloadBooksXLSX = async (books: Book[]) => {
    const booksList = books.sort((a, b) => {
      if (!a.title) return 1;
      if (!b.title) return -1;
      return a.title.localeCompare(b.title);
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Books");
    worksheet.columns = [
      { header: "#", key: "index", width: 5 },
      { header: "Title", key: "title", width: 35 },
      { header: "Subtitle", key: "subtitle", width: 70 },
      { header: "Author", key: "author", width: 25 },
      { header: "Publisher", key: "publisher", width: 25 },
      { header: "Pages", key: "pages", width: 6 },
      { header: "Got Date", key: "gotDate", width: 12 },
      { header: "Read Date", key: "readDate", width: 12 },
      { header: "Read Days", key: "readDays", width: 10 },
      { header: "Price", key: "price", width: 6 },
      { header: "Cover", key: "image", width: 6 },
      { header: "Shop", key: "link", width: 6 },
      { header: "Ownership", key: "ownership", width: 10 },
      { header: "Mode", key: "mode", width: 6 },
      { header: "Status", key: "status", width: 6 },
    ];

    for (let i = 0; i < booksList.length; i++) {
      const b = booksList[i];
      const row = worksheet.addRow({
        index: i + 1,
        title: b.title,
        subtitle: b.subtitle ?? "-",
        author: b.author,
        publisher: b.publisher ?? "-",
        pages: b.pages ?? "-",
        gotDate: b.gotDate ? String(b.gotDate) : "-",
        readDate: b.readDate ? String(b.readDate) : "-",
        readDays: getReadDays(b) ?? "-",
        price: b.price ?? "-",
        image: b.image ?? "-",
        link: b.link ?? "-",
        ownership: b.ownership === "Borrowed" ? "🤝" : "🏠",
        mode: b.mode === "Digital" ? "📱" : "📚",
        status:
          b.status === "Read"
            ? "✅"
            : b.status === "Reading"
              ? "👀"
              : b.status === "Unread"
                ? "❌"
                : "🎯",
      });
      const coverCell = row.getCell("K");
      coverCell.value = { text: "Link", hyperlink: b.image || "" };
      coverCell.font = { color: { argb: "FF0000FF" }, underline: true };
      const shopCell = row.getCell("L");
      shopCell.value = { text: "Link", hyperlink: b.link || "" };
      shopCell.font = { color: { argb: "FF0000FF" }, underline: true };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "books.xlsx",
    );

    toast("✅ Success", {
      description: "Books data has been downloaded",
    });
  };

  return (
    <Button
      variant="own"
      className="hover:!bg-(--light-slate) active:!bg-(--light-slate)"
      onClick={() => downloadBooksXLSX(books)}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="!text-(--light-slate) group-hover:!text-(--dark-slate) group-active:!text-(--dark-slate) btn-content">
            <Download strokeWidth={1.5} className="md-icon cursor-pointer" />
          </span>
        </TooltipTrigger>
        <TooltipContent>Download database</TooltipContent>
      </Tooltip>
    </Button>
  );
}
