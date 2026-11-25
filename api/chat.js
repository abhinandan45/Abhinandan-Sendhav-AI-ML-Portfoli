export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { message } = req.body;

  const r = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: "Answer only about Abhinandan's portfolio..." }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
      }),
    }
  );

  const data = await r.json();
  res.json({ reply: data.candidates?.[0]?.content?.parts?.[0]?.text });
}