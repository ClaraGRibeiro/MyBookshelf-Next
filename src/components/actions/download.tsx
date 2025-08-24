"use client";

// components shadcn
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
// icons radix
import { DownloadIcon } from "@radix-ui/react-icons";
// components
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Book } from "@/types/books";

type DownloadProps = {
  books: Book[];
};
const Download = ({ books }: DownloadProps) => {
  const downloadBooksPDF = (books: Book[]) => {
    const booksList = books.sort((a, b) => {
      if (!a.title) return 1;
      if (!b.title) return -1;
      return a.title.localeCompare(b.title);
    });
    const doc = new jsPDF();

    autoTable(doc, {
      head: [
        [
          "#",
          "Title",
          "Author",
          "Publisher",
          "Price",
          "Pages",
          "Got Date",
          "Read Date",
          "Status",
        ],
      ],
      body: booksList.map((b, i) => [
        i + 1,
        b.title,
        b.author,
        b.publisher ?? "-",
        b.pages ?? "-",
        b.price?.toFixed(2) ?? "-",
        b.gotDate ?? "-",
        b.readDate ?? "-",
        b.status === "Read"
          ? "[x]"
          : b.status === "Reading"
            ? "[o]"
            : b.status === "Unread"
              ? "[ ]"
              : "",
        b.id,
      ]),
      columnStyles: {
        0: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
        6: { halign: "center" },
        7: { halign: "center" },
        8: { halign: "center" },
      },
      headStyles: {
        fillColor: [29, 41, 61],
        textColor: [241, 245, 249],
        fontStyle: "bold",
        halign: "center",
      },
      didDrawCell: (data) => {
        if (data.section === "body") {
          const bookId = data.row.cells[0].raw;
          const book = booksList.find((b) => b.id === bookId);

          if (book?.link) {
            const { x, y, width, height } = data.cell;
            doc.link(x, y, width * data.table.columns.length, height, {
              url: book.link,
            });
          }
        }
      },
    });

    doc.save("books.pdf");
  };

  return (
    <Button
      variant="own"
      className="hover:!bg-[var(--light-slate)] active:!bg-[var(--light-slate)]"
      onClick={() => downloadBooksPDF(books)}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="!text-[var(--light-slate)] group-hover:!text-[var(--dark-slate)] group-active:!text-[var(--dark-slate)] btn-content">
            <DownloadIcon className="!w-6 !h-6 cursor-pointer" />
          </span>
        </TooltipTrigger>
        <TooltipContent>Download data base</TooltipContent>
      </Tooltip>
    </Button>
  );
};

export default Download;
