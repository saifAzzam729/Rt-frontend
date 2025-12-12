"use client"

import React, { useEffect, useState } from "react"

interface Word {
  text: string
  className?: string
}

interface TypewriterEffectProps {
  words: Word[]
  speed?: number
  delay?: number
  className?: string
  repeat?: number // Repeat interval in milliseconds
}

export function TypewriterEffect({
  words,
  speed = 100,
  delay = 0,
  className,
  repeat,
}: TypewriterEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [displayedWords, setDisplayedWords] = useState<Word[]>([])
  const [isStarted, setIsStarted] = useState(false)
  const [key, setKey] = useState(0) // Key to force re-render

  // Reset animation on key change and restart after delay
  useEffect(() => {
    setCurrentWordIndex(0)
    setCurrentCharIndex(0)
    setDisplayedWords([])
    setIsStarted(false)

    const timer = setTimeout(() => {
      setIsStarted(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [key, delay])

  useEffect(() => {
    if (!isStarted) return

    if (currentWordIndex < words.length) {
      if (currentCharIndex < words[currentWordIndex].text.length) {
        const timeout = setTimeout(() => {
          setDisplayedWords((prev) => {
            const newWords = [...prev]
            if (newWords[currentWordIndex]) {
              newWords[currentWordIndex] = {
                ...newWords[currentWordIndex],
                text: words[currentWordIndex].text.slice(0, currentCharIndex + 1),
              }
            } else {
              newWords.push({
                text: words[currentWordIndex].text.slice(0, currentCharIndex + 1),
                className: words[currentWordIndex].className,
              })
            }
            return newWords
          })
          setCurrentCharIndex((prev) => prev + 1)
        }, speed)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setCurrentWordIndex((prev) => prev + 1)
          setCurrentCharIndex(0)
        }, speed * 2)
        return () => clearTimeout(timeout)
      }
    }
  }, [currentCharIndex, currentWordIndex, words, speed, isStarted])

  // Repeat animation if repeat prop is set
  useEffect(() => {
    if (repeat && currentWordIndex === words.length && currentCharIndex === words[words.length - 1]?.text.length) {
      const timer = setTimeout(() => {
        setKey((prev) => prev + 1) // Force re-render to restart animation
      }, repeat)
      return () => clearTimeout(timer)
    }
  }, [currentWordIndex, currentCharIndex, words, repeat])

  const isTyping = currentWordIndex < words.length
  const showCursor = isTyping || (currentWordIndex === words.length && currentCharIndex === words[words.length - 1]?.text.length)

  return (
    <div className={className}>
      {displayedWords.map((word, idx) => {
        const isBlock = word.className?.includes('block')
        const Wrapper = isBlock ? 'div' : 'span'
        return (
          <Wrapper key={idx} className={word.className}>
            {word.text}
          </Wrapper>
        )
      })}
      {showCursor && <span className="inline-block w-0.5 h-8 bg-blue-700 animate-blink ml-1 align-middle"></span>}
    </div>
  )
}

