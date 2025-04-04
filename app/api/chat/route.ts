// app/api/chat/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { maxOutputTokens: 1000 }
    });

    const chat = model.startChat({
      history: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      })),
      systemInstruction: {
        role: "model",
        parts: [{ text: "Eres un asistente lingüístico experto y tu función es actuar como un tesauro avanzado. Cuando se te suministre un término, debes generar una respuesta detallada y estructurada que incluya: Definición: Una explicación clara y concisa del significado del término. Sinónimos: Una lista de palabras o expresiones con significados similares. Antónimos: Una lista de palabras o expresiones con significados opuestos, en caso de que existan. Hiperónimos e Hipoónimos: Hiperónimos: Términos más generales al que pertenece el término ingresado. Hipónimos: Términos más específicos derivados del concepto. Términos Relacionados: Otros conceptos o palabras que se asocien al término, que puedan enriquecer el contexto. Ejemplos de Uso: Una o dos frases que demuestren cómo se utiliza el término en contextos reales. Notas Adicionales: Cualquier dato relevante sobre la etimología o el uso regional del término, si aplica. Asegúrate de que la respuesta sea clara, precisa y que abarque todos estos aspectos de manera coherente y organizada. Tu objetivo es proporcionar una herramienta de consulta completa y útil que ayude a profundizar en el conocimiento del término ingresado." }]
      }
    });

    const result = await chat.sendMessage(messages[messages.length - 1].content);
    const response = await result.response;
    
    // Devuelve solo el texto plano
    return new Response(response.text(), {
      headers: { 
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}