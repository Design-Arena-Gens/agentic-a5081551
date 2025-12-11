'use client'

import { useState, useEffect, useRef } from 'react'

interface MediaItem {
  type: 'video'
  url: string
  duration: number
  caption?: string
}

interface Story {
  id: number
  username: string
  avatar: string
  media: MediaItem[]
  timestamp: Date
  viewed: boolean
}

interface StoryViewerProps {
  stories: Story[]
  initialStoryId: number
  onClose: () => void
  onMarkViewed: (id: number) => void
}

export default function StoryViewer({ stories, initialStoryId, onClose, onMarkViewed }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(
    stories.findIndex(s => s.id === initialStoryId)
  )
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentStory = stories[currentStoryIndex]
  const currentMedia = currentStory?.media[currentMediaIndex]

  useEffect(() => {
    if (!currentStory) return

    onMarkViewed(currentStory.id)
  }, [currentStory, onMarkViewed])

  useEffect(() => {
    if (!currentMedia || isPaused) return

    setProgress(0)

    if (currentMedia.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }

    const duration = currentMedia.duration * 1000
    const intervalTime = 50
    const increment = (intervalTime / duration) * 100

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + increment
      })
    }, intervalTime)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [currentMedia, currentStoryIndex, currentMediaIndex, isPaused])

  const handleNext = () => {
    if (currentMediaIndex < currentStory.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1)
      setProgress(0)
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
      setCurrentMediaIndex(0)
      setProgress(0)
    } else {
      onClose()
    }
  }

  const handlePrevious = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1)
      setProgress(0)
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
      const prevStory = stories[currentStoryIndex - 1]
      setCurrentMediaIndex(prevStory.media.length - 1)
      setProgress(0)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const screenWidth = window.innerWidth

    if (touch.clientX < screenWidth / 3) {
      handlePrevious()
    } else if (touch.clientX > (screenWidth * 2) / 3) {
      handleNext()
    } else {
      setIsPaused(!isPaused)
      if (videoRef.current) {
        if (isPaused) {
          videoRef.current.play()
        } else {
          videoRef.current.pause()
        }
      }
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width

    if (x < width / 3) {
      handlePrevious()
    } else if (x > (width * 2) / 3) {
      handleNext()
    } else {
      setIsPaused(!isPaused)
      if (videoRef.current) {
        if (isPaused) {
          videoRef.current.play()
        } else {
          videoRef.current.pause()
        }
      }
    }
  }

  if (!currentStory || !currentMedia) return null

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl z-50 hover:scale-110 transition-transform"
      >
        ×
      </button>

      <div className="relative w-full h-full max-w-md mx-auto bg-black">
        <div className="absolute top-0 left-0 right-0 z-40 p-4">
          <div className="flex gap-1 mb-4">
            {currentStory.media.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: index < currentMediaIndex ? '100%' : index === currentMediaIndex ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <img
              src={currentStory.avatar}
              alt={currentStory.username}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <p className="text-white font-semibold">{currentStory.username}</p>
              <p className="text-white/70 text-sm">{timeAgo(currentStory.timestamp)}</p>
            </div>
          </div>
        </div>

        <div
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={handleClick}
          onTouchStart={handleTouchStart}
        >
          {currentMedia.type === 'video' && (
            <video
              ref={videoRef}
              src={currentMedia.url}
              className="w-full h-full object-contain"
              loop={false}
              playsInline
              muted
            />
          )}
        </div>

        {currentMedia.caption && (
          <div className="absolute bottom-8 left-0 right-0 px-6">
            <p className="text-white text-lg text-center bg-black/50 py-3 px-4 rounded-lg">
              {currentMedia.caption}
            </p>
          </div>
        )}

        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
