"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import React, { useContext, useEffect, useState } from "react";
import { ASSISTANT } from "../../ai-assistants/page";
import Image from "next/image";
import { AssistantContext } from "@/context/AssistantContext";
import { BlurFade } from "@/components/magicui/blur-fade";
import Link from "next/link";
import AddNewAssistant from "./AddNewAssistant";
import { Search, LogOut, User, Crown } from "lucide-react";

const AssistantsList = () => {
  const { user } = useContext(AuthContext);
  const convex = useConvex();
  const [assistantsList, setAssistantsList] = useState<ASSISTANT[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { assistant, setAssistant } = useContext(AssistantContext);

  useEffect(() => {
    if (user) {
      fetchAssistants();
    }
  }, [user]);

  const fetchAssistants = async () => {
    try {
      const result = await convex.query(
        api.userAiAssistants.GetAllUserAssistants,
        {
          uid: user._id,
        }
      );
      console.log("Assistants fetched:", result);
      setAssistantsList(result);
    } catch (error) {
      console.error("Error fetching assistants:", error);
    }
  };

  // Filter assistants based on search query
  const filteredAssistants = assistantsList.filter(
    (assistant_) =>
      assistant_.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant_.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logout clicked");
  };

  return (
    <div className="p-5 bg-secondary border-r-[1px] h-screen relative flex flex-col">
      {/* Header */}
      <div className="flex-1">
        <h2 className="font-bold text-lg text-gray-800 dark:text-white">
          Your Personal AI Assistants
        </h2>

        <AddNewAssistant onAssistantAdded={fetchAssistants}>
          <Button className="w-full mt-3 bg-blue-500 hover:bg-blue-600">
            + Add New Assistant
          </Button>
        </AddNewAssistant>

        {/* Search Input */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            className="bg-white pl-10 border-gray-200 focus:border-blue-500"
            placeholder="Search assistants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Assistants List */}
        <div className="mt-5 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredAssistants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? (
                <>
                  <p>No assistants found for "{searchQuery}"</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                </>
              ) : (
                <>
                  <p>No assistants created yet</p>
                  <p className="text-sm mt-1">
                    Create your first assistant to get started
                  </p>
                </>
              )}
            </div>
          ) : (
            filteredAssistants.map((assistant_, index) => (
              <BlurFade
                key={assistant_.id || assistant_.image}
                delay={0.25 + index * 0.05}
                inView
              >
                <div
                  className={`p-4 cursor-pointer flex gap-3 items-center
                    hover:bg-gray-200 hover:dark:bg-gray-800 rounded-xl transition-colors duration-200
                    ${assistant_.id === assistant?.id ? "bg-blue-100 border border-blue-300 dark:bg-blue-900" : "bg-white dark:bg-gray-900"}`}
                  onClick={() => setAssistant(assistant_)}
                >
                  <Image
                    src={assistant_.image || "/default-avatar.png"}
                    alt={`${assistant_.name} Image`}
                    width={60}
                    height={60}
                    className="rounded-xl w-[60px] h-[60px] object-cover border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-gray-800 dark:text-white truncate">
                        {assistant_.name}
                      </h2>
                      {assistant_.id === assistant?.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm dark:text-gray-300 truncate">
                      {assistant_.title}
                    </p>
                    {assistant_.userInstruction && (
                      <p
                        className="text-xs text-gray-500 mt-1 truncate"
                        title={assistant_.userInstruction}
                      >
                        {assistant_.userInstruction.substring(0, 40)}...
                      </p>
                    )}
                  </div>
                </div>
              </BlurFade>
            ))
          )}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="bg-gray-700 text-white p-4 rounded-xl mt-auto">
        <div className="flex gap-3 items-center mb-3">
          {user?.picture ? (
            <Image
              src={user.picture}
              alt="User Profile"
              width={50}
              height={50}
              className="rounded-full border-2 border-gray-500"
            />
          ) : (
            <div className="w-[50px] h-[50px] bg-gray-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-300" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold truncate">{user?.name || "User"}</h2>
            <div className="flex items-center gap-2">
              {user?.orderId ? (
                <>
                  <Crown className="w-3 h-3 text-yellow-400" />
                  <span className="text-yellow-400 text-sm">Pro Plan</span>
                </>
              ) : (
                <span className="text-gray-400 text-sm">Free Plan</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-between">
          <Link href="/ai-assistants" className="flex-1">
            <Button
              variant="outline"
              className="w-full bg-gray-600 hover:bg-gray-500 border-gray-500 text-white"
            >
              AI Assistants
            </Button>
          </Link>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-gray-600 hover:bg-gray-500 border-gray-500 text-white"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssistantsList;
