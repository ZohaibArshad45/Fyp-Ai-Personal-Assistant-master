'use client'

import { AuthContext } from '@/context/AuthContext'
import Image from 'next/image'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Header = () => {
  const { user } = useContext(AuthContext)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm px-6 py-3 flex items-center justify-between">
      {/* App Logo */}
      <div className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="App Logo"
          width={40}
          height={40}
          className="w-10 h-10"
        />
          <Link href="/">
        <span className="text-lg font-semibold text-gray-800 dark:text-white">
            AI Assistant
        </span>
          </Link>
      </div>

      {/* Right Side: Sign In or Avatar */}
      <div>
        {user?.picture ? (
          <Image
            src={user.picture}
            alt="User Profile"
            width={40}
            height={40}
            className="rounded-full border border-gray-300 dark:border-gray-600"
          />
        ) : (
          <Link href="/sign-in">
            <Button className="text-sm px-4 py-2">Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
