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

    if (action === 'mark_all_read') {
      await db.collection('contact_submissions').updateMany(
        { status: 'unread' },
        { $set: { status: 'read' } }
      );
      await logActivity(
        'ALL_SUBMISSIONS_MARKED_READ',
        `All unread submissions marked as read by ${session.user.email}`,
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

    if (action === 'change_password') {
      const { currentPassword, newPassword } = payload;
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password and new password are required' },
          { status: 400 }
        );
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { success: false, error: 'New password must be at least 8 characters' },
          { status: 400 }
        );
      }
      try {
        await auth.api.changePassword({
          body: {
            currentPassword,
            newPassword,
            revokeOtherSessions: false,
          },
          headers: req.headers,
        });
        await logActivity(
          'PASSWORD_CHANGED',
          `Admin password changed for ${session.user.email}`,
          ip,
          `${location.city}, ${location.country}`
        );
        return NextResponse.json({ success: true, message: 'Password updated successfully' });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid current password or update failed';
        return NextResponse.json({ success: false, error: msg }, { status: 400 });
      }
    }

    if (action === 'update_profile') {
      const { newEmail, newName } = payload;
      const updateData: Record<string, string> = {};
      if (newName) updateData.name = newName.trim();
      if (newEmail) updateData.email = newEmail.trim();

      if (Object.keys(updateData).length > 0) {
        await db.collection('user').updateOne(
          { email: session.user.email },
          { $set: updateData }
        );
        if (newEmail) {
          await db.collection('account').updateMany(
            { accountId: session.user.email },
            { $set: { accountId: newEmail.trim() } }
          );
        }
        await logActivity(
          'ADMIN_PROFILE_UPDATED',
          `Admin profile updated (${session.user.email} -> ${newEmail || session.user.email})`,
          ip,
          `${location.city}, ${location.country}`
        );
        return NextResponse.json({ success: true, message: 'Admin profile updated successfully' });
      }
      return NextResponse.json({ success: false, error: 'No fields to update' }, { status: 400 });
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
