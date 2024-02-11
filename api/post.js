export default async function handler(req, res) {
  console.log("🚀  res:", res);

  console.log("🚀  req:", req);

  const { body } = req;
  return res.send(`Hello ${body.name}, you just parsed the request body!`);
}
// export async function POST(req, res) {
//   const { body: reqBody } = req;
//   if (reqBody.message === "POST") {
//     return new Response(JSON.stringify(reqBody));
//   }

//   // return new Response(`Hello from ${process.env.VERCEL_REGION}, ${req} | ${res}`);
//   const options = {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: process.env.GPT_MODEL_NAME,
//       messages: [
//         {
//           role: "user",
//           content: req.body.message || "test resp",
//         },
//       ],
//     }),
//   };
//   try {
//     const response = await fetch(
//       "https://api.openai.com/v1/chat/completions",
//       options
//     );
//     const data = await response.json();
//     // return new Response(JSON.stringify(data));
//     return new Response(JSON.stringify(req.body));
//     // return data
//     // return res.send(data);
//   } catch (e) {
//     console.error(e);
//   }
// }

// app.post("/api/completions", async (req, res) => {
//   const options = {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model: process.env.GPT_MODEL_NAME,
//       messages: [
//         {
//           role: "user",
//           content: req.body.message,
//         },
//       ],
//     }),
//   };
//   try {
//     const response = await fetch(
//       "https://api.openai.com/v1/chat/completions",
//       options
//     );
//     const data = await response.json();
//     res.send(data);
//   } catch (e) {
//     console.error(e);
//   }
// });
