import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullname, email, password, role } = body;

    if (!fullname || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, Email, and password are required",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "The Email address is already in use",
        },
        { status: 409 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: fullname.trim(),
        email: email.toLowerCase().trim(),
        password: hash,
        role: role,
      },
    });
    const token = jwt.sign({ id: user.id, role: user.role }, "appSecret");

    // Set the cookie with HttpOnly and Secure flags
    const cookie = await cookies();
    cookie.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });
    return NextResponse.json(
      {
        user: { email: user.email, name: user.name, role: user.role },
        success: true,
        message: "Registration successful",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred, please try again later",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
