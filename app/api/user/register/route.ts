import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import type { Prisma } from "@/lib/generated/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 409 }
      );
    }
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: `${firstName || ""} ${lastName || ""}`.trim() || null,
        isAdmin: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
