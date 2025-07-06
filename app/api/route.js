import { conectDb } from "@/lib/config/db";
import TodoModel from "@/lib/models/TodoModel";
import TodoUserModel from "@/lib/models/TodoUserModel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const LoadDb = async () => {
  await conectDb();
};
LoadDb();

// Helper to get current user
async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await TodoUserModel.findById(decoded.id).select("_id");
    
    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ todos: [] });
    }

    const todos = await TodoModel.find({ user: user._id });
    return NextResponse.json({ todos });
  } catch (error) {
    return NextResponse.json({ todos: [] });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { title, description } = await request.json();
    await TodoModel.create({ 
      title, 
      description,
      user: user._id
    });
    
    return NextResponse.json({ msg: "Todo Created" });
  } catch (error) {
    return NextResponse.json({ msg: "Error creating todo" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const mongoId = request.nextUrl.searchParams.get("mongoId");
    const todo = await TodoModel.findOne({ _id: mongoId, user: user._id });

    if (!todo) {
      return NextResponse.json({ msg: "Todo not found" }, { status: 404 });
    }

    await TodoModel.findByIdAndDelete(mongoId);
    return NextResponse.json({ msg: "Todo Deleted" });
  } catch (error) {
    return NextResponse.json({ msg: "Error deleting todo" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const mongoId = request.nextUrl.searchParams.get("mongoId");
    const todo = await TodoModel.findOne({ _id: mongoId, user: user._id });

    if (!todo) {
      return NextResponse.json({ msg: "Todo not found" }, { status: 404 });
    }

    const body = await request.json();
    const updateFields = {};

    // Handle status toggle
    if (body.hasOwnProperty("isCompleted")) {
      updateFields.isCompleted = body.isCompleted;
    }

    // Handle task editing
    if (body.title || body.description) {
      if (body.title) updateFields.title = body.title;
      if (body.description) updateFields.description = body.description;
    }

    await TodoModel.findByIdAndUpdate(mongoId, { $set: updateFields });
    return NextResponse.json({ msg: "Todo Updated" });
  } catch (error) {
    return NextResponse.json({ msg: "Error updating todo" }, { status: 500 });
  }
}