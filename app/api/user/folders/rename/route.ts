import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST: Rename a logical folder (path-based), even if no explicit folder record exists
// Body: { parentPath: string, folderName: string, newName: string }
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { parentPath, folderName, newName } = body as {
      parentPath?: string;
      folderName?: string;
      newName?: string;
    };

    if (!folderName || !newName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (newName.includes("/") || folderName.includes("/")) {
      return NextResponse.json({ error: "Invalid folder names" }, { status: 400 });
    }

    const oldFull = parentPath ? `${parentPath}/${folderName}` : folderName;
    const newFull = parentPath ? `${parentPath}/${newName}` : newName;

    const updated = await prisma.$transaction(async (tx) => {
      // Update descendants whose folderName starts with oldFull
      const descendants = await tx.file.findMany({
        where: {
          uploadedById: session.user.id,
          folderName: { startsWith: oldFull },
        },
        select: { id: true, folderName: true },
      });
      for (const d of descendants) {
        const suffix = d.folderName!.slice(oldFull.length);
        await tx.file.update({
          where: { id: d.id },
          data: { folderName: `${newFull}${suffix}` },
        });
      }

      // If a folder record exists at old path, rename its name
      const folderRecord = await tx.file.findFirst({
        where: {
          uploadedById: session.user.id,
          type: "folder",
          name: folderName,
          folderName: parentPath || "",
        },
      });
      if (folderRecord) {
        await tx.file.update({ where: { id: folderRecord.id }, data: { name: newName } });
      }

      return { count: descendants.length, folderRecordUpdated: Boolean(folderRecord) };
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (e) {
    console.error("User folder rename error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
