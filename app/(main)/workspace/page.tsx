"use client";

import React, { useState } from "react";
import AssistantsList from "./_components/AssistantsList";
import AssistantsSettings from "./_components/AssistantsSettings";
import ChatUi from "./_components/ChatUi";
import { Button } from "@/components/ui/button";
import { Menu, Settings, MessageSquare, Bot } from "lucide-react";

const Workspace = () => {
  const [activeTab, setActiveTab] = useState<
    "chat" | "assistants" | "settings"
  >("chat");

  const MobileTabs = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="flex">
        <Button
          variant="ghost"
          className={`flex-1 flex-col h-16 rounded-none ${
            activeTab === "assistants"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : ""
          }`}
          onClick={() => setActiveTab("assistants")}
        >
          <Bot className="w-5 h-5 mb-1" />
          <span className="text-xs">Assistants</span>
        </Button>

        <Button
          variant="ghost"
          className={`flex-1 flex-col h-16 rounded-none ${
            activeTab === "chat"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : ""
          }`}
          onClick={() => setActiveTab("chat")}
        >
          <MessageSquare className="w-5 h-5 mb-1" />
          <span className="text-xs">Chat</span>
        </Button>

        <Button
          variant="ghost"
          className={`flex-1 flex-col h-16 rounded-none ${
            activeTab === "settings"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : ""
          }`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-xs">Settings</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30 flex items-center px-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {activeTab === "chat" && "AI Assistant"}
          {activeTab === "assistants" && "My Assistants"}
          {activeTab === "settings" && "Settings"}
        </h1>
      </div>

      {/* Main Content */}
      <div className="h-full pt-14 lg:pt-0 pb-16 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
          {/* Desktop: Always visible */}
          <div className="hidden lg:block lg:col-span-1 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <AssistantsList />
          </div>

          <div className="hidden lg:block lg:col-span-3 bg-white dark:bg-gray-800">
            <ChatUi />
          </div>

          <div className="hidden lg:block lg:col-span-1 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <AssistantsSettings />
          </div>

          {/* Mobile: Tab-based content */}
          <div
            className={`
            lg:hidden h-full bg-white dark:bg-gray-800
            ${activeTab === "assistants" ? "block" : "hidden"}
          `}
          >
            <AssistantsList />
          </div>

          <div
            className={`
            lg:hidden h-full bg-white dark:bg-gray-800
            ${activeTab === "chat" ? "block" : "hidden"}
          `}
          >
            <ChatUi />
          </div>

          <div
            className={`
            lg:hidden h-full bg-white dark:bg-gray-800
            ${activeTab === "settings" ? "block" : "hidden"}
          `}
          >
            <AssistantsSettings />
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <MobileTabs />
    </div>
  );
};

export default Workspace;
