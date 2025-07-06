import { conectDb } from "@/lib/config/db";
import TodoUserModel from "@/lib/models/TodoUserModel";
import bcrypt from "bcrypt";

const { NextResponse } = require("next/server");

// ✅ POST API for Register
export async function POST(request) {
  try {
    await conectDb();

    //Setp-2 Name email pasword ko le ana (Destructure Karke)
    const { name, email, password } = await request.json();

    //Step-3 User Already Exist or Not
    const existedUser = TodoUserModel.findOne({ email });
    if (!existedUser) {
      return NextResponse.josn({ msg: "User Already Exist" });
    }

    //Step-4 password ko Hash karo
    const hashPassword = await bcrypt.hash(password, 10);

    // Step-5 Created the User:
    await TodoUserModel.create({
      name,
      email,
      password: hashPassword,
    });
    return NextResponse.json({ msg: "User register Sucessfully" });
    
  } catch (error) {
    console.error("Registration Error: ", error.message);
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
