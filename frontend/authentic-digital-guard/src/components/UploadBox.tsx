import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadBoxProps {
  label: string;
  accept: string;
  onFile: (file: File | null) => void;
}

const UploadBox = ({ label, accept, onFile }: UploadBoxProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');

  const handleFile = useCallback((file: File | null) => {
    if (!file) {
      setPreview(null);
      setFileName('');
      onFile(null);
      return;
    }
    setFileName(file.name);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onFile(file);
  }, [onFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const reset = () => {
    handleFile(null);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {preview || fileName ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="relative border-2 border-dashed border-primary/30 rounded-xl p-6 text-center"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto rounded-xl object-contain"
              />
            ) : (
              <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center">
                <Upload className="w-7 h-7 text-primary/40" />
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-3">{fileName}</p>
            <button
              onClick={reset}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted hover:bg-destructive/20 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.label
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 block ${
              isDragging
                ? 'border-primary/60 bg-primary/5 scale-[1.02]'
                : 'border-border hover:border-primary/40'
            }`}
          >
            <Upload className="w-10 h-10 text-primary/40 mx-auto mb-4" />
            <p className="text-foreground font-medium mb-1">{label}</p>
            <p className="text-muted-foreground text-sm">Drag & drop or click to browse</p>
            <input type="file" accept={accept} className="hidden" onChange={handleChange} />
          </motion.label>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadBox;
