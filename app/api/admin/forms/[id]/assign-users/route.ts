import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { userIds } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 }
      );
    }

    // Update the form's assigned users
    const updatedForm = await prisma.forms.update({
      where: { id },
      data: {
        assignedUsers: {
          set: userIds.map((userId: string) => ({ id: userId })),
        },
      },
      include: {
        assignedUsers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedForm);
  } catch (error) {
    console.error("Error updating assigned users:", error);
    return NextResponse.json(
      { error: "Failed to update assigned users" },
      { status: 500 }
    );
  }
}
