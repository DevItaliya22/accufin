import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Get all active forms for the user with their completion status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active forms
    const activeForms = await prisma.forms.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        isActive: true,
        isCompulsory: true,
        createdAt: true,
      },
      orderBy: [
        { isCompulsory: "desc" }, // Show compulsory forms first
        { createdAt: "desc" },
      ],
    });

    // Get user's form responses to check completion status
    const userResponses = await prisma.formResponse.findMany({
      where: { userId: session.user.id },
      select: {
        formId: true,
        createdAt: true,
      },
    });

    // Create a map of completed forms
    const completedFormsMap = new Map();
    userResponses.forEach((response) => {
      completedFormsMap.set(response.formId, response.createdAt);
    });

    // Combine forms with completion status
    const formsWithStatus = activeForms.map((form) => ({
      ...form,
      isCompleted: completedFormsMap.has(form.id),
      completedAt: completedFormsMap.get(form.id) || null,
    }));

    return NextResponse.json(formsWithStatus);
  } catch (error) {
    console.error("Error fetching user forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}
