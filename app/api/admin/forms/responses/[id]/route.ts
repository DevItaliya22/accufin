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
            ratings: true,
            matrices: true,
            netPromoterScores: true,
            separators: true,
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
    formResponse.form.ratings.forEach((field) => {
      fieldLabels[field.id] = field.question || "";
    });
    formResponse.form.matrices.forEach((field) => {
      fieldLabels[field.id] = field.title || "";
    });
    formResponse.form.netPromoterScores.forEach((field) => {
      fieldLabels[field.id] = field.question || "";
    });
    formResponse.form.separators.forEach((field) => {
      fieldLabels[field.id] = field.title || "";
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
      const rating = formResponse.form.ratings.find((r) => r.id === fieldId);
      const matrix = formResponse.form.matrices.find((m) => m.id === fieldId);
      const netPromoterScore = formResponse.form.netPromoterScores.find(
        (n) => n.id === fieldId
      );
      const separator = formResponse.form.separators.find(
        (s) => s.id === fieldId
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
      } else if (rating) {
        fields.push({
          id: rating.id,
          type: "rating" as const,
          label: rating.question || "",
          required: rating.required,
          maxRating: rating.maxRating,
          showLabels: rating.showLabels,
          labels: rating.labels,
        });
      } else if (matrix) {
        fields.push({
          id: matrix.id,
          type: "matrix" as const,
          label: matrix.title || "",
          required: matrix.required,
          rows: matrix.rows,
          columns: matrix.columns,
        });
      } else if (netPromoterScore) {
        fields.push({
          id: netPromoterScore.id,
          type: "netPromoterScore" as const,
          label: netPromoterScore.question || "",
          required: netPromoterScore.required,
          leftLabel: netPromoterScore.leftLabel,
          rightLabel: netPromoterScore.rightLabel,
          maxScore: netPromoterScore.maxScore,
        });
      } else if (separator) {
        fields.push({
          id: separator.id,
          type: "separator" as const,
          label: separator.title || "",
          required: false,
          description: separator.description,
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
