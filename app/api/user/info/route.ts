import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSignedUrlFromPath } from "@/lib/s3";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log("session", session);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("session.user.id", session.user.id);
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      sinNumber: true,
      businessNumber: true,
      dateOfBirth: true,
      contactNumber: true,
      address: true,
      occupation: true,
      isAdmin: true,
      createdAt: true,
      profileUrl: true,
      updatedAt: true,
      provider: true,
    },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  let signedUrl = null;
  if (user.profileUrl) {
    signedUrl = await getSignedUrlFromPath(user.profileUrl);
  }
  return NextResponse.json({ ...user, profileImageUrl: signedUrl });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const {
    name,
    fullName,
    sinNumber,
    businessNumber,
    dateOfBirth,
    contactNumber,
    address,
    occupation,
    profileUrl,
  } = await req.json();

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      sinNumber,
      businessNumber,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      contactNumber,
      address,
      occupation,
      profileUrl,
    },
    select: {
      id: true,
      email: true,
      name: true,
      sinNumber: true,
      businessNumber: true,
      dateOfBirth: true,
      contactNumber: true,
      address: true,
      occupation: true,
      profileUrl: true,
      isAdmin: true,
      createdAt: true,
      updatedAt: true,
      provider: true,
    },
  });
  let signedUrl = null;
  if (user.profileUrl) {
    signedUrl = await getSignedUrlFromPath(user.profileUrl);
  }
  return NextResponse.json({ ...user, profileImageUrl: signedUrl });
}
