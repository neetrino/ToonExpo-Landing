import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_RATE_LIMIT_MAX_REQUESTS,
  AUTH_RATE_LIMIT_WINDOW_MS,
} from "@/shared/constants/authRateLimit.constants";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Vitest-ի համար միայն */
export function resetAuthRateLimitBucketsForTests(): void {
  buckets.clear();
}

function clientKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) {
      return first;
    }
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

/**
 * Վերադարձնում է 429 պատասխան, եթե սահմանափակումը գերազանցված է։
 */
export function authRateLimitResponse(req: NextRequest): NextResponse | null {
  const now = Date.now();
  const key = clientKey(req);
  let b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    b = { count: 1, resetAt: now + AUTH_RATE_LIMIT_WINDOW_MS };
    buckets.set(key, b);
    return null;
  }
  b.count += 1;
  if (b.count > AUTH_RATE_LIMIT_MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((b.resetAt - now) / 1000)),
        },
      },
    );
  }
  return null;
}
