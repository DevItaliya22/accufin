import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSignedUrlFromPath } from "@/lib/s3";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const files = await prisma.file.findMany({
      where: {
        uploadedById: session.user.id,
        isArchived: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const signedFiles = await Promise.all(
      files.map(async (file) => {
        if (file.type !== "folder" && file.path) {
          const signedUrl = await getSignedUrlFromPath(file.path);
          return {
            ...file,
            url: signedUrl,
          };
        }
        return file;
      })
    );

    return NextResponse.json(signedFiles, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
