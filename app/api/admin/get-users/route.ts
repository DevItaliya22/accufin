import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try{
        const session = await getServerSession(authOptions)
        if(!session?.user){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if(!session.user.isAdmin){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const users = await prisma.user.findMany({
            where : {
                isAdmin : false,
            },
            select : {
                id : true,
                name : true,
                email : true,
                createdAt : true,
                updatedAt : true,
                _count : {
                    select : {
                        uploadedFiles : true,
                    }
                }
            }
        });
        console.log("users",users)
        const usersWithUploadedFiles = users.map((user) => {
            return {
                ...user,
                uploadedFiles : user._count.uploadedFiles,
            }
        })
        console.log("usersWithUploadedFiles",usersWithUploadedFiles)
        return NextResponse.json(usersWithUploadedFiles);
    }catch(e){
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}