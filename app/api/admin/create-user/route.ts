import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    const {
      email,
      password,
      name,
      sinNumber,
      businessNumber,
      dateOfBirth,
      contactNumber,
    } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    // Parse dateOfBirth if provided
    let parsedDateOfBirth = null;
    if (dateOfBirth) {
      parsedDateOfBirth = new Date(dateOfBirth);
      if (isNaN(parsedDateOfBirth.getTime())) {
        return NextResponse.json(
          { error: "Invalid date of birth format." },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        isAdmin: false,
        name,
        sinNumber,
        businessNumber,
        dateOfBirth: parsedDateOfBirth,
        contactNumber,
      },
      select: {
        id: true,
        email: true,
        name: true,
        sinNumber: true,
        businessNumber: true,
        dateOfBirth: true,
        isAdmin: true,
        createdAt: true,
        contactNumber: true,
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
