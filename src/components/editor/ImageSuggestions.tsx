import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface ImageSuggestion {
  id: string
  url: string
  thumbnail: string
  alt: string
  photographer: string
  photographerUrl: string
}

interface ImageSuggestionsProps {
  context: string
  onSelect: (imageUrl: string) => void
  orientation?: 'landscape' | 'portrait' | 'squarish'
}

export function ImageSuggestions({ context, onSelect, orientation = 'landscape' }: ImageSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<ImageSuggestion[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  const fetchImages = async (query: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/ai/suggest-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || context,
          orientation,
          count: 12,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch images')
      }

      setImages(data.images || [])
      
      if (data.message) {
        setError(data.message)
      }
    } catch (err: any) {
      console.error('Image fetch error:', err)
      setError(err.message || 'Failed to load images')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    if (images.length === 0) {
      fetchImages(context)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      fetchImages(searchQuery)
    }
  }

  const handleSelectImage = (image: ImageSuggestion) => {
    onSelect(image.url)
    setIsOpen(false)
  }

  return (
    <>
      {/* Trigger Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-blue-500/30 hover:border-blue-500/50 text-blue-300"
      >
        <span>🖼️</span>
        <span className="ml-2">Browse Images</span>
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border-2 border-blue-500/30 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-500/30 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                  <span>🖼️</span> Image Suggestions
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
              
              {/* Search */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search for "${context}" or try something else...`}
                  className="flex-1 px-4 py-2 bg-[#0f0f0f] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {isLoading ? '⏳' : '🔍'} Search
                </Button>
              </form>

              {error && (
                <p className="text-xs text-yellow-400 mt-2">💡 {error}</p>
              )}
            </div>

            {/* Images Grid */}
            <div className="flex-1 overflow-y-auto p-5">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading images...</p>
                  </div>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-20">
                  <span className="text-6xl block mb-4">🖼️</span>
                  <p className="text-gray-400">No images found. Try a different search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => handleSelectImage(image)}
                      className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gray-800 hover:border-blue-500 transition-all duration-200 hover:scale-105"
                    >
                      <img
                        src={image.thumbnail}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <p className="text-white text-xs font-medium mb-1">📸 Select Image</p>
                        <p className="text-gray-300 text-xs truncate">
                          by {image.photographer}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#0f0f0f] border-t border-gray-800 flex-shrink-0">
              <p className="text-xs text-gray-500 text-center">
                📸 Images from{' '}
                <a
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Unsplash
                </a>
                {' • '}Free to use
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
