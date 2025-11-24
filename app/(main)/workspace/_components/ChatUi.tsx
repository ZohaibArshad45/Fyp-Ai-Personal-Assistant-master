"use client";

import { AssistantContext } from "@/context/AssistantContext";
import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Bot, User } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const ChatUi = () => {
  const { assistant } = useContext(AssistantContext);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Reset messages when switching assistant
  useEffect(() => {
    setMessages([]);
  }, [assistant]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !assistant) return;

    const userMsg = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/google-gemini", {
        userInput: input,
        userInstruction: assistant?.userInstruction,
        model: assistant?.aiModelId,
      });

      const aiMsg = {
        role: "assistant",
        content: response.data.content || "No response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = {
        role: "assistant",
        content: "❌ Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!assistant) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full text-gray-500 bg-gray-50">
        <Bot className="w-16 h-16 mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">No Assistant Selected</h3>
        <p className="text-sm">Please select an assistant to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3 bg-white shadow-sm">
        <Image
          src={assistant?.image || "/default-avatar.png"}
          alt="Assistant"
          width={45}
          height={45}
          className="rounded-lg border"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{assistant?.name}</h2>
          <p className="text-sm text-gray-600">{assistant?.title}</p>
        </div>
        {assistant?.userInstruction && (
          <div
            className="text-xs text-gray-500 max-w-xs truncate"
            title={assistant.userInstruction}
          >
            Instruction: {assistant.userInstruction.substring(0, 50)}...
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Bot className="w-20 h-20 mb-4 text-gray-300" />
            <h3 className="text-xl font-medium mb-2">
              Welcome to {assistant.name}
            </h3>
            <p className="text-center max-w-md">
              {assistant.userInstruction
                ? `I'm configured to: ${assistant.userInstruction}`
                : "How can I help you today?"}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 ${msg.role === "user" ? "ml-3" : "mr-3"}`}
                >
                  {msg.role === "user" ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <Image
                      src={assistant?.image || "/default-avatar.png"}
                      alt="Assistant"
                      width={32}
                      height={32}
                      className="rounded-full border"
                    />
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white border border-gray-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div
                    className={`text-xs mt-2 ${
                      msg.role === "user" ? "text-blue-100" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%]">
              <Image
                src={assistant?.image || "/default-avatar.png"}
                alt="Assistant"
                width={32}
                height={32}
                className="rounded-full border"
              />
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-3 items-end">
          <Textarea
            className="flex-1 resize-none bg-gray-50 border-gray-200 focus:border-blue-500 min-h-[60px] max-h-[120px]"
            placeholder={`Message ${assistant.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-blue-500 hover:bg-blue-600 h-[60px] px-6"
            size="lg"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Instruction Indicator */}
        {assistant?.userInstruction && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            Assistant following:{" "}
            <span className="font-medium">"{assistant.userInstruction}"</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUi;
