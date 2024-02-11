// export default async function handler(req, res) {
//   // const { body } = req;
//   return res.send(`Hello ${req.body.message}, you just parsed the request body!`);
// }
export default async function handler(req, res) {
  const msg = req.body.message;
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
          content: msg,
        },
      ],
    }),
  });
  
  return res.send(await response.json());

  // return res.send(
  //   `Hello ${req.body.message}, you just parsed the request body!`
  // );
}

export async function POST(req, res) {
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
          content: req.body.message,
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
    // return new Response(JSON.stringify(data));
    // return data
    return res.send(data);
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
