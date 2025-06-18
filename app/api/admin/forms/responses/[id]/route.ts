import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Get single form submission for admin
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paramsId = (await params).id;

    // Get form submission with all related data
    const formResponse = await prisma.formResponse.findUnique({
      where: { id: paramsId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        form: {
          include: {
            inputs: true,
            selections: true,
            multipleChoice: true,
          },
        },
        answers: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!formResponse) {
      return NextResponse.json(
        { error: "Form submission not found" },
        { status: 404 }
      );
    }

    // Create field mapping for labels
    const fieldLabels: { [fieldId: string]: string } = {};

    formResponse.form.inputs.forEach((field) => {
      fieldLabels[field.id] = field.label || "";
    });
    formResponse.form.selections.forEach((field) => {
      fieldLabels[field.id] = field.label || "";
    });
    formResponse.form.multipleChoice.forEach((field) => {
      fieldLabels[field.id] = field.label || "";
    });

    // Build the fields array in sequence order
    const fields = [];

    for (const fieldId of formResponse.form.sequence) {
      const input = formResponse.form.inputs.find((i) => i.id === fieldId);
      const selection = formResponse.form.selections.find(
        (s) => s.id === fieldId
      );
      const multipleChoice = formResponse.form.multipleChoice.find(
        (m) => m.id === fieldId
      );

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

    // Add labels to answers
    const answersWithLabels = formResponse.answers.map((answer) => ({
      ...answer,
      fieldLabel: fieldLabels[answer.fieldId] || "Unknown Field",
    }));

    const submissionData = {
      id: formResponse.id,
      formTitle: formResponse.form.title,
      formDescription: formResponse.form.description,
      isCompulsory: formResponse.form.isCompulsory,
      isChecked: formResponse.isChecked,
      submittedAt: formResponse.createdAt.toISOString(),
      userEmail: formResponse.user.email,
      userName: formResponse.user.name || formResponse.user.email,
      fields,
      answers: answersWithLabels,
    };

    return NextResponse.json(submissionData);
  } catch (error) {
    console.error("Error fetching form submission:", error);
    return NextResponse.json(
      { error: "Failed to fetch form submission" },
      { status: 500 }
    );
  }
}
