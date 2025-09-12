import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (file.uploadedById !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (file.type === "folder") {
      const oldFolderPath = file.folderName
        ? `${file.folderName}/${file.name}`
        : (file.name ?? "");
      await prisma.$transaction(async (tx) => {
        // Delete descendants first
        await tx.file.deleteMany({
          where: {
            folderName: {
              startsWith: oldFolderPath,
            },
            uploadedById: session.user.id,
          },
        });
        // Delete the folder entry itself
        await tx.file.delete({ where: { id } });

        // Notify admins about folder delete
        const admins = await tx.user.findMany({
          where: { isAdmin: true },
          select: { id: true },
        });
        if (admins.length > 0) {
          await tx.notification.createMany({
            data: admins.map((a) => ({
              title: `Folder deleted by ${session.user.name || "User"}`,
              message: `Deleted folder "${oldFolderPath}" and its contents`,
              userId: a.id,
            })),
          });
        }
      });
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    await prisma.file.delete({ where: { id } });
    // Notify admins about file delete
    const admins = await prisma.user.findMany({
      where: { isAdmin: true },
      select: { id: true },
    });
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((a) => ({
          title: `File deleted by ${session.user.name || "User"}`,
          message: `Deleted file "${file.name || "(unnamed)"}"`,
          userId: a.id,
        })),
      });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    console.error("Error deleting file/folder:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
