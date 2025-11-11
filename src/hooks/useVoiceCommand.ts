/**
 * Voice Command Hook
 * 
 * Custom hook for Web Speech API integration.
 * Provides voice-to-text functionality for natural language commands.
 */

import { useState, useCallback, useEffect } from 'react'
import { toast } from '@/components/ui/Toast'

interface UseVoiceCommandReturn {
  isListening: boolean
  voiceSupported: boolean
  startListening: () => void
  transcript: string
}

export function useVoiceCommand(onTranscript: (text: string) => void): UseVoiceCommandReturn {
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const [transcript, setTranscript] = useState('')

  // Check voice support on mount
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    setVoiceSupported(supported)
  }, [])

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.warning('Voice input not supported', 'Please use Chrome, Edge, or Safari for voice commands')
      return
    }

    // @ts-ignore - TypeScript doesn't recognize webkit prefix
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      onTranscript(text)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      
      if (event.error === 'no-speech') {
        toast.warning('No speech detected', 'Please try speaking again')
      } else if (event.error === 'not-allowed') {
        toast.error('Microphone access denied', 'Please enable microphone permissions in your browser')
      } else {
        toast.error('Voice recognition error', event.error)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
    } catch (error) {
      console.error('Failed to start voice recognition:', error)
      toast.error('Failed to start voice recognition', 'Please try again')
      setIsListening(false)
    }
  }, [voiceSupported, onTranscript])

  return {
    isListening,
    voiceSupported,
    startListening,
    transcript,
  }
}
