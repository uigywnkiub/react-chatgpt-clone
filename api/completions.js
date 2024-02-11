export default async function handler(req, res) {
  try {
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
