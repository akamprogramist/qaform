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
      { status: 200 }
    );
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials!" },
        { status: 200 }
      );
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid credentials!" },
        { status: 200 }
      );
    }
    const token = jwt.sign({ id: user.id }, "appSecret");

    (await cookies()).set("token", token);
    return NextResponse.json(user, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "An error occurred, please try again later!" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
