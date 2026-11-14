import { NextRequest } from 'next/server';

export interface GeoLocation {
  country: string;
  city: string;
  region: string;
}

export function extractClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  return '127.0.0.1';
}

export async function lookupGeoLocation(
  req: NextRequest,
  ip: string
): Promise<GeoLocation> {
  // 1. Check cloud hosting headers first (e.g., Vercel or Cloudflare headers)
  const vercelCountry = req.headers.get('x-vercel-ip-country');
  const vercelCity = req.headers.get('x-vercel-ip-city');
  const vercelRegion = req.headers.get('x-vercel-ip-country-region');

  if (vercelCountry) {
    return {
      country: vercelCountry,
      city: vercelCity ? decodeURIComponent(vercelCity) : 'Unknown',
      region: vercelRegion || 'Unknown',
    };
  }

  // 2. If localhost or private IP, return Local
  if (
    !ip ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.')
  ) {
    return { country: 'Localhost', city: 'Dev Machine', region: 'Internal' };
  }

  // 3. Fallback to free public IP geolocation lookup with a short 2s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`https://ip-api.com/json/${ip}?fields=country,city,regionName,status`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return {
          country: data.country || 'Unknown',
          city: data.city || 'Unknown',
          region: data.regionName || 'Unknown',
        };
      }
    }
  } catch {
    // Fail silently to avoid blocking requests
  }

  return { country: 'Unknown', city: 'Unknown', region: 'Unknown' };
}
