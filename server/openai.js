import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [
    {"role": "user", "content": "write a haiku about ai"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));