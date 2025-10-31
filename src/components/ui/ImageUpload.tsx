import React, { useCallback, useState, useRef } from 'react'
import { Button } from './Button'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  className?: string
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto'
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Upload Image',
  className = '',
  aspectRatio = 'auto',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/9]',
    auto: '',
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const imageFiles = files.filter((file) => file.type.startsWith('image/'))

      if (imageFiles.length > 0) {
        await handleFiles(imageFiles[0])
      }
    },
    []
  )

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFiles(files[0])
    }
  }, [])

  const handleFiles = async (file: File) => {
    setIsUploading(true)

    try {
      // For now, convert to base64 for demo purposes
      // In production, you'd upload to a cloud storage service
      const reader = new FileReader()
      
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPreview(base64String)
        onChange(base64String)
        setIsUploading(false)
      }

      reader.onerror = () => {
        console.error('Error reading file')
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      setIsUploading(false)
    }
  }

  const handleUrlInput = (url: string) => {
    setPreview(url)
    onChange(url)
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      {preview ? (
        <div className="relative group">
          <div
            className={`relative w-full ${aspectRatioClasses[aspectRatio]} ${
              !aspectRatio || aspectRatio === 'auto' ? 'min-h-[200px]' : ''
            } rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50`}
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setPreview('')}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white"
                >
                  Change
                </Button>
                <Button size="sm" variant="danger" onClick={handleRemove}>
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          } ${aspectRatioClasses[aspectRatio]}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl mb-4">📷</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isDragging ? 'Drop your image here' : 'Upload an image'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop or click to browse
              </p>
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                Choose File
              </Button>
              <p className="text-xs text-gray-400 mt-4">
                Supports: JPG, PNG, GIF, WebP (Max 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* URL Input Alternative */}
      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Or paste image URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={preview}
            onChange={(e) => handleUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {preview && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRemove}
              type="button"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
