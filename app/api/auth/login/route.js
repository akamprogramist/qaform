import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 } // Changed to 400 for a bad request
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials!" },
        { status: 401 } // Changed to 401 Unauthorized for invalid credentials
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials!" },
        { status: 401 } // Changed to 401 Unauthorized
      );
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, "appSecret");

    // Set the cookie with HttpOnly and Secure flags
    const cookie = await cookies();
    cookie.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    return NextResponse.json({
      user: { email: user.email, name: user.name, role: user.role },
      success: true,
      message: "Logged in successfully!",
      status: 200,
    });
  } catch (error) {
    console.error(error); // Log any unexpected errors for debugging
    return NextResponse.json(
      { error: "An error occurred, please try again later!" },
      { status: 500 } // Internal Server Error
    );
  } finally {
    await prisma.$disconnect();
  }
}
