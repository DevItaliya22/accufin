import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface FormAnswer {
  fieldId: string;
  fieldType: string;
  value: string;
}

interface SubmitFormRequest {
  answers: FormAnswer[];
  isChecked: boolean;
}

// POST - Submit form response
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Verify form exists and is active
    const form = await prisma.forms.findUnique({
      where: { id: params.id },
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

    // Validate field IDs exist in form
    const validFieldIds = new Set(allFields.map((f) => f.id));
    for (const answer of answers) {
      if (!validFieldIds.has(answer.fieldId)) {
        return NextResponse.json(
          { error: `Invalid field ID: ${answer.fieldId}` },
          { status: 400 }
        );
      }
    }

    // Create form response and answers in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create form response
      const formResponse = await tx.formResponse.create({
        data: {
          userId: session.user.id,
          formId: params.id,
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
