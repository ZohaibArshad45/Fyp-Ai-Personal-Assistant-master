import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import AiAssistantsList from '@/services/AiAssistantsList'
import Image from 'next/image'

const AssistantAvtar = ({children, selectedImage}:any) => {
  return (
    <Popover>
  <PopoverTrigger>{children}</PopoverTrigger>
  <PopoverContent>
    <div className='flex gap-5 flex-wrap'>
        {
            AiAssistantsList.map((assistant, index)=>(
                <Image src={assistant.image} alt={assistant.name} key={index} width={80} height={80}
                className=' cursor-pointer w-[30px] h-[30px] object-cover rounded-lg'
                onClick={()=> selectedImage(assistant.image)}/>
            ))
        }
    </div>
  </PopoverContent>
</Popover>
  )
}

export default AssistantAvtar