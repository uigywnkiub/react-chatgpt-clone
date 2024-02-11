import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const count = await redis.incr("counter");
  return res.status(200).json({ count });
}
