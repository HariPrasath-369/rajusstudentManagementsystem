import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, FileSpreadsheet, FileArchive } from 'lucide-react';
import { motion } from 'framer-motion';

const FileUpload = ({
  onUpload,
  accept = '*/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 5,
  disabled = false,
  label = 'Upload Files',
  className = '',
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image size={24} />;
    if (fileType === 'application/pdf') return <FileText size={24} />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <FileSpreadsheet size={24} />;
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return <FileArchive size={24} />;
    return <File size={24} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    if (file.size > maxSize) {
      return `File ${file.name} exceeds maximum size of ${formatFileSize(maxSize)}`;
    }
    if (accept !== '*/*' && !accept.split(',').some(type => {
      if (type.includes('/*')) {
        const category = type.split('/')[0];
        return file.type.startsWith(category);
      }
      return file.type === type;
    })) {
      return `File type ${file.type} is not supported`;
    }
    return null;
  };

  const handleFiles = (selectedFiles) => {
    setError(null);
    const newFiles = [];
    const errors = [];

    Array.from(selectedFiles).forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
      } else {
        newFiles.push({
          id: Math.random().toString(36),
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          progress: 0,
          status: 'pending',
        });
      }
    });

    if (errors.length > 0) {
      setError(errors[0]);
    }

    if (!multiple && newFiles.length + files.length > 1) {
      setError('Only one file can be uploaded at a time');
      return;
    }

    if (newFiles.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  };

  const handleChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    for (const fileItem of files) {
      if (fileItem.status === 'completed') continue;
      
      try {
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'uploading' } : f
        ));

        await onUpload(fileItem.file, (progress) => {
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, progress } : f
          ));
        });

        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'completed' } : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileItem.id ? { ...f, status: 'error', error: error.message } : f
        ));
      }
    }
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
          ${dragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
        <Upload className="mx-auto mb-4 text-gray-400" size={48} />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          {dragActive ? 'Drop files here' : label}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          or click to browse
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
          Max size: {formatFileSize(maxSize)} | Supported: {accept === '*/*' ? 'All files' : accept}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Files to upload ({files.length}/{maxFiles})
          </h4>
          {files.map((fileItem) => (
            <motion.div
              key={fileItem.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="text-primary-600 dark:text-primary-400">
                {getFileIcon(fileItem.file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {fileItem.file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(fileItem.file.size)}
                </p>
                {fileItem.status === 'uploading' && (
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${fileItem.progress}%` }}
                    />
                  </div>
                )}
                {fileItem.status === 'error' && (
                  <p className="text-xs text-red-500 mt-1">{fileItem.error}</p>
                )}
              </div>
              {fileItem.status !== 'uploading' && (
                <button
                  onClick={() => removeFile(fileItem.id)}
                  className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
              {fileItem.status === 'completed' && (
                <CheckCircle size={16} className="text-green-500" />
              )}
            </motion.div>
          ))}

          {/* Upload Button */}
          <button
            onClick={uploadFiles}
            disabled={files.every(f => f.status === 'completed')}
            className="w-full mt-3 btn-primary"
          >
            Upload {files.filter(f => f.status !== 'completed').length} files
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;