import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try { 
        const user = await getServerSession(authOptions);
        if(!user?.user.isAdmin){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { title, content, tags } = await request.json();
        const blog = await prisma.blogs.create({
            data: { title, content, tags , isActive: true},
        });
        return NextResponse.json(blog);
    }catch(e){
        console.error(e);
        return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }
}