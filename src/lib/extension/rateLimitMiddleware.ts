/**
 * Rate limiting middleware for extension API routes
 * Enforces usage limits and returns appropriate headers
 */

import { NextRequest, NextResponse } from 'next/server';
import { incrementUsage, getRemainingQuota } from './usageTracking';

export interface RateLimitResult {
  allowed: boolean;
  status?: number;
  headers?: Record<string, string>;
  error?: string;
}

/**
 * Check rate limits for an API request
 */
export async function checkRateLimit(
  userId: string,
  endpoint: string
): Promise<RateLimitResult> {
  try {
    // Increment usage and check if allowed
    const { allowed, usage, limit } = await incrementUsage(userId, endpoint);
    
    if (!allowed) {
      // Get remaining quota for headers
      const quota = await getRemainingQuota(userId);
      
      // Calculate reset time (midnight UTC)
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      const resetTime = Math.floor(tomorrow.getTime() / 1000);
      
      return {
        allowed: false,
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(limit || quota.daily.total.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(resetTime),
          'Retry-After': String(Math.floor((tomorrow.getTime() - now.getTime()) / 1000))
        },
        error: `Rate limit exceeded. Daily limit: ${limit || quota.daily.total.limit}`
      };
    }
    
    // Request allowed - include usage headers
    const quota = await getRemainingQuota(userId);
    const endpointQuota = quota.daily.endpoints[endpoint] || quota.daily.total;
    
    return {
      allowed: true,
      headers: {
        'X-RateLimit-Limit': String(endpointQuota.limit),
        'X-RateLimit-Remaining': String(endpointQuota.remaining),
        'X-RateLimit-Used': String(endpointQuota.used)
      }
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow request if rate limiting fails
    return { allowed: true };
  }
}

/**
 * Create a rate-limited response
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  if (!result.allowed) {
    return NextResponse.json(
      { 
        error: result.error || 'Rate limit exceeded',
        retryAfter: result.headers?.['Retry-After']
      },
      { 
        status: result.status || 429,
        headers: result.headers 
      }
    );
  }
  
  // This shouldn't be called if allowed is true
  return NextResponse.json(
    { error: 'Internal error' },
    { status: 500 }
  );
}

/**
 * Apply rate limit headers to a successful response
 */
export function applyRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult
): NextResponse {
  if (result.headers) {
    Object.entries(result.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  return response;
}
