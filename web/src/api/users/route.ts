import { NextResponse } from "next/server";
import { getUsers } from "@/libs/user";

export async function GET() {
  try {
    const data = await getUsers();
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Failed to load" }, { status: 500 });
  }
}
