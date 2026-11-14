import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

// Hidden server-side endpoint; not exposed to the browser client
const FORM_BACKEND_ENDPOINT =
  process.env.FORM_BACKEND_ENDPOINT ||
  'https://form-farm-azure.vercel.app/f/b27015215386ab43';

export async function POST(req: NextRequest) {
  try {
    // 1. IP-Based Rate Limiting Check (Max 2 submissions per 5 minutes per IP)
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.isAllowed) {
      const minutes = Math.floor(rateLimit.retryAfterSeconds / 60);
      const seconds = rateLimit.retryAfterSeconds % 60;
      const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Maximum 2 submissions every 5 minutes allowed per IP. Please wait ${timeStr} before trying again.`,
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      );
    }

    // 2. Parse payload (support both JSON and FormData)
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
      name = (formData.get('name') as string || '').trim();
      email = (formData.get('email') as string || '').trim();
      message = (formData.get('message') as string || '').trim();
      honeypot = (formData.get('_gotcha') as string || formData.get('website') as string || '').trim();
    }

    // 3. Honeypot check (Antispam bot trap)
    // If a bot filled out the hidden field, drop silently with fake 200 OK
    if (honeypot) {
      return NextResponse.json({
        success: true,
        message: 'Message delivered successfully.',
      });
    }

    // 4. Input validation
    if (!name || name.length < 2 || name.length > 120) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid name (2-120 characters).' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email) || email.length > 150) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || message.length < 5 || message.length > 4000) {
      return NextResponse.json(
        { success: false, error: 'Message must be between 5 and 4000 characters.' },
        { status: 400 }
      );
    }

    // 5. Proxy securely to the upstream form backend
    // Notice: Client never communicates with form-farm directly
    const upstreamResponse = await fetch(FORM_BACKEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'CodeWithTanim-Portfolio-Gateway/1.0',
        'X-Forwarded-For': clientIp,
      },
      body: JSON.stringify({ name, email, message }),
    });

    if (!upstreamResponse.ok && upstreamResponse.status !== 302 && upstreamResponse.status !== 303) {
      console.error(`Upstream form gateway returned status: ${upstreamResponse.status}`);
      // Fallback response if upstream is momentarily down
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to deliver message right now. Please reach out directly to codewithtanim@gmail.com.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your message has been sent successfully. I will get back to you shortly.',
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': String(rateLimit.limit),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected server error occurred. Please try again or email codewithtanim@gmail.com directly.',
      },
      { status: 500 }
    );
  }
}
