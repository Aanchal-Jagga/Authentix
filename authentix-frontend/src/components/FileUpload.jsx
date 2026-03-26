import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'

export default function FileUpload({ onFileSelect, accept = 'image/*', label = 'Upload a file', multiple = false }) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')

  const handleFile = useCallback((file) => {
    if (!file) return
    setFileName(file.name)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
    onFileSelect?.(file)
  }, [onFileSelect])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0]
    handleFile(file)
  }, [handleFile])

  const reset = () => {
    setPreview(null)
    setFileName('')
    onFileSelect?.(null)
  }

  return (
    <div className="w-full">
      <motion.label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center min-h-[220px] rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-primary-400 bg-primary-50/50 scale-[1.02]'
            : preview
            ? 'border-accent-300 bg-accent-50/30'
            : 'border-gray-200 bg-white/40 hover:border-primary-300 hover:bg-primary-50/30'
        }`}
        whileHover={{ scale: preview ? 1 : 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative w-full p-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-xl object-contain"
            />
            <p className="text-center mt-3 text-sm text-gray-600">{fileName}</p>
            <button
              onClick={(e) => { e.preventDefault(); reset() }}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm"
            >
              ✕
            </button>
          </div>
        ) : fileName ? (
          <div className="text-center p-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-accent-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">{fileName}</p>
            <button
              onClick={(e) => { e.preventDefault(); reset() }}
              className="mt-2 text-xs text-red-400 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center">
              <svg className="w-7 h-7 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
            <p className="text-xs text-gray-400">Drag & drop or click to browse</p>
          </div>
        )}
      </motion.label>
    </div>
  )
}
