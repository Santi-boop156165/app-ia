import { ImagePlus } from 'lucide-react';
import React from 'react';

interface Props {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedFile: File | null;
}

export const FileInput: React.FC<Props> = ({ onFileChange, fileInputRef, selectedFile }) => (
  <>
    <button
      onClick={() => fileInputRef.current?.click()}
      className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-400 rounded-2xl bg-blue-50 hover:bg-blue-100 transition"
    >
      <ImagePlus className="w-12 h-12 text-blue-600 mb-2" />
      <span className="text-blue-800 font-medium">
        {selectedFile ? 'Change Image' : 'Click to Select X-Ray Image'}
      </span>
    </button>
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={onFileChange}
      className="hidden"
    />
  </>
);
