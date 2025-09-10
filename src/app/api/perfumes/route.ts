import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const brand = searchParams.get('brand');
    const note = searchParams.get('note');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (brand) {
      whereClause.brand = { name: brand };
    }

    if (note) {
      whereClause.notes = {
        some: {
          note: { name: note }
        }
      };
    }

    const [perfumes, total] = await Promise.all([
      db.perfume.findMany({
        where: whereClause,
        include: {
          brand: true,
          notes: {
            include: {
              note: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      db.perfume.count({ where: whereClause })
    ]);

    return NextResponse.json({
      perfumes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching perfumes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch perfumes' },
      { status: 500 }
    );
  }
}
