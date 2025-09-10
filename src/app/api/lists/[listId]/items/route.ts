import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await db.listItem.findMany({
      where: { listId: params.listId },
      include: {
        perfume: {
          include: {
            brand: true,
            notes: {
              include: {
                note: true
              }
            }
          }
        }
      },
      orderBy: { rank: 'asc' }
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching list items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch list items' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { perfumeId } = await request.json();

    // Get the current max rank in the list
    const maxRank = await db.listItem.findFirst({
      where: { listId: params.listId },
      orderBy: { rank: 'desc' },
      select: { rank: true }
    });

    const newRank = (maxRank?.rank || 0) + 1;

    const item = await db.listItem.create({
      data: {
        listId: params.listId,
        perfumeId,
        rank: newRank
      },
      include: {
        perfume: {
          include: {
            brand: true,
            notes: {
              include: {
                note: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error('Error adding item to list:', error);
    return NextResponse.json(
      { error: 'Failed to add item to list' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { order } = await request.json();

    // Update ranks in a transaction
    await db.$transaction(
      order.map((itemId: string, index: number) =>
        db.listItem.update({
          where: { id: itemId },
          data: { rank: index + 1 }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering list items:', error);
    return NextResponse.json(
      { error: 'Failed to reorder list items' },
      { status: 500 }
    );
  }
}
