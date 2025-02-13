import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';

function HealthSymbol() {
  return (
    <group>
      {/* Vertical bar of the cross */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial color="#4F46E5" />
      </mesh>
      {/* Horizontal bar of the cross */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.5, 0.5]} />
        <meshStandardMaterial color="#4F46E5" />
      </mesh>
      {/* Circle around the cross */}
      <mesh position={[0, 0, -0.1]}>
        <torusGeometry args={[1.5, 0.2, 16, 32]} />
        <meshStandardMaterial color="#818CF8" />
      </mesh>
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="h-[400px] w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <HealthSymbol />
          <Environment preset="city" />
          <OrbitControls 
            autoRotate 
            autoRotateSpeed={4}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
      </Canvas>
    </div>
  );
}