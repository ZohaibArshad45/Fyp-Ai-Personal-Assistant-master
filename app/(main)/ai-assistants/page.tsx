'use client'
import { BlurFade } from '@/components/magicui/blur-fade'
import { RainbowButton } from '@/components/magicui/rainbow-button'
import { SparklesText } from '@/components/magicui/sparkles-text'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthContext } from '@/context/AuthContext'
import { api } from '@/convex/_generated/api'
import AiAssistantsList from '@/services/AiAssistantsList'
import { useConvex, useMutation } from 'convex/react'
import { Loader, Loader2Icon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import Header from '../_components/Header'

export type ASSISTANT = {
    id: number,
    name: string,
    title: string,
    image: string,
    instruction: string,
    userInstruction: string,
    sampleQuestions: string[],
    aiModelId?:string
}

const AiAssistants = () => {
    const [selectAssistant, setSelectAssistant] = useState<ASSISTANT[]>([])
    const insertAssistant = useMutation(api.userAiAssistants.insertSelectedAssistants)
    const {user} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const convex = useConvex()
    const router = useRouter()
    
    

    useEffect(()=>{
        user && GetUserAssistants()
        
    },[user])

    const GetUserAssistants = async ()=>{
        const result = await convex.query(api.userAiAssistants.GetAllUserAssistants,{
            uid:user._id
        })
        console.log(result)
        if(result.length>0){
            // Navigate to New Screen
            router.replace('/workspace')
            result;
        }

    }

    const onSelect = (assistant: ASSISTANT) => {
        const item = selectAssistant.find((item: ASSISTANT) => item.id == assistant.id)

        if (item) {
            setSelectAssistant(selectAssistant.filter((item: ASSISTANT) => item.id !== assistant.id))
            return;
        }
        setSelectAssistant(prev => [...prev, assistant])


    }

    const IsAssistantSelected = (assistant: ASSISTANT) => {
        const item = selectAssistant.find((item: ASSISTANT) => item.id == assistant.id)
        return item ? true : false
    }

    // const OnClickContinue =async()=>{
    //     setLoading(true)
    //     const result = await insertAssistant({
    //         records:selectAssistant,
    //         uid:user?._id
    //     })
    //     setLoading(false)
    //     console.log(result)

    // }

    const OnClickContinue = async () => {
  if (!user) return;

  setLoading(true);

  try {
    const result = await insertAssistant({
      records: selectAssistant,
      uid: user._id,
    });

    console.log('Inserted assistants:', result);

    // ✅ Redirect after inserting assistants
    router.replace('/workspace');
  } catch (error) {
    console.error('Failed to insert assistants:', error);
  } finally {
    setLoading(false);
  }
};



    return (
        <div>
            <Header/>
        <div className='px-10 mt-20 md:px-28 lg:px-36 xl:px-48'>
            <div className='flex justify-between items-center'>
                <div>
                    <BlurFade delay={0.25} inView>

                        <h2 className='text-3xl font-bold'>Welcome to the<SparklesText className='text-5xl'>Personal AI Assistants🤖 </SparklesText></h2>
                    </BlurFade>
                    <BlurFade delay={0.25} inView>

                        <p className='text-xl mt-2'>Choose your AI Campanion to simplify Your Task 🚀</p>
                    </BlurFade>

                </div>
                <BlurFade delay={0.25} inView>
                    <RainbowButton disabled={selectAssistant?.length == 0 || loading}
                    onClick={OnClickContinue}>
                        {loading&&<Loader2Icon className='animate-spin'/>}
                        Continue
                        </RainbowButton>
                    </BlurFade>
            </div>
            <div className='mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
                {
                    AiAssistantsList.map((assistant, index) => (
                        <BlurFade key={assistant.image} delay={0.25 + index * 0.05} inView>

                            <div key={index} className='hover:border p-3 rounded-xl hover:scale-105 transition-all ease-in-out cursor-pointer relative'
                                onClick={() => onSelect(assistant)}>
                                <Checkbox className='absolute m-2' checked={IsAssistantSelected(assistant)} />
                                <Image src={assistant.image} alt={assistant.title}
                                    width={600} height={600}
                                    className='rounded-xl w-full h-[200px] object-cover'
                                />
                                <h2 className='text-center font-bold text-lg'>{assistant.name}</h2>
                                <h2 className='text-center text-gray-600 dark:text-gray-300'>{assistant.title}</h2>
                            </div>
                        </BlurFade>
                    ))
                }
            </div>

        </div>
        </div>
    )
}

export default AiAssistants