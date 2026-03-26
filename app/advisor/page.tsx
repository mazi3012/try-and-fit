"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, ShoppingBag, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! I'm Franky, your personal AI stylist. Looking for something specific or need a complete makeover? 🎨" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        body: JSON.stringify({ messages: [...messages, { role: "user", content: userMsg }] }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.content) {
        setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(\[PRODUCT:[^\]]+\])/);
    return parts.map((part, i) => {
      if (part.startsWith("[PRODUCT:")) {
        const id = part.replace("[PRODUCT:", "").replace("]", "");
        return (
          <div key={i} className="my-3">
            <Link href={`/shop/${id}`}>
              <div className="flex items-center gap-3 p-3 bg-[#F7F7F7] border border-black/5 rounded-xl hover:border-brand/40 hover:bg-brand/5 transition-all">
                <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-brand uppercase tracking-widest">Recommended</p>
                  <p className="text-xs font-black text-[#111]">View Featured Item</p>
                </div>
                <Wand2 size={14} className="ml-auto text-[#bbb]" />
              </div>
            </Link>
          </div>
        );
      }
      return <p key={i} className="whitespace-pre-wrap">{part}</p>;
    });
  };

  return (
    <div className="mx-auto max-w-3xl flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] py-4 gap-4">
      {/* Header */}
      <header className="flex items-center gap-3 shrink-0 pb-2 border-b border-black/5">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/20">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="text-lg font-black text-[#111] uppercase tracking-tight">Style <span className="text-brand">AI</span></h1>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            <p className="text-[9px] font-black uppercase tracking-widest text-[#888]">Franky is online</p>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="bg-white border border-black/5 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-2.5 max-w-[90%]", m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}>
              <div className={cn(
                "h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-[11px] font-black",
                m.role === "assistant" ? "bg-brand text-white" : "bg-[#111] text-white"
              )}>
                {m.role === "assistant" ? "F" : "U"}
              </div>
              <div className={cn(
                "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                m.role === "assistant"
                  ? "bg-[#F7F7F7] border border-black/5 text-[#111]"
                  : "bg-brand text-white shadow-lg shadow-brand/15"
              )}>
                {renderContent(m.content)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2.5 mr-auto items-center">
              <div className="h-8 w-8 bg-brand text-white flex items-center justify-center rounded-full text-[11px] font-black animate-pulse">F</div>
              <div className="flex gap-1.5 px-4 py-3 rounded-2xl bg-[#F7F7F7] border border-black/5">
                <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-black/5 bg-[#F7F7F7]/50">
          <div className="relative flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Franky for style advice..."
              className="flex-1 h-12 bg-white border border-black/10 rounded-xl px-4 pr-12 text-sm font-medium text-[#111] placeholder:text-[#aaa] focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="absolute right-2 h-8 w-8 flex items-center justify-center rounded-lg bg-brand text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={15} />
            </button>
          </div>
          <p className="mt-2 text-center text-[9px] font-black uppercase tracking-widest text-[#ccc]">
            Powered by Gemini AI Fashion Engine
          </p>
        </div>
      </div>
    </div>
  );
}
