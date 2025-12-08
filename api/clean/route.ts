import { NextResponse } from "next/server";
import { cleanText } from "./cleanText";

export async function POST(request: Request) {
  const body = await request.json();
  const cleaned = cleanText(body.text);

  return NextResponse.json({ cleaned });
}

// ★GET でテストできるようにする（削除可）
export async function GET() {
  cleanText("Hello    world.   This   is  a test !");
  return NextResponse.json({ ok: true });
}
