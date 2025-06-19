import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("session", session);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("session.user.id", session.user.id);
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      contactNumber: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name, contactNumber } = await req.json();
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      contactNumber,
    },
    select: {
      id: true,
      email: true,
      name: true,
      contactNumber: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(user);
}
