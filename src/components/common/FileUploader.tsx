import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';
import { formatBytes } from '../../utils/download';

interface FileUploaderProps {
  accept: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  maxSizeMB = 100,
  multiple = false,
  onFilesSelected,
  title = 'Click to browse or drag & drop files here',
  subtitle = 'Supports standard student file formats securely in your browser (up to 100 MB)',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMsg(null);

    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxSizeBytes) {
        setErrorMsg(`File "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-theme-accent bg-theme-accent/10 scale-[1.01]'
            : 'border-theme-border hover:border-theme-accent/60 bg-theme-surface/40 hover:bg-theme-surface/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={e => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-theme-accent/15 border border-theme-accent/30 flex items-center justify-center text-theme-accent shadow-lg shadow-theme-accent/10">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-theme-text">{title}</h3>
            <p className="text-xs text-theme-text-muted mt-1">{subtitle}</p>
          </div>
          <div className="text-[11px] font-mono text-theme-text-muted bg-theme-bg px-2.5 py-1 rounded-full border border-theme-border">
            Max size: {maxSizeMB} MB {multiple ? '• Multiple files supported' : ''}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
