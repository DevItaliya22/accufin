import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, isActive } = await request.json();
    if (!userId || typeof isActive !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (session.user.id === userId) {
      return NextResponse.json({ error: "You cannot change your own status" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return NextResponse.json({ message: `User has been ${isActive ? "activated" : "deactivated"}.` });
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


