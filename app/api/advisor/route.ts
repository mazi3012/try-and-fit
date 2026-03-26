import { VertexAI } from "@google-cloud/vertexai";
import { getProducts } from "@/lib/ecommerce";
import { NextResponse } from "next/server";

const vertexAI = new VertexAI({
  project: process.env.VERTEX_AI_PROJECT_ID || "",
  location: process.env.VERTEX_AI_LOCATION || "us-central1"
});

const model = vertexAI.getGenerativeModel({ 
  model: "gemini-1.5-flash"
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Fetch products for context
    const products = await getProducts();
    const productContext = products.map(p => 
      `ID: ${p.id}, Name: ${p.name}, Price: ₹${p.price}, Category: ${p.categories.name}, Brand: ${p.brand}`
    ).join("\n");

    const systemPrompt = `
      You are "Franky", an elite AI Fashion Stylist for the TryAndFit store. 
      Your tone is bold, helpful, and high-fashion.
      
      Available Products in our store:
      ${productContext}

      Instructions:
      1. Help the user find the perfect outfit for any occasion.
      2. If you recommend a product from the list above, ALWAYS use the format [PRODUCT:id] in your response so the UI can render it.
      3. Encourage users to use the "Virtual Try-On" feature.
      4. Keep responses concise and stylish.
    `;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Understood. I am Franky, your elite AI Stylist. How can I transform your look today?" }] },
      ],
    });

    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process that.";

    return NextResponse.json({ content: responseText });
  } catch (error: any) {
    console.error("AI Advisor Error:", error);
    return NextResponse.json({ error: "Failed to get advice" }, { status: 500 });
  }
}
