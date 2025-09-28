import React, { useRef } from 'react';
import UploadIcon from '../icons/UploadIcon';

interface FileUploadProps {
  onFileUpload: (data: any[]) => void;
  onError: (message: string) => void;
  label: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onError, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json') {
      onError('Invalid file type. Please upload a JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error('Could not read file.');
        const data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error('JSON file must contain an array of records.');
        onFileUpload(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to parse JSON file.';
        onError(`Import Error: ${message}`);
      }
    };
    reader.onerror = () => {
        onError('Failed to read the file.');
    };
    reader.readAsText(file);

    // Reset input to allow re-uploading the same file
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/json"
      />
      <button
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-stoneridge-green hover:bg-green-800"
      >
        <UploadIcon className="w-5 h-5" />
        {label}
      </button>
    </div>
  );
};

export default FileUpload;
