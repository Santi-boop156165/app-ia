type Zone = 'hand' | 'elbow' | 'shoulder' | 'unknown';

const handGeneralInfo = [
  "Las fracturas en la mano afectan comúnmente los huesos metacarpianos y falángicos, y pueden presentarse tras caídas, traumatismos directos o esfuerzos repetitivos.",
  "Son lesiones frecuentes en personas activas, trabajadores manuales y deportistas, especialmente en deportes de contacto como el boxeo o el baloncesto.",
  "Las fracturas pueden ser estables o inestables, abiertas o cerradas, y su clasificación depende de su localización, desplazamiento y fragmentación.",
];

const handZoneInfo = [
  "Las fracturas en los dedos suelen comprometer las falanges distales o proximales. Las del quinto metacarpiano son comunes en golpes con puño cerrado ('fractura del boxeador').",
  "Si la fractura ocurre en la base del pulgar, podría tratarse de una fractura de Bennett o Rolando, que afectan la articulación carpometacarpiana.",
  "La fractura del escafoides (carpo) es difícil de detectar y su recuperación es lenta por el bajo flujo sanguíneo en esa región.",
];

const handTreatmentInfo = [
  "El tratamiento depende del tipo de fractura. Las no desplazadas se tratan con férula o yeso durante 3 a 6 semanas.",
  "Fracturas desplazadas o inestables pueden requerir cirugía con clavos, placas o tornillos para garantizar una alineación adecuada.",
  "En algunos casos se emplea fijación externa cuando hay múltiples fragmentos o lesiones en tejidos blandos.",
];

const handRecoveryInfo = [
  "El tiempo de recuperación suele variar entre 4 y 8 semanas, dependiendo de la localización y el tipo de intervención.",
  "La fisioterapia suele iniciarse tras el retiro de la inmovilización, buscando prevenir rigidez, adherencias y pérdida de fuerza.",
  "Es común recuperar la funcionalidad completa, aunque en lesiones complejas puede quedar alguna limitación articular o sensibilidad residual.",
];

const elbowInfo = `
Se ha detectado una fractura en el codo.

🦴 Las fracturas de codo suelen afectar el olécranon, el húmero distal o la cabeza del radio. Son frecuentes por caídas con el brazo extendido.

🕒 Tiempo estimado de recuperación: de 6 a 12 semanas.

🔧 Tratamiento habitual: inmovilización con cabestrillo o yeso; cirugía en casos con desplazamiento.

⚠️ Rehabilitación con ejercicios progresivos es fundamental para evitar rigidez y recuperar amplitud de movimiento.
`;

function getRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateFractureMessage(
  diagnosis: string | null,
  bone: Zone,
  hotspot?: { x: number; y: number }
): string {
  if (!diagnosis) {
    return 'Aún no se ha detectado ninguna fractura.';
  }

  if (diagnosis.toLowerCase() === 'normal') {
    return `
✅ El análisis no muestra signos de fractura en la imagen evaluada.

🖐️ Estructura ósea de la ${bone || 'zona evaluada'}: sin desplazamientos, discontinuidades o indicios de traumatismo visibles${hotspot ? ` en la región (${hotspot.x}, ${hotspot.y})` : ''}.

🧠 Aun así, recuerda que una radiografía debe ser interpretada siempre por un profesional médico certificado.

Si persisten síntomas como dolor, inflamación o pérdida de movilidad, acude a una consulta médica especializada.
    `.trim();
  }

  if (diagnosis.toLowerCase() === 'fractured' && bone === 'hand') {
    return `
Se ha detectado una fractura en ${hotspot ? getHandZone(hotspot.x, hotspot.y) : 'una región de la mano'}.

🧠 ${getRandom(handGeneralInfo)}

📍 ${getRandom(handZoneInfo)}

🛠️ ${getRandom(handTreatmentInfo)}

🕒 ${getRandom(handRecoveryInfo)}

Esta información es orientativa y no sustituye la valoración médica presencial.
    `.trim();
  }

  if (diagnosis.toLowerCase() === 'fractured' && bone === 'elbow') {
    return elbowInfo.trim();
  }

  return 'No se encontró información específica sobre este tipo de diagnóstico. Por favor consulta con un especialista.';
}

function getHandZone(x: number, y: number): string {
  if (y < 100) return 'los dedos (falanges)';
  if (y >= 100 && y <= 200) return 'la palma de la mano';
  if (y > 200) return 'la zona de la muñeca';
  return 'una región no identificada de la mano';
}
