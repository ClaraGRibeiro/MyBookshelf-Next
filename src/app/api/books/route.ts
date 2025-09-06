import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// ✅ Export named function for GET
export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM books");
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro ao buscar livros" },
      { status: 500 },
    );
  }
}

// Se quiser criar POST futuramente:
// export async function POST(req: Request) { ... }
