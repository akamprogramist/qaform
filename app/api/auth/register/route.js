import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullname, email, password } = body;

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
      },
      // Only select safe fields to return
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
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
