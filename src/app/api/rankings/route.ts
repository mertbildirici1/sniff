import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userHandle = searchParams.get('userHandle');
    const perfumeId = searchParams.get('perfumeId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let whereClause: any = {};

    if (userHandle) {
      const user = await db.user.findUnique({
        where: { handle: userHandle },
        select: { id: true },
      });

      if (user) {
        whereClause.OR = [
          { userId: user.id },
          { userId: userHandle }, // fallback for data that stored handle in userId
        ];
      } else {
        // fallback to handle stored in userId if user not found
        whereClause.userId = userHandle;
      }
    } else if (userId) {
      whereClause.userId = userId;
    }

    if (perfumeId) {
      whereClause.perfumeId = perfumeId;
    }

    const [rawRankings, total] = await Promise.all([
      db.ranking.findMany({
        where: whereClause,
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
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.ranking.count({ where: whereClause })
    ]);

    // Manually resolve user - userId might be a handle or actual id
    const rankings = await Promise.all(
      rawRankings.map(async (ranking) => {
        // Try to find user by id first, then by handle
        let user = await db.user.findUnique({ where: { id: ranking.userId } });
        if (!user) {
          user = await db.user.findUnique({ where: { handle: ranking.userId } });
        }
        return { ...ranking, user };
      })
    );

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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      perfumeId,
      enjoyment,
      performance,
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
        performance,
        reviewText,
        photoUrl
      },
      create: {
        userId: session.user.id,
        perfumeId,
        enjoyment,
        performance,
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
