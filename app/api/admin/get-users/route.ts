import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getSignedUrlFromPath } from "@/lib/s3";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const users = await prisma.user.findMany({
      where: {},
      select: {
        id: true,
        name: true,
        sinNumber: true,
        businessNumber: true,
        dateOfBirth: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        occupation: true,
        contactNumber: true,
        profileUrl: true,
        isAdmin: true,
        _count: {
          select: {
            uploadedFiles: true,
            formResponses: true,
          },
        },
      },
    });

    // Get files received from admin for each user
    const usersWithFileCounts = await Promise.all(
      users.map(async (user) => {
        const filesReceivedFromAdmin = await prisma.file.count({
          where: {
            receivedById: user.id,
            uploadedBy: {
              isAdmin: true,
            },
          },
        });

        const filesUploadedToAdmin = await prisma.file.count({
          where: {
            uploadedById: user.id,
            receivedBy: {
              isAdmin: true,
            },
          },
        });

        return {
          ...user,
          filesReceivedFromAdmin,
          filesUploadedToAdmin,
        };
      })
    );

    const signedUrlUsers = await Promise.all(
      usersWithFileCounts.map(async (user) => {
        if (user.profileUrl) {
          const signedUrl = await getSignedUrlFromPath(user.profileUrl);
          return { ...user, profileUrl: signedUrl };
        }
        return user;
      })
    );

    const usersWithAllCounts = signedUrlUsers.map((user) => {
      return {
        ...user,
        uploadedFiles: user.filesUploadedToAdmin,
        formResponses: user._count.formResponses,
        filesReceivedFromAdmin: user.filesReceivedFromAdmin,
      };
    });
    return NextResponse.json(usersWithAllCounts);
  } catch (e) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
