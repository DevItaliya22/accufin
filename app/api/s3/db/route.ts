import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const {
      filePath,
      url,
      name,
      size,
      type,
      uploadedById,
      isAdminOnlyPrivateFile,
      folderName,
    } = await request.json();
    console.log("filePath", filePath);
    console.log("url", url);
    console.log("name", name);
    console.log("size", size);
    console.log("type", type);
    console.log("uploadedById", uploadedById);
    console.log("isAdminOnlyPrivateFile", isAdminOnlyPrivateFile);
    console.log("folderName", folderName);
    const adminID = await prisma.user.findFirst({
      where: {
        isAdmin: true,
      },
    });
    if (!adminID) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }
    const file = await prisma.file.create({
      data: {
        path: filePath,
        url: url,
        name: name,
        size: size,
        type: type,
        uploadedById: uploadedById,
        receivedById: adminID.id,
        isAdminOnlyPrivateFile: isAdminOnlyPrivateFile,
        folderName: folderName,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    // Create notification for admin (recipient)
    await prisma.notification.create({
      data: {
        title: "New File Uploaded",
        message: `A new file '${name}' has been uploaded for you by ${session.user.name}`,
        userId: adminID.id,
      },
    });
    // // Create notification for uploader
    // await prisma.notification.create({
    //   data: {
    //     title: "File Upload Successful",
    //     message: `Your file '${name}' has been uploaded and sent to admin.`,
    //     userId: uploadedById,
    //   },
    // });
    return NextResponse.json(file, { status: 200 });
  } catch (e) {
    console.log("error in s3 db", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
