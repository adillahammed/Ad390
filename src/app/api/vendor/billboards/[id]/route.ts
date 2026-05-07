import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Ensure vendor owns the billboard
    const existing = await prisma.billboard.findUnique({
      where: { id, vendorId: session.id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Billboard not found' }, { status: 404 });
    }

    const billboard = await prisma.billboard.update({
      where: { id },
      data: {
        ...body,
        // Reset status to PENDING if critical fields changed (optional logic)
        status: body.status || existing.status 
      }
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('Error updating billboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.role !== 'VENDOR') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Ensure vendor owns the billboard
    const existing = await prisma.billboard.findUnique({
      where: { id, vendorId: session.id }
    });

    if (!existing) {
      return NextResponse.json({ error: 'Billboard not found' }, { status: 404 });
    }

    await prisma.billboard.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting billboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
