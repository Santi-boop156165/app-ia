import { motion } from 'framer-motion';
import type { PredictionResponse } from './types';
import React from 'react';

interface Props {
  preview: string;
  result: PredictionResponse | null;
  imageRef: React.RefObject<HTMLImageElement>;
  imageSize: { width: number; height: number };
}

export const ImagePreview: React.FC<Props> = ({ preview, result, imageRef, imageSize }) => {
  const originalWidth = result?.fracture_result?.originalWidth || 512;
  const originalHeight = result?.fracture_result?.originalHeight || 512;

const OFFSET_Y = 80;

const scaledX = result?.fracture_result
  ? (result.fracture_result.hotspot.x / originalWidth) * imageSize.width
  : 0;

const scaledY = result?.fracture_result
  ? (result.fracture_result.hotspot.y / originalHeight) * imageSize.height + OFFSET_Y
  : 0;


  return (
    <div className="relative w-full mt-4 rounded-xl shadow border overflow-hidden">
      <motion.img
        ref={imageRef}
        src={preview}
        alt="Preview"
        className="w-full rounded-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      {result?.fracture_result?.class === 'fractured' && (
        <div
          className="absolute w-20 h-20 rounded-full border-4 border-red-600 shadow-md"
          style={{
            left: `${scaledX}px`,
            top: `${scaledY}px`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            backgroundColor: 'transparent',
          }}
        />
      )}
    </div>
  );
};