'use client'
import { BlurFade } from '@/components/magicui/blur-fade'
import { SparklesText } from '@/components/magicui/sparkles-text'
import { AssistantContext } from '@/context/AssistantContext'
import { ChevronRight } from 'lucide-react'
import React, { useContext } from 'react'


const EmptyChatState = () => {
    const { assistant, setAssistant } = useContext(AssistantContext)
  return (
    <div className=' flex flex-col items-center'>
        <SparklesText className='text-4xl text-center '>  How Can I Assist You</SparklesText>
        <div className='mt-7'>
                {
                    assistant?.sampleQuestions.map((suggestion:string, index:number)=>(
                        <BlurFade delay={0.25 * index}  key={index}>
                        <div>
                            <h2 className='mt-2 p-4 text-lg border rounded-xl hover:bg-gray-100 cursor-pointer flex justify-between gap-10'>
                                {suggestion}
                                <ChevronRight/>

                            </h2>
                        </div>
                        </BlurFade>
                    ))
                }
            </div>
    </div>
  )
}

export default EmptyChatState