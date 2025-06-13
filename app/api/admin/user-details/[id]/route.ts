import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSignedUrlFromPath } from "@/lib/s3";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const userUploadedFiles = await prisma.file.findMany({
      where : {
        uploadedById : id,
      }
    })
    const userReceivedFiles = await prisma.file.findMany({
      where : {
        receivedById : id,
        isAdminOnlyPrivateFile : false,
      }
    })
    const userPrivateFiles = await prisma.file.findMany({
      where : {
        receivedById : id,
        isAdminOnlyPrivateFile : true,
      }
    })

    const signedUserUploadedFiles = await Promise.all(userUploadedFiles.map(async (file) => {
      const signedUrl = await getSignedUrlFromPath(file.path);
      return {
        ...file,
        url: signedUrl,
      };
    }))
    const signedUserReceivedFiles = await Promise.all(userReceivedFiles.map(async (file) => {
      const signedUrl = await getSignedUrlFromPath(file.path);
      return {
        ...file,
        url: signedUrl,
      };
    }))

    const signedUserPrivateFiles = await Promise.all(userPrivateFiles.map(async (file) => {
      const signedUrl = await getSignedUrlFromPath(file.path);
      return {
        ...file,
        url: signedUrl,
      };
    }))
    
    return NextResponse.json({
      userUploadedFiles : signedUserUploadedFiles,
      userReceivedFiles : signedUserReceivedFiles,
      userPrivateFiles : signedUserPrivateFiles,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
