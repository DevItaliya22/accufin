import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, isActive } = body;
    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Testimonial id and isActive are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.testimonial.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error toggling testimonial status:", error);
    return NextResponse.json(
      { error: "Failed to toggle testimonial status" },
      { status: 500 }
    );
  }
}
