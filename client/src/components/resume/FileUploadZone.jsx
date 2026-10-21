/**
 * PrepPilot - PDF File Upload Dropzone
 * Drag-and-drop zone with client-side PDF verification and 5MB size limit validation.
 */

import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, CheckCircle, X } from 'lucide-react';

const FileUploadZone = ({ file, onFileSelected, onFileRemoved }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndSelect = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Invalid file type. Only PDF resumes are accepted.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit. Please upload a smaller PDF.');
      return;
    }

    onFileSelected(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="application/pdf"
        className="hidden"
      />

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-blue-50/20'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Click to upload or drag & drop your resume
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supports PDF format only (Max 5MB)
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-600 text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 max-w-xs truncate">
                {file.name}
              </p>
              <p className="text-xs text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; PDF document
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> Ready
            </span>
            <button
              type="button"
              onClick={onFileRemoved}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-red-500 mt-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default FileUploadZone;
