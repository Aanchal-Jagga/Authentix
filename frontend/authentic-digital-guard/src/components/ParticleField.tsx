import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = () => {
  const points = useRef<THREE.Points>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const particleCount = 120;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      velocities[i * 3] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return { positions, velocities };
  }, []);

  const linePositions = useMemo(() => new Float32Array(particleCount * particleCount * 6), []);

  useFrame(() => {
    if (!points.current || !lineRef.current) return;

    const posAttr = points.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] += velocities[i * 3];
      posArray[i * 3 + 1] += velocities[i * 3 + 1];
      posArray[i * 3 + 2] += velocities[i * 3 + 2];

      for (let d = 0; d < 3; d++) {
        const limit = d === 2 ? 3 : 5;
        if (Math.abs(posArray[i * 3 + d]) > limit) {
          velocities[i * 3 + d] *= -1;
        }
      }
    }
    posAttr.needsUpdate = true;

    // Lines between close particles
    let lineIdx = 0;
    const maxDist = 2.5;
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = posArray[i * 3] - posArray[j * 3];
        const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
        const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDist) {
          linePositions[lineIdx++] = posArray[i * 3];
          linePositions[lineIdx++] = posArray[i * 3 + 1];
          linePositions[lineIdx++] = posArray[i * 3 + 2];
          linePositions[lineIdx++] = posArray[j * 3];
          linePositions[lineIdx++] = posArray[j * 3 + 1];
          linePositions[lineIdx++] = posArray[j * 3 + 2];
        }
      }
    }

    const lineGeo = lineRef.current.geometry;
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions.slice(0, lineIdx), 3));
    lineGeo.setDrawRange(0, lineIdx / 3);
    lineGeo.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#00e5ff" transparent opacity={0.8} sizeAttenuation />
      </points>
      <lineSegments ref={lineRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#00e5ff" transparent opacity={0.1} />
      </lineSegments>
    </>
  );
};

export default ParticleField;
