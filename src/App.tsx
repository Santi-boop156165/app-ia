import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ImagePlus, UploadCloud } from 'lucide-react';
import bgImage from './assets/medical-bg.jpg';

export default function FractureUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:8000/predict/', {
        method: 'POST',
        body: formData
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
    <div className="min-h-screen flex items-center justify-center bg-no-repeat bg-cover bg-center p-6" style={{ backgroundImage: `url(${bgImage})` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-blue-900 text-center mb-10 tracking-tight">Fracture Detection</h1>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full">
            <button
              onClick={() => fileInputRef.current.click()}
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
              onChange={handleFileChange}
              className="hidden"
            />

            {preview && (
              <div className="relative w-full mt-4 rounded-xl shadow border">
                <motion.img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-xl"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Dibuja círculo si se detectó fractura */}
                {result?.fracture_result?.class === 'fractured' && (
                  <div
                    className="absolute w-20 h-20 rounded-full border-4 border-red-600 shadow-md"
                    style={{
                      left: `${result.fracture_result.hotspot.x}px`,
                      top: `${result.fracture_result.hotspot.y}px`,
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none',
                      backgroundColor: 'transparent',
                    }}
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex-1 w-full flex flex-col items-center">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="w-full py-4 px-6 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-semibold rounded-2xl hover:scale-105 active:scale-100 transition disabled:opacity-50"
            >
              <UploadCloud className="w-6 h-6" />
              {loading ? 'Analyzing...' : 'Analyze X-Ray'}
            </button>

            {result && (
              <motion.div
                className="mt-8 w-full bg-blue-100 p-6 rounded-2xl text-blue-900 text-center shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-2xl font-semibold mb-2">
                  Diagnosis: <span className="font-bold">{result.fracture_result.class}</span>
                </p>          <p className="text-lg">
                  Bone type: {result.bone_type}<br />
                  Hotspot: ({result.fracture_result.hotspot.x}, {result.fracture_result.hotspot.y})
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}