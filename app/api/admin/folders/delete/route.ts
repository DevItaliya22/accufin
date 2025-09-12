import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST: Delete a logical folder (path-based) and its descendants, even if no explicit folder record exists
// Body: { selectedUserId: string, parentPath: string, folderName: string, isPrivate?: boolean }
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { selectedUserId, parentPath, folderName, isPrivate } = body as {
      selectedUserId?: string;
      parentPath?: string;
      folderName?: string;
      isPrivate?: boolean;
    };

    if (!selectedUserId || !folderName) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (folderName.includes("/")) {
      return NextResponse.json({ error: "Invalid folder name" }, { status: 400 });
    }

    const full = parentPath ? `${parentPath}/${folderName}` : folderName;
    const scopeFilter: any = {
      receivedById: selectedUserId,
    };
    if (typeof isPrivate === "boolean") {
      scopeFilter.isAdminOnlyPrivateFile = isPrivate;
    }

    await prisma.$transaction(async (tx) => {
      await tx.file.deleteMany({
        where: {
          ...scopeFilter,
          folderName: { startsWith: full },
        },
      });
      // delete a potential folder record itself
      await tx.file.deleteMany({
        where: {
          ...scopeFilter,
          type: "folder",
          name: folderName,
          folderName: parentPath || "",
        },
      });
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("Admin folder delete error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


