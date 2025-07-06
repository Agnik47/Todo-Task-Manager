import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import TodoUserModel from "@/lib/models/TodoUserModel";
import { conectDb } from "@/lib/config/db";

export async function GET() {
  try {
    await conectDb();
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ isAuthenticated: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await TodoUserModel.findById(decoded.id).select("name email");

    if (!user) {
      return NextResponse.json({ isAuthenticated: false });
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false });
  }
}
