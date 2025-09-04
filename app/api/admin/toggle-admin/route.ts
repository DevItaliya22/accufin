import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session.user.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { userId, isAdmin } = await request.json();

    if (!userId || typeof isAdmin !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Prevent admin from removing their own admin status
    if (session.user.id === userId && !isAdmin) {
      return NextResponse.json(
        {
          error: "Cannot remove your own admin privileges",
        },
        { status: 400 }
      );
    }

    // Update user's admin status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAdmin },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `User ${isAdmin ? "promoted to" : "removed from"} admin successfully`,
    });
  } catch (error) {
    console.error("Error toggling admin status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
