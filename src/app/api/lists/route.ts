import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lists = await db.list.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
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
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ lists });
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lists' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, type } = await request.json();

    const list = await db.list.create({
      data: {
        name,
        type,
        userId: session.user.id
      }
    });

    return NextResponse.json({ list });
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json(
      { error: 'Failed to create list' },
      { status: 500 }
    );
  }
}
