import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface FormAnswer {
  fieldId: string;
  fieldType: string;
  value: string;
  rowId?: string;
  columnId?: string;
}

interface SubmitFormRequest {
  answers: FormAnswer[];
  isChecked: boolean;
}

// POST - Submit form response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: SubmitFormRequest = await request.json();
    const { answers, isChecked } = body;

    // Validate request
    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid answers format" },
        { status: 400 }
      );
    }

    if (typeof isChecked !== "boolean") {
      return NextResponse.json(
        { error: "Privacy consent is required" },
        { status: 400 }
      );
    }

    // Check if user already submitted this form
    const existingResponse = await prisma.formResponse.findFirst({
      where: {
        formId: id,
        userId: session.user.id,
      },
    });

    if (existingResponse) {
      return NextResponse.json(
        { error: "You have already submitted this form" },
        { status: 400 }
      );
    }

    // Verify form exists and is active
    const form = await prisma.forms.findUnique({
      where: { id },
      include: {
        inputs: {
          select: {
            id: true,
            required: true,
          },
        },
        selections: {
          select: {
            id: true,
            required: true,
          },
        },
        multipleChoice: {
          select: {
            id: true,
            required: true,
          },
        },
        ratings: {
          select: {
            id: true,
            required: true,
            maxRating: true,
          },
        },
        matrices: {
          select: {
            id: true,
            required: true,
          },
        },
        netPromoterScores: {
          select: {
            id: true,
            required: true,
            maxScore: true,
          },
        },
        separators: {
          select: {
            id: true,
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

    // Validate required fields
    const allFields = [
      ...form.inputs.map((f) => ({ id: f.id, required: f.required })),
      ...form.selections.map((f) => ({ id: f.id, required: f.required })),
      ...form.multipleChoice.map((f) => ({ id: f.id, required: f.required })),
      ...form.ratings.map((f) => ({ id: f.id, required: f.required })),
      ...form.matrices.map((f) => ({ id: f.id, required: f.required })),
      ...form.netPromoterScores.map((f) => ({
        id: f.id,
        required: f.required,
      })),
      // Separators are never required
      ...form.separators.map((f) => ({ id: f.id, required: false })),
    ];

    const answeredFieldIds = new Set(answers.map((a) => a.fieldId));

    for (const field of allFields) {
      if (field.required && !answeredFieldIds.has(field.id)) {
        return NextResponse.json(
          { error: `Required field ${field.id} is missing` },
          { status: 400 }
        );
      }
    }

    // Validate field IDs exist in form and validate specific field types
    const validFieldIds = new Set(allFields.map((f) => f.id));
    for (const answer of answers) {
      if (!validFieldIds.has(answer.fieldId)) {
        return NextResponse.json(
          { error: `Invalid field ID: ${answer.fieldId}` },
          { status: 400 }
        );
      }

      // Validate Net Promoter Score values
      if (answer.fieldType === "netPromoterScore") {
        const netPromoterField = form.netPromoterScores.find(
          (f) => f.id === answer.fieldId
        );
        if (netPromoterField) {
          const score = parseInt(answer.value);
          const maxScore = netPromoterField.maxScore || 10;
          if (isNaN(score) || score < 0 || score > maxScore) {
            return NextResponse.json(
              {
                error: `Invalid Net Promoter Score. Must be between 0 and ${maxScore}`,
              },
              { status: 400 }
            );
          }
        }
      }

      // Validate Rating values
      if (answer.fieldType === "rating") {
        const ratingField = form.ratings.find((f) => f.id === answer.fieldId);
        if (ratingField) {
          const rating = parseInt(answer.value);
          const maxRating = ratingField.maxRating || 5;
          if (isNaN(rating) || rating < 1 || rating > maxRating) {
            return NextResponse.json(
              { error: `Invalid Rating. Must be between 1 and ${maxRating}` },
              { status: 400 }
            );
          }
        }
      }
    }

    // Create form response and answers in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create form response
      const formResponse = await tx.formResponse.create({
        data: {
          userId: session.user.id,
          formId: id,
          isChecked,
        },
      });

      // Create form answers
      const formAnswers = await Promise.all(
        answers.map((answer) =>
          tx.formAnswer.create({
            data: {
              formResponseId: formResponse.id,
              fieldId: answer.fieldId,
              fieldType: answer.fieldType,
              value: answer.value,
              rowId: answer.rowId,
              columnId: answer.columnId,
            },
          })
        )
      );

      return { formResponse, formAnswers };
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        title: `New form response submitted by ${session.user.name} for "${form.title}"`,
        message: `New form response submitted by ${session.user.name} for "${form.title}"`,
        user: {
          connect: {
            id: session.user.id,
          },
        },
        isRead: false,
      },
    });

    return NextResponse.json(
      {
        message: "Form submitted successfully",
        responseId: result.formResponse.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting form response:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
