import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';
import { Menu } from 'lucide-react';
import bgImage from './assets/medical-bg.jpg';
import { useImageSize } from './useImageSize';
import type { PredictionResponse } from './types';
import { ImagePreview } from './ImagePreview';

import hand1 from './assets/hand1.png';
import hand2 from './assets/hand2.png';
import hand3 from './assets/hand3.png';

import below1 from './assets/below1.png';
import below3 from "./assets/below3.png";
import { FileInput } from './ FileInput';
import { AssistantCard } from './AssistantCard';

export default function FractureUpload() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
    const [showAssistant, setShowAssistant] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const imageRef = useRef<HTMLImageElement>(null as unknown as HTMLImageElement);
  const imageSize = useImageSize(imageRef, [preview]);

const loadRealFileFromUrl = async (imageUrl: string): Promise<File> => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const name = imageUrl.split('/').pop() || 'image.jpg';
  return new File([blob], name, { type: blob.type });
};
const imagesData = [
  { name: "img1.jpg", src: hand1 },
  { name: "img2.jpg", src: hand2 },
  { name: "img3.jpg", src: hand3 },
  { name: "img4.jpg", src: below1 },
  { name: "img6.jpg", src: below3 },
];
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('https://fracture-api.52.201.253.226.sslip.io/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Menú hamburguesa */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="absolute top-6 left-6 z-50 p-2 bg-white rounded-full shadow-md hover:scale-105 transition"
      >
        <Menu className="w-6 h-6 text-blue-900" />
      </button>

      {/* Panel deslizable */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: menuOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl p-6 z-40"
      >
        <h2 className="text-2xl font-bold text-blue-800 mt-16">Images</h2>
        <div className="grid grid-cols-1 gap-4">
          {imagesData.map((img) => (
            <img
              key={img.name}
              src={img.src}
              alt={img.name}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("image-url", img.src); // clave personalizada
              }}
              className="cursor-pointer rounded-xl shadow hover:scale-105 transition object-cover w-full h-24 mt-6"
            />
          ))}
        </div>
      </motion.div>

      {/* Contenido central */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-2xl z-10"
        onDragOver={(e) => e.preventDefault()} // permite drop
        onDrop={async (e) => {
          e.preventDefault();
          const imageUrl = e.dataTransfer.getData("image-url");
          if (imageUrl) {
            try {
              const realFile = await loadRealFileFromUrl(imageUrl);
              setSelectedFile(realFile);
              setPreview(imageUrl);
              setResult(null);
            } catch (err) {
              console.error("Error loading image from URL", err);
            }
          }
        }}
      >
        <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-10 tracking-tight">
          Fracture Detection
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <FileInput
              onFileChange={handleFileChange}
              fileInputRef={fileInputRef}
              selectedFile={selectedFile}
            />
            {preview && (
              <ImagePreview
                preview={preview}
                result={result}
                imageRef={imageRef}
                imageSize={imageSize}
              />
            )}
          </div>

          <div className="flex-1 w-full flex flex-col items-center">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="w-full py-4 px-6 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-semibold rounded-2xl hover:scale-105 active:scale-100 transition disabled:opacity-50"
            >
              <UploadCloud className="w-6 h-6" />
              {loading ? "Analyzing..." : "Analyze X-Ray"}
            </button>

            {result && (
              <motion.div
                className="mt-8 w-full bg-blue-100 p-6 rounded-2xl text-blue-900 text-center shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-2xl font-semibold mb-2">
                  Diagnosis:{" "}
                  <span className="font-bold">
                    {result.fracture_result.class}
                  </span>
                </p>
                <p className="text-lg">
                  Bone type: {result.bone_type}
                  <br />
                  Hotspot: ({result.fracture_result.hotspot.x},{" "}
                  {result.fracture_result.hotspot.y})
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
      {/* Botón flotante de información */}
<button
  onClick={() => setShowAssistant(!showAssistant)}
  className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
  title="Asistente clínico"
>
  🧠
</button>

{showAssistant && (
<AssistantCard
  diagnosis={result?.fracture_result.class || null}
  boneType={result?.bone_type}
  hotspot={result?.fracture_result.hotspot}
  onClose={() => setShowAssistant(false)}
/>
)}

    </div>
  );
}