import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const rateLimiter = new Ratelimit({
  // choose the algorithm
  // Ratelimit.fixedWindow(maxRequests, windowSize)
  // Ratelimit.slidingWindow(maxRequests, windowSize)
  // Ratelimit.tokenBucket(refillRate, interval, maxTokens)
  limiter: Ratelimit.fixedWindow(10, "10 s"),

  // get the redis credentials from .env
  redis: Redis.fromEnv(),

  // store analytics data in redis, which you can check out at https://console.upstash.com/ratelimit
  analytics: true,

  // you don't need to define this, but it's good to know that
  // the ratelimiter will keep a global cache of identifiers, that have exhausted their ratelimit
  // this will save on time and costs
  ephemeralCache: undefined,

  // a prefix for the keys in the redis database to keep track of origin
  // defaults to '@upstash/ratelimit'
  prefix: "@upstash/ratelimit",

  // If set, the ratelimiter will allow requests to pass after this many milliseconds.
  // use this if you want to allow requests in case of network problems
  timeout: undefined,
});

export async function GET(req) {
  const ip = req.ip ?? req.headers.get("X-Forwarded-For") ?? "unknown";
  const { success } = await rateLimiter.limit(ip);

  if (!success)
    return NextResponse.json({ error: "rate limited" }, { status: 429 });

  return NextResponse.json({ data: "success" }, { status: 200 });
}
