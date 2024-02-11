export function GET(req, res) {
  return new Response(`Hello from ${process.env.VERCEL_REGION}, ${req} | ${res}`);
}
