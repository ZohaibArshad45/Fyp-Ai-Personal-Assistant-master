'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "./(main)/_components/Header"

export default function Home() {
  return (
    <>
      <Header /> 

      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 px-6 pt-24">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
              How Can I Assist You Today?
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Your AI-powered personal assistant is here to help — from answering questions
              to handling complex tasks.
            </p>
            <div className="flex gap-4">
              <Link href="/sign-in">
                <Button className="text-lg px-6 py-4 flex items-center">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link href="/sign-in">
                <Button variant="secondary" className="text-lg px-6 py-4">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center md:justify-end">
            <Image
              src="/thumbnail.png"
              alt="AI Assistant"
              width={500}
              height={500}
              className="rounded-xl object-cover shadow-xl"
              priority
            />
          </div>
        </div>
      </section>
    </>
  )
}
