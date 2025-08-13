import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSignedUrlFromPath } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, text, imagePath, isActive } = body ?? {};

    if (!name || !role || !text) {
      return NextResponse.json(
        { error: "name, role and text are required" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        text,
        imagePath: imagePath || null,
        isActive: typeof isActive === "boolean" ? isActive : true,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Failed to create testimonial", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        role: true,
        text: true,
        imagePath: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const withSignedUrls = await Promise.all(
      testimonials.map(async (t) => ({
        ...t,
        imageUrl: t.imagePath ? await getSignedUrlFromPath(t.imagePath) : null,
      }))
    );

    return NextResponse.json(withSignedUrls);
  } catch (error) {
    console.error("Failed to fetch testimonials", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
