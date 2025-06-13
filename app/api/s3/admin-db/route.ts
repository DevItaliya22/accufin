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
      receivedById,
    } = await request.json();
    console.log("filePath", filePath);
    console.log("url", url);
    console.log("name", name);
    console.log("size", size);
    console.log("type", type);
    console.log("uploadedById", uploadedById);
    console.log("isAdminOnlyPrivateFile", isAdminOnlyPrivateFile);
    const file = await prisma.file.create({
      data: {
        path: filePath,
        url: url,
        name: name,
        size: size,
        type: type,
        uploadedById: uploadedById,
        receivedById: receivedById,
        isAdminOnlyPrivateFile: isAdminOnlyPrivateFile,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    // Create notification for recipient
    await prisma.notification.create({
      data: {
        title: "New File Uploaded",
        message: `A new file '${name}' has been uploaded for you by ${session.user.name}`,
        userId: receivedById,
      },
    });
    // // Create notification for uploader
    // await prisma.notification.create({
    //   data: {
    //     title: "File Upload Successful",
    //     message: `Your file '${name}' has been uploaded and sent to the recipient.`,
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
