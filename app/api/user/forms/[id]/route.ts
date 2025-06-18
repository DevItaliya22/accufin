import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Get form details for filling
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already submitted this form
    const existingResponse = await prisma.formResponse.findFirst({
      where: {
        formId: params.id,
        userId: session.user.id,
      },
    });

    if (existingResponse) {
      return NextResponse.json(
        { error: "You have already submitted this form" },
        { status: 400 }
      );
    }

    // Get form details with all fields
    const form = await prisma.forms.findUnique({
      where: { id: params.id },
      include: {
        inputs: {
          select: {
            id: true,
            label: true,
            required: true,
            type: true,
          },
        },
        selections: {
          select: {
            id: true,
            label: true,
            required: true,
            options: true,
          },
        },
        multipleChoice: {
          select: {
            id: true,
            label: true,
            required: true,
            options: true,
            maxChoices: true,
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (!form.isActive) {
      return NextResponse.json(
        { error: "This form is no longer active" },
        { status: 400 }
      );
    }

    // Build the fields array in sequence order
    const fields = [];

    for (const fieldId of form.sequence) {
      const input = form.inputs.find((i) => i.id === fieldId);
      const selection = form.selections.find((s) => s.id === fieldId);
      const multipleChoice = form.multipleChoice.find((m) => m.id === fieldId);

      if (input) {
        fields.push({
          id: input.id,
          type: "input" as const,
          label: input.label || "",
          required: input.required,
          inputType: input.type || "text",
        });
      } else if (selection) {
        fields.push({
          id: selection.id,
          type: "selection" as const,
          label: selection.label || "",
          required: selection.required,
          options: selection.options,
        });
      } else if (multipleChoice) {
        fields.push({
          id: multipleChoice.id,
          type: "multipleChoice" as const,
          label: multipleChoice.label || "",
          required: multipleChoice.required,
          options: multipleChoice.options,
          maxChoices: multipleChoice.maxChoices || 1,
        });
      }
    }

    const formData = {
      id: form.id,
      title: form.title,
      description: form.description,
      isCompulsory: form.isCompulsory,
      privacyLabel: form.privacyLabel,
      fields,
    };

    return NextResponse.json(formData);
  } catch (error) {
    console.error("Error fetching form for filling:", error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}
