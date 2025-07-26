import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - List all forms
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const forms = await prisma.forms.findMany({
      include: {
        _count: {
          select: {
            inputs: true,
            selections: true,
            multipleChoice: true,
            ratings: true,
            matrices: true,
            netPromoterScores: true,
            separators: true,
            formResponses: true,
          },
        },
        assignedUsers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 }
    );
  }
}

// POST - Create new form
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      privacyLabel,
      isCompulsory,
      fields,
      assignedUserIds,
    } = body;

    if (!title || !fields || !Array.isArray(fields)) {
      return NextResponse.json(
        { error: "Title and fields are required" },
        { status: 400 }
      );
    }

    // Create form with all fields in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the form first
      const form = await tx.forms.create({
        data: {
          title,
          description,
          privacyLabel:
            privacyLabel ||
            "I consent to the processing of my personal data and agree to the privacy policy",
          isCompulsory: isCompulsory || false,
          sequence: [], // Will be updated after creating fields
          assignedUsers:
            assignedUserIds && assignedUserIds.length > 0
              ? {
                  connect: assignedUserIds.map((userId: string) => ({
                    id: userId,
                  })),
                }
              : undefined,
        },
      });

      const sequence: string[] = [];

      // Create fields based on type
      for (const field of fields) {
        if (field.type === "input") {
          const input = await tx.input.create({
            data: {
              label: field.label,
              required: field.required || false,
              type: field.inputType || "text",
              formId: form.id,
            },
          });
          sequence.push(input.id);
        } else if (field.type === "selection") {
          const selection = await tx.selection.create({
            data: {
              label: field.label,
              required: field.required || false,
              options: field.options || [],
              formId: form.id,
            },
          });
          sequence.push(selection.id);
        } else if (field.type === "multipleChoice") {
          const multipleChoice = await tx.multipleChoice.create({
            data: {
              label: field.label,
              required: field.required || false,
              maxChoices: field.maxChoices,
              options: field.options || [],
              formId: form.id,
            },
          });
          sequence.push(multipleChoice.id);
        } else if (field.type === "rating") {
          const rating = await tx.rating.create({
            data: {
              question: field.label,
              required: field.required || false,
              maxRating: field.maxRating || 5,
              showLabels: field.showLabels || false,
              labels: field.labels || [],
              formId: form.id,
            },
          });
          sequence.push(rating.id);
        } else if (field.type === "matrix") {
          const matrix = await tx.matrix.create({
            data: {
              title: field.label,
              required: field.required || false,
              rows: field.rows || [],
              columns: field.columns || [],
              formId: form.id,
            },
          });
          sequence.push(matrix.id);
        } else if (field.type === "netPromoterScore") {
          const netPromoterScore = await tx.netPromoterScore.create({
            data: {
              question: field.label,
              required: field.required || false,
              leftLabel: field.leftLabel || "Not at all likely",
              rightLabel: field.rightLabel || "Extremely likely",
              maxScore: field.maxScore || 10,
              formId: form.id,
            },
          });
          sequence.push(netPromoterScore.id);
        } else if (field.type === "separator") {
          const separator = await tx.separator.create({
            data: {
              title: field.label,
              description: field.description || null,
              formId: form.id,
            },
          });
          sequence.push(separator.id);
        }
      }

      // Update the form with the sequence
      const updatedForm = await tx.forms.update({
        where: { id: form.id },
        data: { sequence },
      });

      return updatedForm;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    return NextResponse.json(
      { error: "Failed to create form" },
      { status: 500 }
    );
  }
}

// DELETE - Delete form
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const formId = searchParams.get("id");

    if (!formId) {
      return NextResponse.json(
        { error: "Form ID is required" },
        { status: 400 }
      );
    }

    // Delete form and all related data in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete all form responses and answers first
      const formResponses = await tx.formResponse.findMany({
        where: { formId },
        select: { id: true },
      });

      for (const response of formResponses) {
        await tx.formAnswer.deleteMany({
          where: { formResponseId: response.id },
        });
      }

      await tx.formResponse.deleteMany({
        where: { formId },
      });

      // Delete form fields
      await tx.input.deleteMany({
        where: { formId },
      });

      await tx.selection.deleteMany({
        where: { formId },
      });

      await tx.multipleChoice.deleteMany({
        where: { formId },
      });

      await tx.rating.deleteMany({
        where: { formId },
      });

      await tx.matrix.deleteMany({
        where: { formId },
      });

      await tx.netPromoterScore.deleteMany({
        where: { formId },
      });

      await tx.separator.deleteMany({
        where: { formId },
      });

      // Finally delete the form
      await tx.forms.delete({
        where: { id: formId },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting form:", error);
    return NextResponse.json(
      { error: "Failed to delete form" },
      { status: 500 }
    );
  }
}
