import React from 'react'
import AssistantsList from './_components/AssistantsList'
import AssistantsSettings from './_components/AssistantsSettings'
import ChatUi from './_components/ChatUi'

const Workspace = () => {
  return (
    <div className=' h-screen fixed w-full'>
        <div className='grid grid-cols-5'>
            <div className=' hidden md:block'>
                {/* Assistants List */}
                <AssistantsList/>
            </div>
            <div className=' md:col-span-4 lg:col-span-3'>
                {/* Chat UI */}
                <ChatUi/>
            </div>
            <div className=' hidden lg:block'>
                {/* Settings */}
                <AssistantsSettings/>
            </div>
        </div>
    </div>
  )
}

export default Workspace