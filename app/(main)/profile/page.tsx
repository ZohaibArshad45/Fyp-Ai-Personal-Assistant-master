"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Bot, Crown, ArrowLeft } from "lucide-react";
import Header from "../_components/Header";

// Mock data for selected AI assistants
const selectedAssistants = [
  { id: 1, name: "Code Assistant", specialty: "Programming Help" },
  { id: 2, name: "Content Writer", specialty: "Content Creation" },
  { id: 3, name: "Research Helper", specialty: "Data Analysis" },
];

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  // Redirect if not authenticated
  if (!user) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="pt-20 pb-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Image
                  src={user.picture || "/default-avatar.png"}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-gray-300 dark:border-gray-600"
                />
                {/* Online Status Indicator */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  >
                    Online
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    <Crown className="w-3 h-3 mr-1" />
                    Free Plan
                  </Badge>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Name
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Email
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Plan */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Crown className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current Plan
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Free Tier
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
