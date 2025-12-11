'use client'

import { useState } from 'react'
import StoryViewer from './components/StoryViewer'
import CreateStory from './components/CreateStory'

export default function Home() {
  const [stories, setStories] = useState([
    {
      id: 1,
      username: 'travel_explorer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      media: [
        {
          type: 'video' as const,
          url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          duration: 15,
          caption: 'Exploring the mountains 🏔️'
        },
        {
          type: 'video' as const,
          url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          duration: 15,
          caption: 'Beach vibes 🌊'
        }
      ],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      viewed: false
    },
    {
      id: 2,
      username: 'food_lover',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      media: [
        {
          type: 'video' as const,
          url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          duration: 15,
          caption: 'Making pasta from scratch 🍝'
        }
      ],
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      viewed: false
    },
    {
      id: 3,
      username: 'fitness_pro',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      media: [
        {
          type: 'video' as const,
          url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          duration: 15,
          caption: 'Morning workout routine 💪'
        }
      ],
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      viewed: false
    }
  ])

  const [selectedStory, setSelectedStory] = useState<number | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  const handleStoryClick = (id: number) => {
    setSelectedStory(id)
  }

  const handleCloseStory = () => {
    setSelectedStory(null)
  }

  const handleMarkViewed = (id: number) => {
    setStories(stories.map(story =>
      story.id === id ? { ...story, viewed: true } : story
    ))
  }

  const handleCreateStory = (videoUrl: string, caption: string) => {
    const newStory = {
      id: stories.length + 1,
      username: 'you',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      media: [
        {
          type: 'video' as const,
          url: videoUrl,
          duration: 15,
          caption: caption
        }
      ],
      timestamp: new Date(),
      viewed: false
    }
    setStories([newStory, ...stories])
    setShowCreate(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Social Media Stories</h1>

        <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setShowCreate(true)}
            className="flex-shrink-0 flex flex-col items-center gap-2 group"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold hover:scale-110 transition-transform">
              +
            </div>
            <span className="text-white text-sm font-medium">Your Story</span>
          </button>

          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => handleStoryClick(story.id)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group"
            >
              <div className={`w-20 h-20 rounded-full p-0.5 ${
                story.viewed
                  ? 'bg-gray-400'
                  : 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600'
              }`}>
                <div className="w-full h-full rounded-full border-4 border-gray-900 overflow-hidden">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
              </div>
              <span className="text-white text-sm font-medium truncate max-w-[80px]">
                {story.username}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">About Video Stories</h2>
          <p className="mb-4">
            Create and share short video stories with your followers. Stories disappear after 24 hours,
            making them perfect for sharing casual, in-the-moment content.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Click the + button to create your own story</li>
            <li>Click on any avatar to view stories</li>
            <li>Stories with colored rings are unviewed</li>
            <li>Swipe or tap to navigate between stories</li>
          </ul>
        </div>
      </div>

      {selectedStory !== null && (
        <StoryViewer
          stories={stories}
          initialStoryId={selectedStory}
          onClose={handleCloseStory}
          onMarkViewed={handleMarkViewed}
        />
      )}

      {showCreate && (
        <CreateStory
          onClose={() => setShowCreate(false)}
          onCreate={handleCreateStory}
        />
      )}
    </main>
  )
}
