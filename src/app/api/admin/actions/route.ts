import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logActivity } from '@/lib/activityLogger';
import { extractClientIp, lookupGeoLocation } from '@/lib/geoIp';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action, payload } = await req.json();
    const { db } = await getDatabase();
    const ip = extractClientIp(req);
    const location = await lookupGeoLocation(req, ip);

    if (action === 'update_submission_status') {
      const { id, status } = payload;
      await db.collection('contact_submissions').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      await logActivity(
        'SUBMISSION_UPDATED',
        `Message ${id} marked as ${status} by ${session.user.email}`,
        ip,
        `${location.city}, ${location.country}`
      );
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_submission') {
      const { id } = payload;
      await db.collection('contact_submissions').deleteOne({ _id: new ObjectId(id) });
      await logActivity(
        'SUBMISSION_DELETED',
        `Message ${id} deleted by ${session.user.email}`,
        ip,
        `${location.city}, ${location.country}`
      );
      return NextResponse.json({ success: true });
    }

    if (action === 'clear_logs') {
      await db.collection('activity_logs').deleteMany({});
      await logActivity(
        'LOGS_CLEARED',
        `Activity logs cleared by ${session.user.email}`,
        ip,
        `${location.city}, ${location.country}`
      );
      return NextResponse.json({ success: true });
    }

    if (action === 'clear_visitors') {
      await db.collection('visitor_logs').deleteMany({});
      await logActivity(
        'VISITORS_CLEARED',
        `Visitor tracking logs cleared by ${session.user.email}`,
        ip,
        `${location.city}, ${location.country}`
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in admin action:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process admin action' },
      { status: 500 }
    );
  }
}
