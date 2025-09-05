import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const exportDir = path.join(process.cwd(), "form-exports");

    // Check if export directory exists
    if (!fs.existsSync(exportDir)) {
      return NextResponse.json(
        {
          error: "No form-exports directory found. Please export forms first.",
        },
        { status: 404 }
      );
    }

    // Read all JSON files from the export directory
    const files = fs
      .readdirSync(exportDir)
      .filter((file) => file.endsWith(".json"));

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No JSON files found in form-exports directory" },
        { status: 404 }
      );
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        const filePath = path.join(exportDir, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const formData = JSON.parse(fileContent);

        // Validate required fields
        if (!formData.id || !formData.title) {
          errors.push(`Invalid form data in ${file}: Missing ID or title`);
          continue;
        }

        // Check if form already exists
        const existingForm = await prisma.forms.findUnique({
          where: { id: formData.id },
        });

        if (existingForm) {
          errors.push(
            `Form already exists: ${formData.title} (${formData.id})`
          );
          continue;
        }

        // Create the form with all related data
        const createdForm = await prisma.forms.create({
          data: {
            id: formData.id,
            title: formData.title,
            description: formData.description,
            isActive: formData.isActive || false,
            privacyLabel:
              formData.privacyLabel ||
              "I consent to the processing of my personal data and agree to the privacy policy",
            isCompulsory: formData.isCompulsory || false,
            sequence: formData.sequence || [],
            inputs: {
              create:
                formData.inputs?.map((input: any) => ({
                  id: input.id,
                  label: input.label,
                  required: input.required,
                  type: input.type,
                })) || [],
            },
            selections: {
              create:
                formData.selections?.map((selection: any) => ({
                  id: selection.id,
                  label: selection.label,
                  required: selection.required,
                  options: selection.options,
                })) || [],
            },
            multipleChoice: {
              create:
                formData.multipleChoice?.map((choice: any) => ({
                  id: choice.id,
                  label: choice.label,
                  required: choice.required,
                  maxChoices: choice.maxChoices,
                  options: choice.options,
                })) || [],
            },
            ratings: {
              create:
                formData.ratings?.map((rating: any) => ({
                  id: rating.id,
                  question: rating.question,
                  required: rating.required,
                  maxRating: rating.maxRating,
                  showLabels: rating.showLabels,
                  labels: rating.labels,
                })) || [],
            },
            matrices: {
              create:
                formData.matrices?.map((matrix: any) => ({
                  id: matrix.id,
                  title: matrix.title,
                  description: matrix.description,
                  required: matrix.required,
                  rows: matrix.rows,
                  columns: matrix.columns,
                })) || [],
            },
            netPromoterScores: {
              create:
                formData.netPromoterScores?.map((nps: any) => ({
                  id: nps.id,
                  question: nps.question,
                  leftLabel: nps.leftLabel,
                  rightLabel: nps.rightLabel,
                  required: nps.required,
                  maxScore: nps.maxScore,
                })) || [],
            },
            separators: {
              create:
                formData.separators?.map((separator: any) => ({
                  id: separator.id,
                  title: separator.title,
                  description: separator.description,
                })) || [],
            },
          },
        });

        results.push({
          formId: formData.id,
          fileName: file,
          status: "seeded",
          title: formData.title,
        });

        console.log(`✅ Seeded form: ${formData.title} (${formData.id})`);
      } catch (error) {
        console.error(`❌ Error seeding form from ${file}:`, error);
        errors.push(
          `Error seeding ${file}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    return NextResponse.json({
      message: "Form seeding completed",
      seeded: results.length,
      total: files.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error in form seeding process:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
