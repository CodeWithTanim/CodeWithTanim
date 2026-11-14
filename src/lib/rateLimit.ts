// In-memory IP-based sliding window rate limiter
// Window: 5 minutes (300,000 ms)
// Limit: Maximum 2 submissions per 5 minutes per IP

interface RateLimitRecord {
  timestamps: number[];
}

// Global in-memory store for tracking IP submissions
const ipRateLimitStore = new Map<string, RateLimitRecord>();

export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 5 * 60 * 1000, // 5 minutes
  MAX_REQUESTS: 2,           // 2 submissions max per window
};

export interface RateLimitCheckResult {
  isAllowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
  resetTimeMs: number;
}

/**
 * Checks if a given IP has exceeded the allowed rate limit
 * (2 requests per 5 minutes).
 */
export function checkRateLimit(ip: string): RateLimitCheckResult {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_CONFIG.WINDOW_MS;

  // Retrieve existing record or create new
  const record = ipRateLimitStore.get(ip) || { timestamps: [] };

  // Filter timestamps to only keep those within the active 5-minute sliding window
  const activeTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= RATE_LIMIT_CONFIG.MAX_REQUESTS) {
    // Oldest timestamp in window dictates when the next slot will free up
    const oldestTimestamp = activeTimestamps[0];
    const resetTimeMs = oldestTimestamp + RATE_LIMIT_CONFIG.WINDOW_MS;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTimeMs - now) / 1000));

    return {
      isAllowed: false,
      limit: RATE_LIMIT_CONFIG.MAX_REQUESTS,
      remaining: 0,
      retryAfterSeconds,
      resetTimeMs,
    };
  }

  // Record this attempt
  activeTimestamps.push(now);
  ipRateLimitStore.set(ip, { timestamps: activeTimestamps });

  // Self-cleaning mechanism to prevent memory leak if store grows large
  if (ipRateLimitStore.size > 2000) {
    for (const [trackedIp, rec] of ipRateLimitStore.entries()) {
      const valid = rec.timestamps.filter((ts) => ts > windowStart);
      if (valid.length === 0) {
        ipRateLimitStore.delete(trackedIp);
      } else {
        ipRateLimitStore.set(trackedIp, { timestamps: valid });
      }
    }
  }

  const remaining = RATE_LIMIT_CONFIG.MAX_REQUESTS - activeTimestamps.length;
  const nextResetTimeMs = activeTimestamps[0] + RATE_LIMIT_CONFIG.WINDOW_MS;
  const retryAfterSeconds = Math.max(0, Math.ceil((nextResetTimeMs - now) / 1000));

  return {
    isAllowed: true,
    limit: RATE_LIMIT_CONFIG.MAX_REQUESTS,
    remaining,
    retryAfterSeconds,
    resetTimeMs: nextResetTimeMs,
  };
}

/**
 * Extracts the real client IP from incoming request headers
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  
  // Cloudflare header
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Standard proxy forwarded header
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(',')[0];
    if (firstIp) return firstIp.trim();
  }

  // Standard real-ip header
  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) {
    return xRealIp.trim();
  }

  return '127.0.0.1';
}
