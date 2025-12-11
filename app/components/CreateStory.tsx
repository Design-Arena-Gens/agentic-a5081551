'use client'

import { useState } from 'react'

interface CreateStoryProps {
  onClose: () => void
  onCreate: (videoUrl: string, caption: string) => void
}

export default function CreateStory({ onClose, onCreate }: CreateStoryProps) {
  const [videoUrl, setVideoUrl] = useState('')
  const [caption, setCaption] = useState('')

  const sampleVideos = [
    'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (videoUrl && caption) {
      onCreate(videoUrl, caption)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create Story</h2>
          <button
            onClick={onClose}
            className="text-white text-3xl hover:scale-110 transition-transform"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Sample Videos
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {sampleVideos.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setVideoUrl(url)}
                  className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Sample {index + 1}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's happening?"
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:outline-none resize-none"
              rows={3}
              required
            />
          </div>

          {videoUrl && (
            <div className="rounded-lg overflow-hidden bg-black">
              <video
                src={videoUrl}
                className="w-full h-48 object-cover"
                controls
              />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium transition-all"
            >
              Share Story
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
