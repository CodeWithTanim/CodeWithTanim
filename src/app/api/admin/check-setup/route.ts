import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await getDatabase();
    const userCount = await db.collection('user').countDocuments();
    return NextResponse.json({
      hasAdmin: userCount > 0,
    });
  } catch (error) {
    console.error('Error checking admin setup:', error);
    return NextResponse.json({ hasAdmin: false }, { status: 500 });
  }
}
