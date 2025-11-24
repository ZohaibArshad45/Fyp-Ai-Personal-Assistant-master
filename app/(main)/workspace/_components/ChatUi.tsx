'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { SparklesText } from '@/components/magicui/sparkles-text'

const ChatUi = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const onSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call our Google Gemini API
      const response = await axios.post('/api/google-gemini', {
        userInput: input
      })

      const assistantResponse = response.data?.content || '⚠️ No response from AI.'

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: assistantResponse }
      ])
    } catch (err) {
      console.error('Google AI Error:', err)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '❌ Something went wrong while generating a response.' }
      ])
    }

    setIsLoading(false)
  }

  return (
    <div className='mt-20 p-6 relative h-[88vh] flex flex-col items-center'>

      {/* Header */}
      <div className='w-full max-w-3xl text-center mb-6'>
        <SparklesText>
          <h1 className='text-3xl text-gray-800'>How Can I Assist You?</h1>
        </SparklesText>
        <p className='text-xl font-bold text-gray-600'>Google Gemini AI</p>
        <p className='mt-2 text-sm text-gray-500 italic'>
          Try asking: <span className='font-medium'>"Can you solve my problem?"</span>
        </p>
      </div>

      {/* Messages */}
      <div className='flex flex-col gap-2 w-full max-w-3xl overflow-y-auto mb-28'>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg p-3 max-w-[90%] ${
              msg.role === 'user'
                ? 'bg-blue-100 self-end text-right'
                : 'bg-gray-100 self-start text-left'
            }`}
          >
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className='text-gray-500 italic self-start'>AI is typing...</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className='flex justify-between gap-5 p-5 fixed bottom-0 w-[95%] max-w-4xl bg-white'>
        <Input
          placeholder='Start typing here...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
        />
        <Button onClick={onSendMessage} disabled={isLoading}>
          <Send className={isLoading ? 'animate-pulse' : ''} />
        </Button>
      </div>

    </div>
  )
}

export default ChatUi
