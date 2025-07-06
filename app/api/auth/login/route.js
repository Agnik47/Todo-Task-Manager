import { conectDb } from "@/lib/config/db";
import TodoUserModel from "@/lib/models/TodoUserModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // Database connect karo
    await conectDb();

    // Body se data nikaalo
    const { email, password } = await request.json();

    // User exist karta hai kya?
    const user = await TodoUserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { msg: "Email or Password is Wrong" },
        { status: 404 }
      );
    }

    // Password match karo
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return NextResponse.json(
        { msg: "Email or Password is Wrong" },
        { status: 404 }
      );
    }

    // Token banao
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Token ko cookie pe save karo sahi tarike se
    const cookieStore = cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Response return karo
    return NextResponse.json({
      msg: "Login Successful",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error: ", error.message);
    return NextResponse.json({ msg: "Internal Error" }, { status: 500 });
  }
}
