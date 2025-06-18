import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await prisma.blogs.findUnique({
    where: { id: id as string },
  });
  return NextResponse.json(blog);
}