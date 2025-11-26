"use client";

import { AssistantContext } from "@/context/AssistantContext";
import React, { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Send,
  Loader2,
  Bot,
  User,
  Code,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  Zap,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const ChatUi = () => {
  const { assistant, setAssistant } = useContext(AssistantContext);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Simple scroll to bottom function
  const scrollToBottom = (instant = false) => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: instant ? "auto" : "smooth",
        });
      }
    }, 50);
  };

  // Check if user needs to see scroll button
  const checkScrollPosition = () => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    setShowScrollButton(!isAtBottom);
  };

  // Handle scroll events
  const handleScroll = () => {
    checkScrollPosition();
  };

  // Function to format AI response with better styling
  const formatAIResponse = (text: string) => {
    if (!text) return text;

    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<u>$1</u>")
      .replace(/~~(.*?)~~/g, "<s>$1</s>")
      .replace(/^#+\s+/gm, "")
      .replace(/^[\*\-]\s+/gm, "")
      .replace(/^\d+\.\s+/gm, "")
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .trim();

    return formattedText;
  };

  // Function to detect and extract code blocks and important content
  const extractContentBlocks = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const importantRegex = /(IMPORTANT:|NOTE:|TIP:|WARNING:)(.*?)(?=\n\n|$)/gi;

    const segments: {
      type: "text" | "code" | "important" | "tip" | "warning";
      content: string;
      language?: string;
      code?: string;
      icon?: any;
    }[] = [];

    let match;
    let lastIndex = 0;

    // First, extract code blocks
    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        extractImportantContent(textBefore, segments);
      }

      // Add code block
      const language = match[1] || "text";
      const code = match[2].trim();
      segments.push({
        type: "code",
        content: match[0],
        language,
        code,
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last code block
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      extractImportantContent(remainingText, segments);
    }

    return segments.length > 0 ? segments : [{ type: "text", content: text }];
  };

  // Helper function to extract important content
  const extractImportantContent = (text: string, segments: any[]) => {
    const importantRegex = /(IMPORTANT:|NOTE:|TIP:|WARNING:)(.*?)(?=\n\n|$)/gis;
    let match;
    let lastIndex = 0;

    while ((match = importantRegex.exec(text)) !== null) {
      // Add normal text before important section
      if (match.index > lastIndex) {
        segments.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }

      // Add important section
      const type = match[1].toLowerCase().replace(":", "");
      const content = match[2].trim();

      let segmentType: "important" | "tip" | "warning" = "important";
      let icon = Lightbulb;

      if (type === "tip") {
        segmentType = "tip";
        icon = Zap;
      } else if (type === "warning") {
        segmentType = "warning";
        icon = AlertCircle;
      }

      segments.push({
        type: segmentType,
        content: content,
        icon: icon,
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining normal text
    if (lastIndex < text.length) {
      segments.push({
        type: "text",
        content: text.slice(lastIndex),
      });
    }
  };

  // Copy code to clipboard
  const copyToClipboard = async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Reset messages when switching assistant
  useEffect(() => {
    setMessages([]);
    setShowScrollButton(false);
  }, [assistant]);

  // Scroll when new messages are added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check scroll position on mount and resize
  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !assistant) return;

    const userMsg = {
      id: Date.now(),
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
        userInstruction:
          assistant?.userInstruction +
          " Please provide well-structured responses with clear headings, code blocks when needed, and highlight IMPORTANT points. Use markdown formatting for better readability.",
        model: assistant?.aiModelId,
      });

      const formattedContent = formatAIResponse(response.data.content);

      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: formattedContent,
        timestamp: new Date(),
        segments: extractContentBlocks(formattedContent),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        segments: [
          {
            type: "text",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ],
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

  // Scroll to bottom button component
  const ScrollToBottomButton = () => {
    if (!showScrollButton) return null;

    return (
      <Button
        onClick={() => scrollToBottom(true)}
        className="fixed bottom-20 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full w-12 h-12 p-0 shadow-lg z-50 transition-all duration-300 hover:scale-110"
        size="sm"
      >
        <ChevronDown className="w-5 h-5" />
      </Button>
    );
  };

  // Render different types of content with beautiful styling
  const renderMessageContent = (message: any) => {
    const segments = message.segments || extractContentBlocks(message.content);

    return (
      <div className="space-y-4">
        {segments.map((segment: any, index: number) => {
          // Code blocks
          if (segment.type === "code") {
            return (
              <div key={index} className="relative group">
                <div className="flex items-center justify-between bg-gradient-to-r from-gray-800 to-gray-900 text-gray-200 px-4 py-3 rounded-t-lg border-b border-gray-600">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium bg-gray-700 px-2 py-1 rounded">
                      {segment.language}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    onClick={() => copyToClipboard(segment.code, message.id)}
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap border border-gray-700">
                  {segment.code}
                </pre>
              </div>
            );
          }

          // Important notes
          else if (segment.type === "important") {
            const Icon = segment.icon || Lightbulb;
            return (
              <div
                key={index}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Important
                    </h4>
                    <div className="text-blue-700 leading-relaxed whitespace-pre-wrap">
                      {segment.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Tips
          else if (segment.type === "tip") {
            const Icon = segment.icon || Zap;
            return (
              <div
                key={index}
                className="bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Pro Tip
                    </h4>
                    <div className="text-green-700 leading-relaxed whitespace-pre-wrap">
                      {segment.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Warnings
          else if (segment.type === "warning") {
            const Icon = segment.icon || AlertCircle;
            return (
              <div
                key={index}
                className="bg-orange-50 border border-orange-200 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800 mb-2">
                      Warning
                    </h4>
                    <div className="text-orange-700 leading-relaxed whitespace-pre-wrap">
                      {segment.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Regular text
          else {
            return (
              <div
                key={index}
                className="whitespace-pre-wrap leading-relaxed text-gray-800 text-[15px] leading-7"
                dangerouslySetInnerHTML={{ __html: segment.content }}
              />
            );
          }
        })}
      </div>
    );
  };

  if (!assistant) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <Bot className="w-20 h-20 mb-4 text-gray-400 mx-auto" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No Assistant Selected
          </h3>
          <p className="text-gray-500">
            Please select an assistant to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="p-4 border-b bg-white/80 backdrop-blur-sm flex items-center gap-3 shadow-sm">
        <div className="relative">
          <Image
            src={assistant?.image || "/default-avatar.png"}
            alt="Assistant"
            width={50}
            height={50}
            className="rounded-xl border-2 border-white shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-lg text-gray-800">{assistant?.name}</h2>
          <p className="text-sm text-gray-600">{assistant?.title}</p>
        </div>
        {assistant?.userInstruction && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            <Sparkles className="w-3 h-3" />
            <span className="max-w-xs truncate">
              {assistant.userInstruction.substring(0, 40)}...
            </span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6"
        onScroll={handleScroll}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-gray-200 max-w-md">
              <Bot className="w-16 h-16 mb-4 text-blue-500 mx-auto" />
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Welcome to {assistant.name}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {assistant.userInstruction
                  ? `I'm here to help you with: ${assistant.userInstruction}`
                  : "How can I assist you today? Feel free to ask me anything!"}
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[90%] lg:max-w-[80%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 ${msg.role === "user" ? "ml-3" : "mr-3"}`}
                >
                  {msg.role === "user" ? (
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <div className="relative">
                      <Image
                        src={assistant?.image || "/default-avatar.png"}
                        alt="Assistant"
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Message Content */}
                <div
                  className={`px-5 py-4 rounded-2xl shadow-sm transition-all duration-300 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md"
                      : "bg-white border border-gray-200 rounded-bl-md shadow-sm hover:shadow-md"
                  }`}
                >
                  {renderMessageContent(msg)}

                  <div
                    className={`text-xs mt-3 ${
                      msg.role === "user" ? "text-blue-100" : "text-gray-500"
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
              <div className="relative">
                <Image
                  src={assistant?.image || "/default-avatar.png"}
                  alt="Assistant"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  <div>
                    <span className="text-gray-700 font-medium">Thinking</span>
                    <div className="flex gap-1 mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      <ScrollToBottomButton />

      {/* Input Area */}
      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <div className="flex gap-3 items-end">
          <Textarea
            className="flex-1 resize-none bg-white border-gray-300 focus:border-blue-500 min-h-[60px] max-h-[120px] rounded-xl shadow-sm transition-all duration-300 focus:shadow-md"
            placeholder={`Ask ${assistant.name} anything...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white h-[60px] px-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
            size="lg"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Instruction Indicator */}
        {assistant?.userInstruction && (
          <div className="mt-3 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs border border-blue-200">
              <Sparkles className="w-3 h-3" />
              <span>Assistant is configured with custom instructions</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUi;
