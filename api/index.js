import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT = 8000;
const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/completions", async (req, res) => {
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
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    res.send(data);
  } catch (e) {
    console.error(e);
  }
});

app.get("/api/test", (req, res) => {
  const path = `/api/item/${Math.random() + ""}`;
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.listen(PORT, () => {
  console.log(
    `Server API is running on http://localhost:${PORT}/api/completions`
  );
});

export default app;
