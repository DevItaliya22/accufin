import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Get all responses for a specific form
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First check if form exists and get form fields for label mapping
    const form = await prisma.forms.findUnique({
      where: { id: (await params).id },
      include: {
        inputs: true,
        selections: true,
        multipleChoice: true,
        ratings: true,
        matrices: true,
        netPromoterScores: true,
        separators: true,
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Get all responses for this form
    const responses = await prisma.formResponse.findMany({
      where: { formId: (await params).id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        answers: {
          select: {
            id: true,
            fieldId: true,
            fieldType: true,
            value: true,
            rowId: true,
            columnId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Create field label mapping
    const fieldLabels: Record<string, string> = {};

    form.inputs?.forEach((input) => {
      fieldLabels[input.id] = input.label || "Untitled Field";
    });

    form.selections?.forEach((selection) => {
      fieldLabels[selection.id] = selection.label || "Untitled Field";
    });

    form.multipleChoice?.forEach((multipleChoice) => {
      fieldLabels[multipleChoice.id] = multipleChoice.label || "Untitled Field";
    });

    form.ratings?.forEach((rating) => {
      fieldLabels[rating.id] = rating.question || "Untitled Field";
    });

    form.matrices?.forEach((matrix) => {
      fieldLabels[matrix.id] = matrix.title || "Untitled Field";
    });

    form.netPromoterScores?.forEach((nps) => {
      fieldLabels[nps.id] = nps.question || "Untitled Field";
    });

    form.separators?.forEach((separator) => {
      fieldLabels[separator.id] = separator.title || "Untitled Field";
    });

    const formData = {
      id: form.id,
      title: form.title,
      description: form.description,
      fieldLabels,
      responses,
    };

    return NextResponse.json(formData);
  } catch (error) {
    console.error("Error fetching form responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch form responses" },
      { status: 500 }
    );
  }
}
