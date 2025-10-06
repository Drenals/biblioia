"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Zap, Database } from "lucide-react";
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
    <div className="relative min-h-screen w-full flex flex-col bg-gradient-to-b from-neutral-900 to-neutral-950">
      {/* Header */}
      <header className="relative z-10 w-full py-4 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Zap className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TecnoCatalogo</h1>
                <p className="text-xs text-neutral-400">
                  Asistente IA Especializado
                </p>
              </div>
            </motion.div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-700/50 rounded-lg"
              >
                <Database size={18} className="mr-1" /> Catálogo
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area with Background */}
      <div className="relative flex-1 overflow-hidden flex flex-col">
        <div className="absolute inset-0 opacity-20">
          <SimplifiedBackground title="TecnoCatalogo" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 container mx-auto max-w-4xl">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image
                    src="/logo.png"
                    alt="TecnoCatalogo"
                    width={80}
                    height={80}
                    className=" w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center shadow-xl shadow-blue-600/20"
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="max-w-lg mx-auto"
                >
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Bienvenido a TecnoCatalogo
                  </h2>
                  <p className="text-neutral-400 mx-auto">
                    Tu asistente inteligente para consultas tecnológicas. Estoy
                    aquí para ayudarte con información sobre productos,
                    comparativas y recomendaciones personalizadas.
                  </p>
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
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                          : "bg-neutral-800 text-white border border-neutral-700"
                      }`}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize]}
                      
                        components={{
                          strong: ({ node, ...props }) => (
                            <strong className="text-blue-400" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="list-disc pl-5 space-y-2"
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              className="list-decimal pl-5 space-y-2"
                              {...props}
                            />
                          ),
                          a: ({ node, ...props }) => (
                            <a
                              className="text-blue-400 hover:text-blue-300 underline"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-neutral-800 text-white">
                      <div className="flex space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
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
                <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-neutral-800 text-white border border-neutral-700">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Spacer to push input to bottom */}
          <div className="flex-grow"></div>

          {/* Input Area */}
          <div className="p-6 mb-8">
            <form onSubmit={onSubmit} className="flex justify-center">
              <div className="relative max-w-md w-full bg-neutral-800/90 backdrop-blur-md rounded-full border border-neutral-700/50 shadow-lg">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Database size={18} />
                </div>
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Escribe el ID del libro"
                  className="border-0 bg-transparent text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 pl-10 pr-12 py-6 rounded-full"
                />
                <Button
                  type="submit"
                  disabled={isTyping || !input.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-red-600 hover:opacity-90 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
                >
                  <Send size={16} />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
