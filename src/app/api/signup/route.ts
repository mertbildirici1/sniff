import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  handle: z.string()
    .min(3, 'Handle must be at least 3 characters')
    .max(20, 'Handle must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('Signup request received');
    const body = await request.json();
    console.log('Request body:', body);
    
    const { email, password, name, handle } = signupSchema.parse(body);
    
    // Sanitize handle: trim whitespace and convert to lowercase
    const sanitizedHandle = handle.trim().toLowerCase();
    console.log('Parsed data:', { email, name, handle: sanitizedHandle, passwordLength: password.length });

    // Check if user already exists
    console.log('Checking for existing user...');
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email },
          { handle: sanitizedHandle }
        ]
      }
    });

    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return NextResponse.json(
        { error: 'User with this email or handle already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    // Create user
    console.log('Creating user...');
    const user = await db.user.create({
      data: {
        email,
        name,
        handle: sanitizedHandle,
        password: hashedPassword,
      }
    });
    console.log('User created successfully:', user.id);

    // Create default lists for the user
    console.log('Creating default lists...');
    const defaultLists = [
      { name: 'Tried', type: 'tried' },
      { name: 'Wishlist', type: 'wishlist' },
      { name: 'Collection', type: 'collection' }
    ];

    await db.list.createMany({
      data: defaultLists.map(list => ({
        ...list,
        userId: user.id
      }))
    });
    console.log('Default lists created successfully');

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        handle: user.handle
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Signup error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
