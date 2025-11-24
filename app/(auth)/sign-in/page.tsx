'use client'

import React, { useContext } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useGoogleLogin } from '@react-oauth/google'
import { GetAuthUserData } from '@/services/GlobalApi'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { AuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/app/(main)/_components/Header'

const SignIN = () => {
  const CreateUser = useMutation(api.users.CreateUser)
  const { user, setUser } = useContext(AuthContext)
  const router = useRouter()

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_token', tokenResponse.access_token)
      }

      const user = await GetAuthUserData(tokenResponse.access_token)

      const result = await CreateUser({
        name: user?.name,
        email: user?.email,
        picture: user.picture,
      })

      setUser(result)
      router.replace('/ai-assistants')
    },
    onError: (errorResponse) => console.log(errorResponse),
  })

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="flex flex-col items-center gap-6 p-10 rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-w-md w-full">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
            Sign In to Your AI Assistant
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Start chatting with your AI-powered personal assistant.
          </p>
          <Button onClick={() => googleLogin()} className="w-full text-base">
            Sign In with Gmail
          </Button>
        </div>
      </div>
    </>
  )
}

export default SignIN
