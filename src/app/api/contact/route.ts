import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { extractClientIp, lookupGeoLocation } from '@/lib/geoIp';
import { logActivity } from '@/lib/activityLogger';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const ip = extractClientIp(req);
    const location = await lookupGeoLocation(req, ip);

    // 1. Parse body
    let name = '';
    let email = '';
    let message = '';
    let honeypot = '';

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await req.json();
      name = (body.name || '').trim();
      email = (body.email || '').trim();
      message = (body.message || '').trim();
      honeypot = (body._gotcha || body.website || '').trim();
    } else {
      const formData = await req.formData();
      name = ((formData.get('name') as string) || '').trim();
      email = ((formData.get('email') as string) || '').trim();
      message = ((formData.get('message') as string) || '').trim();
      honeypot = (
        (formData.get('_gotcha') as string) ||
        (formData.get('website') as string) ||
        ''
      ).trim();
    }

    // 2. Honeypot check (Antispam bot trap)
    if (honeypot) {
      return NextResponse.json({
        success: true,
        message: 'Message delivered successfully.',
      });
    }

    // 3. Validation
    if (!name || name.length < 2 || name.length > 120) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid name (2-120 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 150) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || message.length < 5 || message.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Message must be between 5 and 5000 characters.' },
        { status: 400 }
      );
    }

    // 4. Save submission into MongoDB
    const { db } = await getDatabase();
    const isCourseEnrollment =
      message.includes('[COURSE ENROLLMENT') ||
      message.includes('Python A–Z') ||
      message.includes('Enrollment Application');

    const submissionDoc = {
      name,
      email,
      message,
      formType: isCourseEnrollment ? 'course' : 'contact',
      ip,
      location: {
        country: location.country,
        city: location.city,
        region: location.region,
      },
      userAgent: req.headers.get('user-agent') || 'Unknown',
      status: 'unread',
      createdAt: new Date(),
    };

    await db.collection('contact_submissions').insertOne(submissionDoc);

    // 5. Log activity
    await logActivity(
      'CONTACT_FORM_SUBMISSION',
      `New message from ${name} (${email})`,
      ip,
      `${location.city}, ${location.country}`
    );

    // 6. Send Telegram Bot Notification
    try {
      await sendTelegramNotification({
        name,
        email,
        message,
        ip,
        location: `${location.city}, ${location.country}`,
      });
    } catch (telegramErr) {
      console.error('Failed to dispatch telegram notification:', telegramErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process message. Please try again later.' },
      { status: 500 }
    );
  }
}
