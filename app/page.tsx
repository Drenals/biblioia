"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Library, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SimplifiedBackground from "@/components/kokonutui/simplified-background";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default function TecnoCatalogoChat() {
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      streamProtocol: "text", // o el valor que indique que no es un stream
      onError: (error) => {
        console.error("Error en el chat:", error);
        alert("Error al conectar con el servidor");
      },
    });

  // Elimina el estado isTyping y usa isLoading
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Simplifica el onSubmit
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
  };

  return (
  <div className="relative min-h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Library className="text-white" size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TecnoCatalogo</h1>
                <p className="text-xs text-gray-600">Asistente de Biblioteca IA</p>
              </div>
            </motion.div>

            <Button
              variant="outline"
              size="sm"
              className="text-blue-600 hover:bg-blue-50 border-blue-200 rounded-lg bg-white"
            >
              <BookOpen size={18} className="mr-2" />
              Catálogo
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Area con fondo decorativo sutil */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        {/* Fondo decorativo sutil */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none z-0">
          <SimplifiedBackground title="TecnoCatalogo" />
        </div>
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-6 container mx-auto max-w-4xl">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 min-h-[60vh]">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-6">
                  <Sparkles className="text-white" size={32} />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">Bienvenido a TecnoCatalogo</h2>
                <p className="text-lg text-gray-600 leading-relaxed text-balance">
                  Tu asistente inteligente para consultas de biblioteca. Proporciona el ID de un libro y obtén
                  información detallada al instante.
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                      <BookOpen className="text-blue-600" size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Búsqueda Rápida</h3>
                    <p className="text-sm text-gray-600">Encuentra libros por ID instantáneamente</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-3">
                      <Library className="text-red-600" size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Catálogo Completo</h3>
                    <p className="text-sm text-gray-600">Accede a toda la información bibliográfica</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                      <Sparkles className="text-blue-600" size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">IA Avanzada</h3>
                    <p className="text-sm text-gray-600">Respuestas precisas y contextuales</p>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeSanitize]}
                          components={{
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                            strong: ({ node, ...props }) => (
                              <strong
                                className={
                                  message.role === "user" ? "font-semibold text-white" : "font-semibold text-blue-600"
                                }
                                {...props}
                              />
                            ),
                            ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />,
                            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                            a: ({ node, ...props }) => (
                              <a
                                className={
                                  message.role === "user"
                                    ? "underline hover:text-blue-100"
                                    : "text-blue-600 hover:text-blue-700 underline"
                                }
                                {...props}
                              />
                            ),
                            code: ({ node, ...props }) => (
                              <code
                                className={
                                  message.role === "user"
                                    ? "bg-blue-800/30 px-1.5 py-0.5 rounded text-sm"
                                    : "bg-gray-100 px-1.5 py-0.5 rounded text-sm text-gray-900"
                                }
                                {...props}
                              />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl px-5 py-3.5 bg-white border border-gray-200 shadow-sm">
                      <div className="flex space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {isTyping && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gradient-to-r from-red-400 to-red-600 text-white border-2 border-red-200">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-white/80 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-white/80 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-white/80 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white">
            <div className="container mx-auto max-w-4xl p-4">
              <form onSubmit={onSubmit} className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <BookOpen size={20} />
                  </div>
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Escribe el ID del libro..."
                    className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-600 pl-12 pr-4 py-6 rounded-xl shadow-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !input?.trim()}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl px-6 py-6 shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send size={20} />
                </Button>
              </form>
              <p className="text-xs text-gray-500 text-center mt-3">
                Ingresa un ID de libro para obtener información detallada
              </p>
            </div>
          </div>
        </div>
      </div>
  
  );
}
