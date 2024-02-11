import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "10 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export default async function handler(req, res) {
  try {
    // const { success } = await ratelimit.blockUntilReady("id", 10_000);

    // if (!success) {
    //   return res.status(429).send("Too many requests");
    // }

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Increment request count for this IP address in Redis
    await redis.incr(ip);

    // Get current request count for this IP address
    const requestCount = await redis.get(ip);

    // Check if the request count exceeds the limit
    const maxRequestsPerWindow = 100;
    if (parseInt(requestCount, 10) > maxRequestsPerWindow) {
      return res
        .status(429)
        .json({
          error: "Too many requests from this IP, please try again later.",
        });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GPT_MODEL_NAME,
        messages: [
          {
            role: "user",
            content: req.body.message,
          },
        ],
      }),
    });

    return res.send(await response.json());
  } catch (error) {
    return res.status(500).send(error.message || error.toString());
  }
}
