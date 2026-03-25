import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import { NextRequest } from "next/server";
import {
  authRateLimitResponse,
  resetAuthRateLimitBucketsForTests,
} from "@/shared/lib/authRateLimit";
import {
  AUTH_RATE_LIMIT_MAX_REQUESTS,
  AUTH_RATE_LIMIT_WINDOW_MS,
} from "@/shared/constants/authRateLimit.constants";

function makeReq(ip: string): NextRequest {
  return new NextRequest("http://localhost/api/auth/callback/credentials", {
    headers: { "x-forwarded-for": ip },
  });
}

describe("authRateLimitResponse", () => {
  beforeEach(() => {
    resetAuthRateLimitBucketsForTests();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit", () => {
    const ip = "203.0.113.1";
    for (let i = 0; i < AUTH_RATE_LIMIT_MAX_REQUESTS; i += 1) {
      expect(authRateLimitResponse(makeReq(ip))).toBeNull();
    }
  });

  it("returns 429 after exceeding the limit", () => {
    const ip = "203.0.113.2";
    for (let i = 0; i < AUTH_RATE_LIMIT_MAX_REQUESTS; i += 1) {
      authRateLimitResponse(makeReq(ip));
    }
    const res = authRateLimitResponse(makeReq(ip));
    expect(res?.status).toBe(429);
  });

  it("allows again after the window elapses", () => {
    const ip = "203.0.113.3";
    for (let i = 0; i < AUTH_RATE_LIMIT_MAX_REQUESTS; i += 1) {
      authRateLimitResponse(makeReq(ip));
    }
    expect(authRateLimitResponse(makeReq(ip))?.status).toBe(429);
    vi.advanceTimersByTime(AUTH_RATE_LIMIT_WINDOW_MS + 1);
    expect(authRateLimitResponse(makeReq(ip))).toBeNull();
  });
});
