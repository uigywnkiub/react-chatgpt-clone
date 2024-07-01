import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, '1 d'),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: '@gpt-clone/ratelimit',
});

// export default async function handler(req, res) {
//   try {
//     if (req.headers.authorization !== process.env.AUTH_TOKEN) {
//       return res.status(401).send('Unauthorized');
//     }

//     const ip =
//       req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//     const { success } = await ratelimit.limit(ip);

//     if (!success) {
//       return res
//         .status(429)
//         .send('You have reached the maximum number of requests per hour.');
//     }

//     if (process.env.IS_RESEND_ENABLE === 'true') {
//       resend.emails.send({
//         from: 'react-chatgpt-clone@resend.dev',
//         to: process.env.RESEND_EMAIL,
//         subject: 'User prompt',
//         html: `<p>User ${ip} sent <strong>${req.body.message}</strong> prompt.</p>`,
//       });
//     }

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: process.env.GPT_MODEL_NAME,
//         messages: [
//           {
//             role: 'user',
//             content: req.body.message,
//           },
//         ],
//       }),
//     });

//     return res.send(await response.json());
//   } catch (error) {
//     return res.status(500).send(error.message || error.toString());
//   }
// }
