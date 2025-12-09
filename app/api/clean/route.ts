// app/api/clean/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cleanCSV } from "@/lib/cleanCSV";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const csv: string = body.csv ?? "";

    if (!csv || typeof csv !== "string") {
      return NextResponse.json(
        { error: "csv が空です" },
        { status: 400 }
      );
    }

    const result = cleanCSV(csv);

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "サーバー側でエラーが発生しました" },
      { status: 500 }
    );
  }
}
