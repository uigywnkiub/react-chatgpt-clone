// export function GET(req, res) {
//   return new Response(`Hello from ${process.env.VERCEL_REGION}, ${req} | ${res}`);
// }

export function POST(req, res) {
  return new Response(`POST from ${process.env.VERCEL_REGION}, ${JSON.stringify(req)} | ${JSON.stringify(res)}`);
}
