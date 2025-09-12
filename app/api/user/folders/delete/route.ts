import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST: Delete a logical folder (path-based) and its descendants, even if no explicit folder record exists
// Body: { parentPath: string, folderName: string }
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { parentPath, folderName } = body as {
      parentPath?: string;
      folderName?: string;
    };

    if (!folderName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (folderName.includes("/")) {
      return NextResponse.json({ error: "Invalid folder name" }, { status: 400 });
    }

    const full = parentPath ? `${parentPath}/${folderName}` : folderName;

    await prisma.$transaction(async (tx) => {
      await tx.file.deleteMany({
        where: {
          uploadedById: session.user.id,
          folderName: { startsWith: full },
        },
      });
      // delete a potential folder record itself
      await tx.file.deleteMany({
        where: {
          uploadedById: session.user.id,
          type: "folder",
          name: folderName,
          folderName: parentPath || "",
        },
      });
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("User folder delete error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
