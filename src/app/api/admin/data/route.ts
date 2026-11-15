import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate with Better-Auth
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const { db } = await getDatabase();

    // 2. Fetch submissions
    const submissions = await db
      .collection('contact_submissions')
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    // 3. Fetch visitor logs
    const visitors = await db
      .collection('visitor_logs')
      .find({})
      .sort({ visitedAt: -1 })
      .limit(100)
      .toArray();

    // 4. Fetch activity logs
    const logs = await db
      .collection('activity_logs')
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();

    // 5. Compute stats
    const totalSubmissions = await db
      .collection('contact_submissions')
      .countDocuments();
    const unreadSubmissions = await db
      .collection('contact_submissions')
      .countDocuments({ status: 'unread' });
    const totalVisits = await db.collection('visitor_logs').countDocuments();
    const uniqueIpsList = await db
      .collection('visitor_logs')
      .distinct('ip');
    const uniqueIps = uniqueIpsList.length;

    // 6. Check Telegram configuration
    const telegramConfigDoc = await db.collection('settings').findOne({ key: 'telegram_config' });
    const telegramStatus = {
      configured: Boolean(
        (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) ||
        (telegramConfigDoc?.botToken && telegramConfigDoc?.chatId)
      ),
      chatId: telegramConfigDoc?.chatId || process.env.TELEGRAM_CHAT_ID || '',
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalSubmissions,
        unreadSubmissions,
        totalVisits,
        uniqueIps,
      },
      telegramStatus,
      submissions,
      visitors,
      logs,
      user: {
        name: session.user.name,
        email: session.user.email,
      },
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
