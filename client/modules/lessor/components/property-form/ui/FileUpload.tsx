'use client';

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  /** Callback when files are selected */
  onFilesSelected: (files: File[]) => void;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Accepted file types */
  accept?: string;
  /** Maximum number of files */
  maxFiles?: number;
  /** Additional CSS classes */
  className?: string;
}

interface PreviewImage {
  file: File;
  url: string;
  id: string;
}

/**
 * FileUpload Component
 * Drag & drop file upload with image previews
 * Supports multiple file selection and drag/drop interactions
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  multiple = true,
  accept = 'image/*',
  maxFiles = 10,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Handle file selection
  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const validFiles = filesArray.slice(0, maxFiles - previews.length);

    // Create preview URLs for images
    const newPreviews: PreviewImage[] = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: `${file.name}-${Date.now()}-${Math.random()}`
    }));

    // Calculate updated previews
    const updatedPreviews = [...previews, ...newPreviews];

    // Update local state first
    setPreviews(updatedPreviews);

    // Pass ALL files to parent AFTER setState (not inside)
    const allFiles = updatedPreviews.map(p => p.file);
    console.log('[FileUpload] Calling onFilesSelected with', allFiles.length, 'files');
    console.log('[FileUpload] Files:', allFiles);
    onFilesSelected(allFiles);
  }, [maxFiles, previews, onFilesSelected]);

  // Handle drag enter
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  // Handle click to open file dialog
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Remove a preview image
  const removePreview = (id: string) => {
    const toRemove = previews.find(p => p.id === id);
    if (toRemove) {
      URL.revokeObjectURL(toRemove.url);
    }

    // Calculate updated previews
    const updatedPreviews = previews.filter(p => p.id !== id);

    // Update local state first
    setPreviews(updatedPreviews);

    // Notify parent with updated files array AFTER setState (not inside)
    const allFiles = updatedPreviews.map(p => p.file);
    onFilesSelected(allFiles);
  };

  // Clean up object URLs on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, []);

  const canAddMore = previews.length < maxFiles;

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          'relative p-8 sm:p-12 rounded-lg cursor-pointer',
          'border-2 border-dashed transition-all duration-200',
          'flex flex-col items-center justify-center min-h-[200px]',
          isDragging
            ? 'border-[#fdd76c] bg-[#fdd76c]/5'
            : 'border-[#042a5c]/30 bg-white hover:border-[#042a5c]/50',
          !canAddMore && 'opacity-50 cursor-not-allowed'
        )}
        role="button"
        tabIndex={0}
        aria-label="Upload area"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Upload Icon */}
        <svg
          className={cn(
            'w-12 h-12 mb-4',
            isDragging ? 'text-[#fdd76c]' : 'text-[#042a5c]'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        {/* Upload Text */}
        <p className="text-[#042a5c] text-center">
          <span className="font-medium">
            {isDragging
              ? 'Suelta las imágenes aquí'
              : 'Arrastra imágenes aquí o haz clic para seleccionar'}
          </span>
        </p>

        <p className="text-sm text-[#042a5c]/50 mt-2">
          {multiple
            ? `Máximo ${maxFiles} archivos (${previews.length}/${maxFiles})`
            : 'Solo un archivo permitido'}
        </p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={!canAddMore}
        />
      </div>

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-[#042a5c] mb-3">
            Imágenes cargadas ({previews.length})
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {previews.map((preview) => (
              <div
                key={preview.id}
                className="relative group aspect-square rounded-lg overflow-hidden bg-[#042a5c]/5"
              >
                <img
                  src={preview.url}
                  alt={preview.file.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay with file name */}
                <div className="absolute inset-0 bg-[#042a5c]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-2">
                  <p className="text-white text-xs text-center truncate w-full mb-2">
                    {preview.file.name}
                  </p>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePreview(preview.id);
                    }}
                    className="p-1 bg-white rounded-full hover:bg-[#fdd76c] transition-colors duration-200"
                    aria-label={`Eliminar ${preview.file.name}`}
                  >
                    <svg
                      className="w-4 h-4 text-[#042a5c]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Usage Example
/*
import { FileUpload } from './FileUpload';

function PropertyImagesStep() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    console.log('Files selected:', files);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold text-[#042a5c] mb-6">
        Agrega fotos de tu propiedad
      </h2>

      <FileUpload
        onFilesSelected={handleFilesSelected}
        multiple={true}
        accept="image/*"
        maxFiles={10}
      />

      <div className="mt-6">
        <p className="text-[#042a5c]">
          Total de archivos cargados: {uploadedFiles.length}
        </p>
      </div>
    </div>
  );
}
*/