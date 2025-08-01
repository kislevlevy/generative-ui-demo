"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";
import { WeatherToday } from "./weather-today";
import { WeatherWeekly } from "./weather-weekly";
import { StockDisplay } from "./stock-display";

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    description: string;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    visibility: number;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    description: string;
    icon: string;
  }>;
}

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap?: string;
  lastUpdated: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  component?: "weather-today" | "weather-weekly" | "stock";
  data?: WeatherData | StockData;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. I can help you with general questions, show you weather information for any location, and display stock prices for any symbol. Just ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();

    // Focus input when AI responds (last message is from assistant and we're not loading)
    if (
      messages.length > 1 &&
      messages[messages.length - 1].role === "assistant" &&
      !isLoading
    ) {
      focusInput();
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        component: data.component,
        data: data.data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (message: Message) => {
    if (message.component === "weather-today" && message.data) {
      return <WeatherToday data={message.data as WeatherData} />;
    }

    if (message.component === "weather-weekly" && message.data) {
      const weatherData = message.data as WeatherData & { userGender?: string };
      return (
        <WeatherWeekly
          data={weatherData}
          userGender={
            (weatherData.userGender as "boy" | "girl" | "unknown") || "unknown"
          }
        />
      );
    }

    if (message.component === "stock" && message.data) {
      return <StockDisplay data={message.data as StockData} />;
    }

    return <p className="text-gray-700">{message.content}</p>;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Bot className="h-6 w-6 text-blue-600" />
          AI Assistant with Generative UI
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Ask me about weather, stocks, or anything else!
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <Card
                className={`max-w-[90%] p-3 ${
                  message.role === "user"
                    ? "bg-blue-100 text-blue-900 border-blue-200"
                    : "bg-gray-100"
                }`}
              >
                {renderMessageContent(message)}
              </Card>

              {message.role === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="max-w-[80%] p-3 bg-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-gray-600 text-sm">Thinking...</span>
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about weather, stocks, or anything else..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
