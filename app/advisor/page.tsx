"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, ShoppingBag, Wand2 } from "lucide-react";
import { PremiumButton } from "@/components/ui/premium-button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! I'm Franky, your personal AI stylist. Looking for something specific or need a complete makeover?" }
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
    // Basic parser for [PRODUCT:id] - in a real app would fetch and render card
    const parts = content.split(/(\[PRODUCT:[^\]]+\])/);
    return parts.map((part, i) => {
      if (part.startsWith("[PRODUCT:")) {
        const id = part.replace("[PRODUCT:", "").replace("]", "");
        return (
          <div key={i} className="my-4">
            <Link href={`/shop/${id}`}>
               <div className="flex items-center gap-4 p-3 bg-white border border-black/5 rounded-xl hover:bg-black/5 transition-all shadow-sm">
                  <div className="h-12 w-12 rounded-lg bg-black flex items-center justify-center text-brand">
                     <ShoppingBag size={20} />
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-brand uppercase tracking-[0.2em] mb-0.5">Recommended</p>
                     <p className="text-xs font-black text-black uppercase tracking-tight italic">View Featured Item</p>
                  </div>
                  <Wand2 size={16} className="ml-auto text-muted/40" />
               </div>
            </Link>
          </div>
        );
      }
      return <p key={i} className="whitespace-pre-wrap">{part}</p>;
    });
  };

  return (
    <div className="mx-auto max-w-4xl flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-120px)] overflow-hidden py-4">
      <header className="flex items-center gap-3 mb-6 shrink-0">
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-brand text-white shadow-xl shadow-brand/20">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black text-black uppercase italic tracking-tighter">STYLE <span className="text-brand">AI</span></h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted/60">Franky is online</p>
        </div>
      </header>

      <GlassCard className="flex-1 flex flex-col min-h-0 bg-white/60 border-black/5 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-3 max-w-[85%]", m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}>
              <div className={cn(
                "h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-xs font-black",
                m.role === "assistant" ? "bg-black text-white" : "bg-white border border-black/10 text-black"
              )}>
                {m.role === "assistant" ? "F" : "U"}
              </div>
              <div className={cn(
                "rounded-2xl p-4 text-sm leading-relaxed font-medium",
                m.role === "assistant" 
                  ? "bg-white border border-black/5 text-black shadow-sm" 
                  : "bg-brand text-white shadow-xl shadow-brand/10"
              )}>
                {renderContent(m.content)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 mr-auto items-center">
              <div className="h-8 w-8 bg-black text-white flex items-center justify-center rounded-full text-xs font-black animate-pulse">F</div>
              <div className="flex gap-1.5 p-4 rounded-2xl bg-white border border-black/5 shadow-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-black/5 bg-gray-50/50 backdrop-blur-md">
           <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Franky for style advice..."
                className="input pr-12 h-14 bg-white border border-black/10 focus:border-brand focus:ring-0 shadow-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg bg-black text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send size={16} />
              </button>
           </div>
           <p className="mt-4 text-[9px] text-center text-muted font-black uppercase tracking-[0.3em] opacity-30">
              Powered by Vertex AI Fashion Framework v4
           </p>
        </div>
      </GlassCard>
    </div>
  );
}
