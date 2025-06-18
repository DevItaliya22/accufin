import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

// GET - Fetch all open contacts
export async function GET() {
  try {
    const openContacts = await prisma.openContact.findMany({
      include: {
        links: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json(openContacts);
  } catch (error) {
    console.error("Error fetching open contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch open contacts" },
      { status: 500 }
    );
  }
}

// POST - Create new open contact
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { address, phone1, phone2, email, links } = await request.json();

    const openContact = await prisma.openContact.create({
      data: {
        address,
        phone1,
        phone2,
        email,
        links: {
          create:
            links?.map((link: { name: string; url: string }) => ({
              name: link.name,
              url: link.url,
            })) || [],
        },
      },
      include: {
        links: true,
      },
    });

    return NextResponse.json(openContact);
  } catch (error) {
    console.error("Error creating open contact:", error);
    return NextResponse.json(
      { error: "Failed to create open contact" },
      { status: 500 }
    );
  }
}

// PUT - Update open contact
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { id, address, phone1, phone2, email, links } = await request.json();

    // Delete existing links and create new ones
    await prisma.link.deleteMany({
      where: { openContactId: id },
    });

    const openContact = await prisma.openContact.update({
      where: { id },
      data: {
        address,
        phone1,
        phone2,
        email,
        links: {
          create:
            links?.map((link: { name: string; url: string }) => ({
              name: link.name,
              url: link.url,
            })) || [],
        },
      },
      include: {
        links: true,
      },
    });

    return NextResponse.json(openContact);
  } catch (error) {
    console.error("Error updating open contact:", error);
    return NextResponse.json(
      { error: "Failed to update open contact" },
      { status: 500 }
    );
  }
}

// DELETE - Delete open contact
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Contact ID required" },
        { status: 400 }
      );
    }

    await prisma.openContact.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting open contact:", error);
    return NextResponse.json(
      { error: "Failed to delete open contact" },
      { status: 500 }
    );
  }
}
