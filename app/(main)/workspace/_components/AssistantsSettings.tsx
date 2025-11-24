'use client'
import { AssistantContext } from '@/context/AssistantContext'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { BlurFade } from '@/components/magicui/blur-fade'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AiModelOptions from '@/services/AiModelOptions'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2Icon, Save, Trash } from 'lucide-react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import ConfirmationAlert from '../ConfirmationAlert'


const AssistantsSettings = () => {
  const { assistant, setAssistant } = useContext(AssistantContext)
  const updateAssistant = useMutation(api.userAiAssistants.UpdateUserAiAssistant)
  const deleteAiAssistant = useMutation(api.userAiAssistants.DeleteAiAssistant)
  const [loading, setLoading] = useState(false)

  const onHandleInputChange = (field: string, value: string) => {
    setAssistant((prev: any) => ({
      ...prev,
      [field]: value
    }))

  }

  const onSave = async () => {
    setLoading(true)
    const result = await updateAssistant({
      id: assistant?._id,
      aiModelId: assistant?.aiModelId,
      userInstruction: assistant?.userInstruction
    })
    toast("Saved..!")
    setLoading(false)

  }

  const onDelete = async () => {
    // console.log("done")
    setLoading(true)
    await deleteAiAssistant({
      id: assistant?._id
    })
    setAssistant(null)
    setLoading(false)
  }


  return assistant && (
    <div className='p-5 bg-secondary border-l-[1px] h-screen'>
      <h1 className='font-bold text-xl'>Settings</h1>

      <BlurFade delay={0.25}>
        <div className='mt-5 flex gap-3'>
          <Image src={assistant?.image} alt='Assistant Image'
            width={100} height={100}
            className='rounded-xl h-[80px] w-[80px]' />
          <div>
            <h2 className=' font-bold text-xl'>{assistant?.name}</h2>
            <p className=''>{assistant?.title}</p>
          </div>
        </div>
      </BlurFade>
      <div className='mt-4'>
        <BlurFade delay={0.35}>
          <h2>Model:</h2>
          <Select defaultValue={assistant.aiModelId} onValueChange={(value) => onHandleInputChange('aiModelId', value)}>
            <SelectTrigger className="w-full mt-2 bg-white">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent >
              {
                AiModelOptions.map((model, index) => (
                  <SelectItem key={index} value={model.edenAi}>
                    <div className='flex text-center gap-3'>
                      <Image src={model.logo} alt='Model Image'
                        width={20} height={20} />

                      <h2 >{model.name}</h2>
                    </div>
                  </SelectItem>

                ))
              }
            </SelectContent>
          </Select>
        </BlurFade>
      </div>
      <div className='my-4'>
        <BlurFade delay={0.45}>
          <h2 className=' '>Instruction:</h2>
          <Textarea placeholder='Add Instruction '
            className='h-[180px] bg-white'
            value={assistant?.userInstruction}
            onChange={(e) => onHandleInputChange('userInstruction', e.target.value)} />
        </BlurFade>
      </div>

      <div className=' flex absolute bottom-10 right-5 gap-5'>
        <ConfirmationAlert onDelete={onDelete}>
          <Button variant={'ghost'} disabled={loading} ><Trash />Delete</Button>

        </ConfirmationAlert>
        <Button onClick={onSave} disabled={loading}>  {loading ? <Loader2Icon className=' animate-spin' /> : <Save />} Save</Button>
      </div>
    </div>
  )
}

export default AssistantsSettings