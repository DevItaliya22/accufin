import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try{
        const session = await getServerSession(authOptions)
        if(!session?.user?.isAdmin){
            return NextResponse.json({ error: "Unauthorized" ,ok: false}, { status: 401 });
        }
        await prisma.notification.updateMany({
            where: { userId: session.user.id },
            data: { isRead: true },
        });
        return NextResponse.json({ message: "Notifications marked as read" ,ok: true}, { status: 200 });
    }catch  (e){
        return NextResponse.json({ error: "Internal server error" ,ok: false}, { status: 500 });
    }
}   