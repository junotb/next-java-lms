// src/app/api/teachers/route.ts
import { NextResponse } from "next/server";
import { getTeachers } from "@/libs/teachers";

export async function GET() {
  try {
    const data = await getTeachers();
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Failed to load" }, { status: 500 });
  }
}
