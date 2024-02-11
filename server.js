import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // limit each IP to 100 requests per minute defined in windowMs
  message: "Too many requests from this IP, please try again later.",
});

app.post("/api/completions", limiter, async (req, res) => {
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

    res.send(data);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT}/completions`
  );
});
