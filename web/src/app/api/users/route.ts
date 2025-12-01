import { NextResponse } from "next/server";
import { getUsers } from "@/libs/user";
import { UserRole } from "@/schemas/user-role-schema";
import { UserStatus } from "@/schemas/user-status-schema";
import { UserFilter } from "@/schemas/user-filter-schema";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const role = url.searchParams.get("role") as UserRole;
    const status = url.searchParams.get("status") as UserStatus;
    const firstName = url.searchParams.get("firstName");
    const lastName = url.searchParams.get("lastName");

    const filter = {
      role,
      status,
      firstName,
      lastName,
    } as UserFilter;

    const data = await getUsers(filter);
    return NextResponse.json(data, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Failed to load" }, { status: 500 });
  }
}
