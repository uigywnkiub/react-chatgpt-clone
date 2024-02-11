import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "5 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
  // rateLimiters: {
  //   // Limit requests to this function to 5 per minute
  //   functionLimit: {
  //     window: "1m",
  //     limit: 5,
  //   },
  // },
});

export default async function handler(req, res) {
  try {
    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // const allowed = await ratelimit.limit("functionLimit", ip);

    // if (!allowed) {
    //   return res.status(429).json({
    //     error: "Too many requests from this IP, please try again later.",
    //   });
    // }

    const { success } = await ratelimit.limit("api");

    if (!success) {
      return res.status(429).json({
        error: "Too many requests from this IP, please try again later.",
      });
    }

    // const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    // await redis.incr(ip);
    // const requestCount = await redis.get(ip);
    // const maxRequestsPerWindow = 5;
    // if (parseInt(requestCount, 10) > maxRequestsPerWindow) {
    //   return res
    //     .status(429)
    //     .json({
    //       error: "Too many requests from this IP, please try again later.",
    //     });
    // }

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
