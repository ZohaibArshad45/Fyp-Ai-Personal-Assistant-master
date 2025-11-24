'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AuthContext } from '@/context/AuthContext'
import { api } from '@/convex/_generated/api'
import { useConvex } from 'convex/react'
import React, { useContext, useEffect, useState } from 'react'
import { ASSISTANT } from '../../ai-assistants/page'
import Image from 'next/image'
import { AssistantContext } from '@/context/AssistantContext'
import { BlurFade } from '@/components/magicui/blur-fade'
import Link from 'next/link'
import AddNewAssistant from './AddNewAssistant'

const AssistantsList = () => {
  const { user } = useContext(AuthContext)
  const convex = useConvex()
  const [assistantsList, SetAssistantsList] = useState<ASSISTANT[]>([])
  const { assistant, setAssistant } = useContext(AssistantContext)

  useEffect(() => {
    // if (!user) return;
    user && fetchAssistants()
  }, [user && assistant === null])

  const fetchAssistants = async () => {
    const result = await convex.query(api.userAiAssistants.GetAllUserAssistants, {
      uid: user._id,
    })
    console.log(result)
    SetAssistantsList(result)
  }

  //   fetchAssistants()
  // }, [user])

  return (
    <div className='p-5 bg-secondary border-r-[1px] h-screen relative'>


      <h2 className='font-bold text-lg'>Your Personal AI Assistants</h2>

      <AddNewAssistant>
        <Button className='w-full mt-3'>+ Add New Assistant</Button>

      </AddNewAssistant>
      <Input className='bg-white mt-3' placeholder='Search...' />

      <div className='mt-5 h-[400px] overflow-y-auto pr-2 custom-scrollbar'>
        {assistantsList.map((assistant_, index) => (
          <BlurFade key={assistant_.image} delay={0.25 + index * 0.05} inView>
            <div
              key={index}
              className={`p-4 cursor-pointer flex gap-3 items-center
        hover:bg-gray-200 hover:dark:bg-gray-800 rounded-xl
        ${assistant_.id === assistant?.id ? 'bg-gray-400' : ''}`}
              onClick={() => setAssistant(assistant_)}
            >
              <Image
                src={assistant_.image}
                alt={`${assistant_.name} Image`}
                width={60}
                height={60}
                className='rounded-xl w-[60px] h-[60px] object-cover'
              />
              <div>
                <h2 className='font-bold'>{assistant_.name}</h2>
                <h2 className='text-gray-600 text-sm dark:text-gray-300'>
                  {assistant_.title}
                </h2>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>



      <div className='absolute bottom-7 flex flex-col items-center bg-gray-700 text-white p-3 w-[87%] cursor-pointer rounded-xl'>

        <div className='flex gap-3'>
          {user?.picture ? (
            <Image
              src={user.picture}
              alt='User Profile'
              width={55}
              height={55}
              className='rounded-full'
            />
          ) : (
            <Image
              src='/default-avatar.png'
              alt='Default Avatar'
              width={35}
              height={35}
              className='rounded-full'
            />
          )}
          <div>
            <h2 className='font-bold'>{user?.name}</h2>
            <h2 className='text-gray-400 text-sm dark:text-gray-200'>
              {user?.orderId ? 'Pro Plan' : 'Free Plan'}
            </h2>
          </div>
        </div>
        <div className=' mt-2 flex gap-8 justify-between'>
          <Link href="/ai-assistants">
            <h2 className='cursor-pointer bg-gray-500 py-2 px-4 rounded-md hover:bg-gray-800 transition'>Ai Assistants</h2>
          </Link>

          <Link href="/">
            <h2 className='cursor-pointer bg-gray-500 px-4 py-2 rounded-md hover:bg-gray-800 transition'>Logout</h2>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default AssistantsList
