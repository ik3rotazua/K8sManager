import React, { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
  helperText?: string;
  errorText?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.yaml,.yml',
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'Upload a file',
  helperText,
  errorText,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return false;
    }

    // Check file type if accept is specified
    if (accept && accept !== '*') {
      const fileType = file.name.toLowerCase().split('.').pop() || '';
      const acceptedTypes = accept.split(',').map(type => 
        type.trim().replace('.', '').toLowerCase()
      );
      
      if (!acceptedTypes.includes(fileType)) {
        setError(`File type not supported. Accepted types: ${accept}`);
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setFile(file);
      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    onFileSelect(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {label && <p className="mb-2 text-sm font-medium text-gray-700">{label}</p>}
      
      {!file ? (
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center
            transition-colors cursor-pointer hover:bg-gray-50
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          <Upload className={`w-10 h-10 mb-3 ${error ? 'text-red-500' : 'text-gray-400'}`} />
          <p className="mb-2 text-sm font-medium text-gray-700">
            Drag and drop your file here, or click to select
          </p>
          {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
          <input
            id="fileInput"
            type="file"
            autoComplete='off'
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="flex items-center p-4 space-x-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {(error || errorText) && (
        <p className="mt-2 text-sm text-red-600">{error || errorText}</p>
      )}
    </div>
  );
};

export default FileUpload;