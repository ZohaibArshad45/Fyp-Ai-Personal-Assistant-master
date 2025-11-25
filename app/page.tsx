"use client";

import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  MessageSquare,
  Zap,
  Users,
  Star,
  CheckCircle2,
  Play,
  Shield,
  Globe,
} from "lucide-react";
import Header from "./(main)/_components/Header";
// import Header from "./_components/Header";

const features = [
  {
    icon: Bot,
    title: "Multiple AI Assistants",
    description:
      "Choose from specialized AI assistants for different tasks - coding, writing, research, and more.",
    color: "blue",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Get instant responses and complete tasks in seconds with our optimized AI models.",
    color: "yellow",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your conversations are encrypted and we never share your data with third parties.",
    color: "green",
  },
  {
    icon: Globe,
    title: "Always Available",
    description:
      "Access your AI assistants anytime, anywhere across all your devices.",
    color: "purple",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Developer",
    content:
      "The code assistant has cut my debugging time in half. It's like having a senior developer available 24/7.",
    avatar: "/avatars/1.jpg",
  },
  {
    name: "Marcus Johnson",
    role: "Content Writer",
    content:
      "I use the writing assistant daily. It helps me brainstorm ideas and refine my content effortlessly.",
    avatar: "/avatars/2.jpg",
  },
  {
    name: "Elena Rodriguez",
    role: "Research Student",
    content:
      "The research assistant has been invaluable for my thesis. It summarizes papers and helps organize my thoughts.",
    avatar: "/avatars/3.jpg",
  },
];

const stats = [
  { number: "10K+", label: "Active Users" },
  { number: "50K+", label: "Tasks Completed" },
  { number: "99.9%", label: "Uptime" },
  { number: "4.8/5", label: "User Rating" },
];

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push("/workspace");
    } else {
      router.push("/sign-in");
    }
  };

  const handleTryDemo = () => {
    router.push("/ai-assistants");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20">
      {/* <Header /> */}
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                <span>Trusted by 10,000+ users worldwide</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Your Personal
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  AI Assistant
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mt-6 mb-8 max-w-2xl">
                Supercharge your productivity with intelligent AI assistants.
                From coding to content creation, research to analysis - get
                expert help instantly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  onClick={handleTryDemo}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Try Demo
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Free forever plan</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image/Animation */}
            <div className="relative">
              <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  {/* AI Assistant Cards */}
                  {[
                    { name: "Code Pro", emoji: "💻", color: "blue" },
                    { name: "Write Mate", emoji: "✍️", color: "green" },
                    { name: "Data Sense", emoji: "📊", color: "purple" },
                    { name: "Research Guru", emoji: "🔍", color: "orange" },
                  ].map((assistant, index) => (
                    <div
                      key={assistant.name}
                      className={`bg-gradient-to-br from-${assistant.color}-50 to-${assistant.color}-100 dark:from-${assistant.color}-900/20 dark:to-${assistant.color}-800/20 p-4 rounded-xl border border-${assistant.color}-200 dark:border-${assistant.color}-800`}
                    >
                      <div className="text-2xl mb-2">{assistant.emoji}</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {assistant.name}
                      </h3>
                    </div>
                  ))}
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium animate-bounce">
                  New
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-400 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Why Choose Our AI Assistants?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-3xl mx-auto">
              Designed to make your life easier and more productive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
                yellow: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
                green: "text-green-600 bg-green-100 dark:bg-green-900/30",
                purple: "text-purple-600 bg-purple-100 dark:bg-purple-900/30",
              };

              return (
                <div
                  key={index}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div
                    className={`w-12 h-12 ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Choose Your Assistants",
                description:
                  "Select from our specialized AI assistants based on your needs",
                icon: Users,
              },
              {
                step: "02",
                title: "Start Chatting",
                description:
                  "Begin conversations and get instant help with your tasks",
                icon: MessageSquare,
              },
              {
                step: "03",
                title: "Boost Productivity",
                description:
                  "Complete tasks faster and more efficiently than ever before",
                icon: Zap,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              What Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
              Join thousands of satisfied users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already working smarter with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={handleTryDemo}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
          <p className="text-blue-200 mt-4 text-sm">
            No credit card required • Free forever plan • Setup in 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Bot className="w-8 h-8" />
              <span className="text-2xl font-bold">AI Assistant</span>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Empowering individuals and teams with intelligent AI assistants to
              achieve more in less time.
            </p>
            <div className="flex justify-center gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
            <p className="text-gray-500 mt-8 text-sm">
              © 2024 AI Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
