export async function POST(req, res) {
  // return new Response(`Hello from ${process.env.VERCEL_REGION}, ${req} | ${res}`);
  const options = {
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
          content: req.body.message || "test resp",
        },
      ],
    }),
  };
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Credentials", `true`);
    res.setHeader("Access-Control-Allow-Origin", "*");
    // return new Response(JSON.stringify(data));
    return Response(JSON.stringify(data))
    // return data
    // return res.send(data);
  } catch (e) {
    console.error(e);
  }
}

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
