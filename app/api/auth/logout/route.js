import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  cookieStore.set("token", "", { maxAge: 0 });

  return NextResponse.json({ msg: "Logout Successful" });
}
  