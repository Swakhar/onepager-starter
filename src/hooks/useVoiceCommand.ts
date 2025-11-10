/**
 * Voice Command Hook
 * 
 * Custom hook for Web Speech API integration.
 * Provides voice-to-text functionality for natural language commands.
 */

import { useState, useCallback, useEffect } from 'react'

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
    if (!voiceSupported) {
      alert('⚠️ Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.')
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
        alert('⚠️ No speech detected. Please try again.')
      } else if (event.error === 'not-allowed') {
        alert('⚠️ Microphone access denied. Please enable microphone permissions.')
      } else {
        alert(`⚠️ Voice recognition error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    try {
      recognition.start()
    } catch (error) {
      console.error('Failed to start speech recognition:', error)
      setIsListening(false)
      alert('❌ Failed to start voice recognition. Please try again.')
    }
  }, [voiceSupported, onTranscript])

  return {
    isListening,
    voiceSupported,
    startListening,
    transcript,
  }
}
