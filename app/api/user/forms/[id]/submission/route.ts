import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Get user's form submission
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const paramsID = (await params).id;
    // Get user's form submission with answers
    const formResponse = await prisma.formResponse.findFirst({
      where: {
        formId: paramsID,
        userId: session.user.id,
      },
      select: {
        id: true,
        isChecked: true,
        createdAt: true,
        form: {
          select: {
            title: true,
            description: true,
            isCompulsory: true,
            sequence: true,
            inputs: {
              select: {
                id: true,
                label: true,
              },
            },
            selections: {
              select: {
                id: true,
                label: true,
              },
            },
            multipleChoice: {
              select: {
                id: true,
                label: true,
              },
            },
            ratings: {
              select: {
                id: true,
                question: true,
                maxRating: true,
              },
            },
            matrices: {
              select: {
                id: true,
                title: true,
              },
            },
            netPromoterScores: {
              select: {
                id: true,
                question: true,
                maxScore: true,
              },
            },
            separators: {
              select: {
                id: true,
                title: true,
              },
            },
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
            createdAt: true,
          },
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

    // Add labels to answers
    const answersWithLabels = formResponse.answers.map((answer) => ({
      ...answer,
      fieldLabel: fieldLabels[answer.fieldId] || "Unknown Field",
    }));

    const submission = {
      id: formResponse.id,
      formTitle: formResponse.form.title,
      formDescription: formResponse.form.description,
      isCompulsory: formResponse.form.isCompulsory,
      isChecked: formResponse.isChecked,
      submittedAt: formResponse.createdAt.toISOString(),
      answers: answersWithLabels,
    };

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Error fetching form submission:", error);
    return NextResponse.json(
      { error: "Failed to fetch form submission" },
      { status: 500 }
    );
  }
}
