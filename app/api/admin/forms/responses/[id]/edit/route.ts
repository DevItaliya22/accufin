import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface EditAnswer {
  fieldId: string;
  fieldType: string;
  value: string;
}

interface EditSubmissionRequest {
  answers: EditAnswer[];
  isChecked: boolean;
}

// PUT - Update form submission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: EditSubmissionRequest = await request.json();
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
        { error: "Invalid privacy consent value" },
        { status: 400 }
      );
    }
    const paramsID = (await params).id;
    // Get the existing form response to verify it exists and get user info
    const existingResponse = await prisma.formResponse.findUnique({
      where: { id: paramsID },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        form: {
          select: {
            title: true,
            inputs: {
              select: {
                id: true,
              },
            },
            selections: {
              select: {
                id: true,
              },
            },
            multipleChoice: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!existingResponse) {
      return NextResponse.json(
        { error: "Form submission not found" },
        { status: 404 }
      );
    }

    // Validate field IDs exist in form
    const validFieldIds = new Set([
      ...existingResponse.form.inputs.map((f) => f.id),
      ...existingResponse.form.selections.map((f) => f.id),
      ...existingResponse.form.multipleChoice.map((f) => f.id),
    ]);

    for (const answer of answers) {
      if (!validFieldIds.has(answer.fieldId)) {
        return NextResponse.json(
          { error: `Invalid field ID: ${answer.fieldId}` },
          { status: 400 }
        );
      }
    }

    // Update form response and answers in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update privacy consent
      const updatedFormResponse = await tx.formResponse.update({
        where: { id: paramsID },
        data: {
          isChecked,
          updatedAt: new Date(),
        },
      });

      // Delete existing answers
      await tx.formAnswer.deleteMany({
        where: {
          formResponseId: paramsID,
        },
      });

      // Create new answers
      const newAnswers = await Promise.all(
        answers.map((answer) =>
          tx.formAnswer.create({
            data: {
              formResponseId: paramsID,
              fieldId: answer.fieldId,
              fieldType: answer.fieldType,
              value: answer.value,
            },
          })
        )
      );

      return { formResponse: updatedFormResponse, answers: newAnswers };
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        title: `Admin updated your form submission for "${existingResponse.form.title}"`,
        message: `An administrator has made changes to your form submission for "${existingResponse.form.title}". Please review the updated information.`,
        user: {
          connect: {
            id: existingResponse.user.id,
          },
        },
        isRead: false,
      },
    });

    return NextResponse.json(
      {
        message: "Form submission updated successfully",
        responseId: result.formResponse.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating form submission:", error);
    return NextResponse.json(
      { error: "Failed to update form submission" },
      { status: 500 }
    );
  }
}
