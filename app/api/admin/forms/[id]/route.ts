import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET - Get individual form details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const form = await prisma.forms.findUnique({
      where: { id },
      include: {
        inputs: true,
        selections: true,
        multipleChoice: true,
        ratings: true,
        matrices: true,
        netPromoterScores: true,
        separators: true,
        assignedUsers: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            formResponses: true,
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Failed to fetch form" },
      { status: 500 }
    );
  }
}

// PUT - Update form
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const { title, description, privacyLabel, fields, assignedUserIds } = body;

    if (!title || !fields || !Array.isArray(fields)) {
      return NextResponse.json(
        { error: "Title and fields are required" },
        { status: 400 }
      );
    }

    // Update form with all fields in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing fields
      await tx.input.deleteMany({
        where: { formId: id },
      });

      await tx.selection.deleteMany({
        where: { formId: id },
      });

      await tx.multipleChoice.deleteMany({
        where: { formId: id },
      });

      await tx.rating.deleteMany({
        where: { formId: id },
      });

      await tx.matrix.deleteMany({
        where: { formId: id },
      });

      await tx.netPromoterScore.deleteMany({
        where: { formId: id },
      });

      await tx.separator.deleteMany({
        where: { formId: id },
      });

      const sequence: string[] = [];

      // Create new fields based on type
      for (const field of fields) {
        if (field.type === "input") {
          const input = await tx.input.create({
            data: {
              label: field.label,
              required: field.required || false,
              type: field.inputType || "text",
              formId: id,
            },
          });
          sequence.push(input.id);
        } else if (field.type === "selection") {
          const selection = await tx.selection.create({
            data: {
              label: field.label,
              required: field.required || false,
              options: field.options || [],
              formId: id,
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
              formId: id,
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
              formId: id,
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
              formId: id,
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
              formId: id,
            },
          });
          sequence.push(netPromoterScore.id);
        } else if (field.type === "separator") {
          const separator = await tx.separator.create({
            data: {
              title: field.label,
              description: field.description || null,
              formId: id,
            },
          });
          sequence.push(separator.id);
        }
      }

      // Update the form with new data and sequence
      const updatedForm = await tx.forms.update({
        where: { id },
        data: {
          title,
          description,
          privacyLabel:
            privacyLabel ||
            "I consent to the processing of my personal data and agree to the privacy policy",
          sequence,
          assignedUsers:
            assignedUserIds && assignedUserIds.length > 0
              ? {
                  set: assignedUserIds.map((userId: string) => ({
                    id: userId,
                  })),
                }
              : {
                  set: [],
                },
        },
      });

      return updatedForm;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating form:", error);
    return NextResponse.json(
      { error: "Failed to update form" },
      { status: 500 }
    );
  }
}
