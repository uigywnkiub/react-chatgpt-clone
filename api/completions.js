import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

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
    const { success } = await ratelimit.blockUntilReady("id", 10_000);

    if (!success) {
      return res.status(429).send("Too many requests");
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
