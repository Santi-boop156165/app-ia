import { motion } from 'framer-motion';
import { generateFractureMessage } from './getFractureInfo';

interface AssistantCardProps {
  diagnosis: string | null;
  boneType?: string;
  hotspot?: { x: number; y: number };
  onClose: () => void;
}

export const AssistantCard: React.FC<AssistantCardProps> = ({ diagnosis, boneType, hotspot, onClose }) => {
  const getResponse = () => {
    // Normalizamos el tipo de hueso a minúsculas y validamos
    const validBone = (boneType?.toLowerCase() || 'unknown') as
      | 'hand'
      | 'elbow'
      | 'shoulder'
      | 'unknown';

    return generateFractureMessage(diagnosis, validBone, hotspot);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-24 right-6 z-40 bg-white border border-blue-300 rounded-2xl shadow-xl p-6 max-w-sm"
    >
      <h3 className="text-lg font-bold text-blue-800 mb-2">Asistente Clínico IA</h3>
      <p className="text-sm whitespace-pre-line text-blue-900">
        {getResponse()}
      </p>
      <button
        onClick={onClose}
        className="mt-4 text-blue-600 text-sm hover:underline"
      >
        Cerrar
      </button>
    </motion.div>
  );
};
