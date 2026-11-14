import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { extractClientIp, lookupGeoLocation } from '@/lib/geoIp';
import { logActivity } from '@/lib/activityLogger';

export async function POST(req: NextRequest) {
  try {
    const ip = extractClientIp(req);
    const location = await lookupGeoLocation(req, ip);

    let path = '/';
    let referrer = '';

    try {
      const body = await req.json();
      path = body.path || '/';
      referrer = body.referrer || '';
    } catch {
      // Body empty or invalid JSON
    }

    // Skip recording admin path as normal visitor if desired, or record with admin flag
    if (path.startsWith('/habiba') || path.startsWith('/api')) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const { db } = await getDatabase();
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    // 1. Insert into visitor_logs
    await db.collection('visitor_logs').insertOne({
      ip,
      country: location.country,
      city: location.city,
      region: location.region,
      path,
      referrer,
      userAgent,
      visitedAt: new Date(),
    });

    // 2. Insert into activity_logs
    await logActivity(
      'PAGE_VISIT',
      `Visited ${path}${referrer ? ` via ${referrer}` : ''}`,
      ip,
      `${location.city}, ${location.country}`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
