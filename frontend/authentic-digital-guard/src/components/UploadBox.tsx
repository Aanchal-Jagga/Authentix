import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface UploadBoxProps {
  label: string;
  accept: string;
  onFile: (file: File) => void;
}

const UploadBox = ({ label, accept, onFile }: UploadBoxProps) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <motion.label
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/40 transition-colors block"
    >
      <Upload className="w-10 h-10 text-primary/40 mx-auto mb-4" />
      <p className="text-foreground font-medium mb-1">{label}</p>
      <p className="text-muted-foreground text-sm">Drag & drop or click to browse</p>
      <input type="file" accept={accept} className="hidden" onChange={handleChange} />
    </motion.label>
  );
};

export default UploadBox;
