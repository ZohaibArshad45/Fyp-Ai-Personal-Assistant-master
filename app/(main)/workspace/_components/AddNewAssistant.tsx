"use client";

import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";

import AiAssistantsList from "@/services/AiAssistantsList";
import AiModelOptions from "@/services/AiModelOptions";
import AssistantAvtar from "./AssistantAvtar";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

import { AuthContext } from "@/context/AuthContext";
import { AssistantContext } from "@/context/AssistantContext";
import type { ASSISTANT } from "../../ai-assistants/page";

const DEFAULT_ASSISTANT: ASSISTANT = {
  id: 0,
  name: "",
  title: "",
  image: "/bug-fixer.avif",
  instruction: "",
  userInstruction: "",
  sampleQuestions: [],
  aiModelId: "",
};

const AddNewAssistant = ({ children }: { children: React.ReactNode }) => {
  const [selectedAssistant, setSelectedAssistant] =
    useState<ASSISTANT>(DEFAULT_ASSISTANT);
  const [loading, setLoading] = useState(false);

  const addAssistant = useMutation(
    api.userAiAssistants.insertSelectedAssistants
  );
  const { user } = useContext(AuthContext);
  const { setAssistant } = useContext(AssistantContext);

  const handleInputChange = (field: keyof ASSISTANT, value: string) => {
    setSelectedAssistant((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const { name, title, userInstruction } = selectedAssistant;

    if (!name || !title || !userInstruction) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      await addAssistant({
        records: [selectedAssistant],
        uid: user?._id,
      });
      toast.success("New assistant added!");
      setAssistant(null);
      setSelectedAssistant(DEFAULT_ASSISTANT);
    } catch (error) {
      toast.error("Failed to save assistant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Assistant</DialogTitle>
          <DialogDescription asChild>
            <div className="grid grid-cols-3 gap-5 mt-4">
              {/* Sidebar */}
              <div className="border-r pr-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full mb-4"
                  onClick={() => setSelectedAssistant(DEFAULT_ASSISTANT)}
                >
                  + Create New Assistant
                </Button>

                <div className="space-y-2">
                  {AiAssistantsList.map((assistant, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 hover:bg-secondary rounded-lg cursor-pointer"
                      onClick={() => setSelectedAssistant(assistant)}
                    >
                      <Image
                        src={assistant.image}
                        alt={assistant.name}
                        width={35}
                        height={35}
                        className="rounded-lg object-cover"
                      />
                      <span className="text-sm">{assistant.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Form */}
              <div className="col-span-2 space-y-5">
                {/* Avatar and Basic Inputs */}
                <div className="flex items-start gap-4">
                  <AssistantAvtar
                    selectedImage={(v: string) => handleInputChange("image", v)}
                  >
                    <Image
                      src={selectedAssistant.image}
                      alt={selectedAssistant.title || "Assistant"}
                      width={100}
                      height={100}
                      className="w-[100px] h-[100px] object-cover rounded-xl cursor-pointer"
                    />
                  </AssistantAvtar>

                  <div className="flex flex-col gap-3 w-full">
                    <Input
                      placeholder="Name of Assistant"
                      value={selectedAssistant.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Title of Assistant"
                      value={selectedAssistant.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Model Selector */}
                <div>
                  <h2 className="text-sm text-muted-foreground mb-1">
                    Select Model
                  </h2>
                  <Select
                    defaultValue={selectedAssistant.aiModelId}
                    onValueChange={(value) =>
                      handleInputChange("aiModelId", value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AiModelOptions.map((model, index) => (
                        <SelectItem key={index} value={model.edenAi}>
                          <div className="flex items-center gap-2">
                            <Image
                              src={model.logo}
                              alt={model.name}
                              width={20}
                              height={20}
                            />
                            <span>{model.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Instruction Textarea */}
                <div>
                  <h2 className="text-sm text-muted-foreground mb-1">
                    User Instruction
                  </h2>
                  <Textarea
                    className="h-[150px]"
                    placeholder="Add instructions..."
                    value={selectedAssistant.userInstruction}
                    onChange={(e) =>
                      handleInputChange("userInstruction", e.target.value)
                    }
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <DialogClose>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedAssistant(DEFAULT_ASSISTANT)}
                    >
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button onClick={handleSave} disabled={loading}>
                    {loading && (
                      <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    <DialogClose>Save</DialogClose>
                  </Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewAssistant;
