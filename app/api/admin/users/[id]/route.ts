import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();
    const { name, contactNumber, occupation, sinNumber, businessNumber, dateOfBirth, address } = body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? undefined,
        contactNumber: contactNumber ?? undefined,
        occupation: occupation ?? undefined,
        sinNumber: sinNumber ?? undefined,
        businessNumber: businessNumber ?? undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        address: address ?? undefined,
      },
      select: {
        id: true,
        name: true,
        contactNumber: true,
        occupation: true,
        sinNumber: true,
        businessNumber: true,
        dateOfBirth: true,
        address: true,
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


