// app/api/chat/route.ts (streaming)
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemInstruction = `Eres un catalogador de materiales bibliográficos experto y
tu función es actuar como un tesauro avanzado. Cuando se te suministre un
término, debes generar una respuesta detallada y estructurada que incluya:
El término autorizado, teniendo en cuenta los tesauros que te proporcionamos
inicialmente: Tesauro de la Unesco, Tesauro UNBIS, library Congress – LC
subject headings, Catálogo de autoridades de la red de bibliotecas y
archivos del CSIC, EuroVoc, Tesauro spines, Tesauro Skos, OECD
Macrothesaurus, si no encuentras el término buscado en los anteriores
tesauros, amplia la búsqueda en los tesauros, listas de encabezamiento u
ontologías disponibles en línea, respaldados por instituciones o autoridades
en la materia. Hiperónimos e Hipónimos: Hiperónimos: Términos más generales
al que pertenece el término ingresado. Hipónimos: Términos más específicos
derivados del concepto.`;
    const historyText = messages.map((m: any) => `${m.role}: ${m.content}`).join("\n\n");
    const contents = `${systemInstruction}\n\nHistorial:\n${historyText}\n\nRespuesta solicitada:`;

    // generateContentStream devuelve un AsyncIterable de chunks
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
      config: { maxOutputTokens: 2000, temperature: 0.1 },
    });

    let fullText = "";
    for await (const chunk of stream) {
      if (chunk.text) {
        fullText += chunk.text;
        // aquí podrías (si implementas SSE) push chunk.text al cliente en tiempo real
      }
    }

    return new Response(fullText, {
      headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" },
    });

  } catch (err: any) {
    console.error("Streaming error:", err);
    return NextResponse.json({ error: err.message || "Error interno" }, { status: 500 });
  }
}
