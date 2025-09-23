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
        parts: [{ text: `Eres un catalogador de materiales bibliográficos experto y tu función es actuar como un tesauro avanzado. Cuando se te suministre un término, debes generar una respuesta detallada y estructurada que incluya: El término autorizado, teniendo en cuenta los tesauros que te proporcionamos inicialmente: Tesauro de la Unesco, Tesauro UNBIS, library Congress – LC subject headings, Catálogo de autoridades de la red de bibliotecas y
archivos del CSIC, EuroVoc, Tesauro spines, Tesauro Skos, OECD
Macrothesaurus, si no encuentras el término buscado en los anteriores
tesauros, amplia la búsqueda en los tesauros, listas de encabezamiento u
ontologías disponibles en línea, respaldados por instituciones o autoridades
en la materia. Hiperónimos e Hipónimos: Hiperónimos: Términos más generales
al que pertenece el término ingresado. Hipónimos: Términos más específicos
derivados del concepto. Términos Relacionados: Otros conceptos o palabras
que se asocien al término, que puedan enriquecer el contexto. Asegúrate de
que la respuesta sea clara, precisa y que abarque todos estos aspectos de
manera coherente y organizada. Tu objetivo es proporcionar una herramienta
de consulta completa y útil que ayude a profundizar en el conocimiento del
término ingresado.` }]
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