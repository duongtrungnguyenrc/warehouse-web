"use client";

import { Bot, Send, User, Wifi, WifiOff } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

import { MarkdownRenderer } from "@/components";
import { Avatar, AvatarFallback } from "@/components/shadcn/avatar";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { useAuth } from "@/hooks";
import { INTELLIGENT_URL } from "@/lib";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

function generateGreeting(): string {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 11) {
    return "Good morning";
  } else if (hour >= 11 && hour < 13) {
    return "Good noon";
  } else if (hour >= 13 && hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

const ChatbotPage = () => {
  const wsRef = useRef<WebSocket | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { token, user } = useAuth();

  useEffect(() => {
    if (token) {
      const ws = new WebSocket(`${INTELLIGENT_URL}?token=${token}`);
      wsRef.current = ws;

      ws.onopen = () => setIsConnected(true);
      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;
      };

      ws.onmessage = (event) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: event.data,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      };
    }

    return () => {
      wsRef.current?.close();
    };
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    wsRef.current.send(JSON.stringify({ query: input.trim() }));
    setInput("");
  };

  return (
    <Card className="w-full h-full flex flex-col shadow-xl">
      <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          AI Assistant
          <div className="ml-auto flex items-center gap-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-green-600">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-red-600">Disconnected</span>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="h-full px-4 py-2 overflow-y-auto">
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>
                  {generateGreeting()} {user?.fullName}, how can I assist you with your warehouse today?
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-blue-100 flex-shrink-0">
                    <AvatarFallback>
                      <Bot className="h-4 w-4 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 shadow-sm"}`}>
                  {message.role === "user" ? <p className="whitespace-pre-wrap">{message.content}</p> : <MarkdownRenderer content={message.content} />}
                  <div className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString("vi-VN")}</div>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 bg-green-100 flex-shrink-0">
                    <AvatarFallback>
                      <User className="h-4 w-4 text-green-600" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4 bg-white/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter your question..." className="flex-1" disabled={!isConnected} />
            <Button type="submit" disabled={!input.trim() || !isConnected} className="bg-blue-600 hover:bg-blue-700">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatbotPage;
