import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const perfumeId = searchParams.get('perfumeId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let whereClause: any = {};

    if (userId) {
      whereClause.userId = userId;
    }

    if (perfumeId) {
      whereClause.perfumeId = perfumeId;
    }

    const [rankings, total] = await Promise.all([
      db.ranking.findMany({
        where: whereClause,
        include: {
          user: true,
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
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.ranking.count({ where: whereClause })
    ]);

    return NextResponse.json({
      rankings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
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

    const {
      perfumeId,
      enjoyment,
      versatility,
      performance,
      value,
      reviewText,
      photoUrl
    } = await request.json();

    const ranking = await db.ranking.upsert({
      where: {
        userId_perfumeId: {
          userId: session.user.id,
          perfumeId
        }
      },
      update: {
        enjoyment,
        versatility,
        performance,
        value,
        reviewText,
        photoUrl
      },
      create: {
        userId: session.user.id,
        perfumeId,
        enjoyment,
        versatility,
        performance,
        value,
        reviewText,
        photoUrl
      },
      include: {
        user: true,
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

    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('Error creating/updating ranking:', error);
    return NextResponse.json(
      { error: 'Failed to create/update ranking' },
      { status: 500 }
    );
  }
}
