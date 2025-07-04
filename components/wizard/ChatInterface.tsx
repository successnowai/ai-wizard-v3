'use client'
import { useState, useEffect, useRef } from 'react'
import { AIAgent, ChatMessage } from '@/types'
import { Send, Bot, User, Sparkles, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { toast } from '@/components/ui/Toaster'

interface ChatInterfaceProps {
  agent: AIAgent
  projectId: string
  stepNumber: number
  formData: Record<string, any>
  onFormSuggestion: (suggestions: Record<string, any>) => void
}

export function ChatInterface({ 
  agent, 
  projectId, 
  stepNumber, 
  formData, 
  onFormSuggestion 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasIntroduced, setHasIntroduced] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Load existing chat history
    loadChatHistory()
  }, [projectId, stepNumber])

  useEffect(() => {
    // Send intro message if this is first time
    if (agent && !hasIntroduced && messages.length === 0) {
      sendIntroMessage()
    }
  }, [agent, hasIntroduced, messages.length])

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom()
  }, [messages])

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/chat/${projectId}/${stepNumber}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
        setHasIntroduced(data.messages?.length > 0)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  const sendIntroMessage = () => {
    if (!agent.intro_message) return

    const introMessage: ChatMessage = {
      id: `intro-${Date.now()}`,
      role: 'assistant',
      content: agent.intro_message,
      timestamp: new Date().toISOString()
    }

    setMessages([introMessage])
    setHasIntroduced(true)
    saveChatHistory([introMessage])
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const saveChatHistory = async (messagesToSave: ChatMessage[]) => {
    try {
      await fetch(`/api/chat/${projectId}/${stepNumber}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToSave })
      })
    } catch (error) {
      console.error('Error saving chat history:', error)
    }
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat/ai-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          agent: agent,
          formData: formData,
          stepNumber: stepNumber
        })
      })

      if (!response.ok) throw new Error('Failed to get AI response')

      const data = await response.json()
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        metadata: data.suggestions ? { suggestions: data.suggestions } : undefined
      }

      const finalMessages = [...newMessages, aiMessage]
      setMessages(finalMessages)
      saveChatHistory(finalMessages)

      // Apply form suggestions if provided
      if (data.suggestions) {
        onFormSuggestion(data.suggestions)
      }

    } catch (error) {
      console.error('Error getting AI response:', error)
      
      // Use fallback response
      const fallbackMessage: ChatMessage = {
        id: `fallback-${Date.now()}`,
        role: 'assistant',
        content: agent.fallback_responses[0] || "I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString()
      }

      const finalMessages = [...newMessages, fallbackMessage]
      setMessages(finalMessages)
      saveChatHistory(finalMessages)
      
      toast.error('AI response failed, using fallback')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Copied to clipboard')
  }

  const applySuggestions = (suggestions: Record<string, any>) => {
    onFormSuggestion(suggestions)
    toast.success('Suggestions applied to form')
  }

  const generateInsights = async () => {
    if (!formData || Object.keys(formData).length === 0) {
      toast.error('Please fill out some form fields first')
      return
    }

    setIsLoading(true)
    
    const insightMessage: ChatMessage = {
      id: `insight-request-${Date.now()}`,
      role: 'user',
      content: 'Based on my form inputs, can you provide insights and recommendations?',
      timestamp: new Date().toISOString()
    }

    try {
      const response = await fetch('/api/chat/generate-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: agent,
          formData: formData,
          stepNumber: stepNumber
        })
      })

      if (!response.ok) throw new Error('Failed to generate insights')

      const data = await response.json()
      
      const aiInsight: ChatMessage = {
        id: `ai-insight-${Date.now()}`,
        role: 'assistant',
        content: data.insights,
        timestamp: new Date().toISOString(),
        metadata: data.suggestions ? { suggestions: data.suggestions } : undefined
      }

      const finalMessages = [...messages, insightMessage, aiInsight]
      setMessages(finalMessages)
      saveChatHistory(finalMessages)

      if (data.suggestions) {
        onFormSuggestion(data.suggestions)
      }

    } catch (error) {
      console.error('Error generating insights:', error)
      toast.error('Failed to generate insights')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass-card flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-bright-blue rounded-full flex items-center justify-center mr-3">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal">{agent.name}</h3>
            <p className="text-sm text-gray-500">{agent.role}</p>
          </div>
        </div>
        <button
          onClick={generateInsights}
          disabled={isLoading || Object.keys(formData).length === 0}
          className="btn-accent text-sm py-2 px-4 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Generate Insights
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onCopy={copyMessage}
            onApplySuggestions={applySuggestions}
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${agent.name} anything...`}
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-bright-blue focus:border-bright-blue"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="btn-primary px-4 py-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface MessageBubbleProps {
  message: ChatMessage
  onCopy: (content: string) => void
  onApplySuggestions: (suggestions: Record<string, any>) => void
}

function MessageBubble({ message, onCopy, onApplySuggestions }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const suggestions = message.metadata?.suggestions

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          {isUser ? (
            <div className="w-8 h-8 bg-bright-blue rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`rounded-lg p-3 ${isUser ? 'bg-bright-blue text-white' : 'bg-gray-100 text-charcoal'}`}>
          <div className="whitespace-pre-wrap">{message.content}</div>
          
          {/* Suggestions */}
          {suggestions && (
            <div className="mt-3 pt-3 border-t border-gray-300">
              <p className="text-sm font-medium mb-2">Form Suggestions:</p>
              <button
                onClick={() => onApplySuggestions(suggestions)}
                className="text-sm bg-white text-charcoal px-3 py-1 rounded hover:bg-gray-50"
              >
                Apply to Form
              </button>
            </div>
          )}
          
          {/* Message Actions */}
          <div className={`flex items-center justify-between mt-2 pt-2 border-t ${isUser ? 'border-blue-400' : 'border-gray-300'}`}>
            <span className="text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => onCopy(message.content)}
                className={`text-xs opacity-70 hover:opacity-100 ${isUser ? 'text-white' : 'text-gray-600'}`}
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
