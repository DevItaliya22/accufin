import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password, secret ,name} = await request.json();

  console.log(email, password, secret);

  if (!email || !password || !secret) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const isExisting = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isExisting) {
    return NextResponse.json(
      { error: "Admin already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, isAdmin: true, name },
  });

  return NextResponse.json(
    { message: "Admin registered successfully" },
    { status: 200 }
  );
}
