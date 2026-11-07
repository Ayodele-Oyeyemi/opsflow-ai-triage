import { useState, useRef } from 'react';
import { Eye, Upload, FileText, Sparkles, Loader2, X } from 'lucide-react';

export default function SourceInspector({
  inputText,
  setInputText,
  uploadedFile,
  setUploadedFile,
  previewUrl,
  setPreviewUrl,
  onRunTriage,
  isProcessing,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleFileSelect = (file) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) return;
    setUploadedFile(file);
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasInput = inputText?.trim() || uploadedFile;

  return (
    <div className="w-[45%] bg-[#12121a] border-r border-[#2a2a3a] flex flex-col">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[#2a2a3a] flex items-center gap-2">
        <Eye className="w-4 h-4 text-violet-400" />
        <span className="text-sm font-medium">Source Inspector</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {/* File Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-violet-500 bg-violet-500/10'
              : uploadedFile
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-[#2a2a3a] bg-[#16161f] hover:border-[#4a4a6a] hover:bg-[#1a1a28]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf,.txt"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {uploadedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">{uploadedFile.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="p-1 rounded-md hover:bg-[#2a2a3a]"
              >
                <X className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
              <p className="text-sm text-[var(--text-secondary)]">
                Drag & drop a file here, or click to browse
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Supports .png, .jpg, .pdf, .txt (max 10MB)
              </p>
            </>
          )}
        </div>

        {/* File Preview */}
        {previewUrl && (
          <div className="rounded-xl border border-[#2a2a3a] overflow-hidden bg-[#16161f]">
            <img
              src={previewUrl}
              alt="Document preview"
              className="w-full max-h-48 object-contain"
            />
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#2a2a3a]" />
          <span className="text-xs text-[var(--text-muted)]">or paste text below</span>
          <div className="flex-1 h-px bg-[#2a2a3a]" />
        </div>

        {/* Text Area */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste document text, invoice content, form data..."
          className="flex-1 min-h-[200px] rounded-xl bg-[#16161f] border border-[#2a2a3a] p-4 text-sm font-mono text-[var(--text-secondary)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:border-[#4a4a6a] transition-colors"
        />
      </div>

      {/* Run Button */}
      <div className="p-5 border-t border-[#2a2a3a]">
        <button
          onClick={() => onRunTriage()}
          disabled={isProcessing || !hasInput}
          className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Run AI Triage
            </>
          )}
        </button>
      </div>
    </div>
  );
}

