"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { GetAuthUserData } from "@/services/GlobalApi";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Bot,
  Shield,
  Zap,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

const SignIn = () => {
  const CreateUser = useMutation(api.users.CreateUser);
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("user_token", tokenResponse.access_token);
        }

        const userData = await GetAuthUserData(tokenResponse.access_token);

        const result = await CreateUser({
          name: userData?.name,
          email: userData?.email,
          picture: userData.picture,
        });

        setUser(result);
        router.replace("/ai-assistants");
      } catch (error) {
        console.error("Login failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
      setIsLoading(false);
    },
  });

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email/password login logic here
    console.log("Email login:", formData);
  };

  const features = [
    {
      icon: Bot,
      title: "AI-Powered",
      description: "Multiple specialized assistants",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant responses",
    },
    {
      icon: Shield,
      title: "Secure",
      description: "Encrypted conversations",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.svg"
                  alt="AI Assistant Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 transition-transform group-hover:scale-110"
                  priority
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Assistant
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                New to AI Assistant?
              </span>
              {/* <Link href="/sign-up">
                <Button variant="outline" className="hidden sm:flex">
                  Create Account
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Login Form */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Welcome Back
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Sign in to continue to your AI Assistant
                    </p>
                  </div>

                  {/* Google Sign In */}
                  <Button
                    onClick={() => googleLogin()}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-12 text-base mb-6 border-gray-300 dark:border-gray-600 bg-blue-600 hover:bg-blue-700 hover:text-white text-white"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                    ) : (
                      <>
                        {/* <Image
                          src="/google.svg"
                          alt="Google"
                          width={20}
                          height={20}
                          className="mr-3"
                        /> */}
                        Continue with Google
                      </>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                        Or continue with email
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Encrypted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Features */}
            <div className="hidden lg:block">
              <div className="max-w-lg">
                <div className="mb-8">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Your AI-Powered
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                      Productivity Suite
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300">
                    Join thousands of users who are already boosting their
                    productivity with intelligent AI assistants.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {feature.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Testimonial */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
