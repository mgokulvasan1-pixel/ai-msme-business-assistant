import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json({ reply: "Chatbot is not configured. Missing GROQ_API_KEY." });
    }

    const groq = new Groq({ apiKey });

    const { message } = await req.json();

    if (typeof message !== "string" || !message.trim()) {
      return Response.json({ reply: "Please provide a valid message." });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are BizFlow AI Assistant.

You help MSME business owners with:
- GST
- Invoices
- Inventory
- Business finance
- Government schemes
- Tax
- Profit analysis

Keep answers clear and concise.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion?.choices?.[0]?.message?.content ??
      "I couldn't generate a reply. Please try again.";

    return Response.json({ reply });
  } catch (error) {
    console.error("/api/chat error:", error);
    return Response.json({ reply: "Something went wrong while processing your request." });
  }
}

