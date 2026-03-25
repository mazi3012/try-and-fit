"use client";

import { useState, useRef, ReactNode } from "react";
import { Upload, Camera, FileImage, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
  onFileSelect: (file: File | null) => void;
  previewUrl?: string;
  label: string;
  className?: string;
}

export function Dropzone({ onFileSelect, previewUrl, label, className }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "group relative flex aspect-[3/4] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed transition-all duration-300",
        isDragging
          ? "border-brand bg-brand-light scale-[1.02]"
          : "border-white/10 bg-white/5 hover:border-brand/40 hover:bg-white/8",
        previewUrl ? "border-none p-0" : "p-6",
        className
      )}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        className="hidden"
        accept="image/*"
      />

      {previewUrl ? (
        <>
          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
             <div className="flex flex-col items-center gap-2">
                <Camera className="h-8 w-8 text-white" />
                <span className="text-sm font-medium text-white">Change Photo</span>
             </div>
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-4 right-4 z-10 rounded-full bg-black/60 p-1.5 text-white backdrop-blur-md transition-transform hover:scale-110"
          >
            <X className="h-4 w-4" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center text-center">
          <div className={cn(
            "mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand/20",
            isDragging && "scale-110 bg-brand/20"
          )}>
            <Upload className={cn("h-8 w-8 text-muted transition-colors", isDragging || "group-hover:text-brand")} />
          </div>
          <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
          <p className="max-w-[160px] text-xs text-muted">Drag & drop or click to upload</p>
        </div>
      )}
    </div>
  );
}
