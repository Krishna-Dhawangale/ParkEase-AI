import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useDigitalTwinStore } from './store';
import { InstancedParkingSlots } from './InstancedParkingSlots';
import { InstancedEnvironment } from './InstancedEnvironment';
import { Infrastructure } from './Infrastructure';

function CameraManager() {
  const cameraControlsRef = useRef<any>(null);
  const viewMode = useDigitalTwinStore((state) => state.viewMode);
  const cameraTarget = useDigitalTwinStore((state) => state.cameraTarget);
  const setCameraTarget = useDigitalTwinStore((state) => state.setCameraTarget);

  useEffect(() => {
    if (!cameraControlsRef.current) return;
    const controls = cameraControlsRef.current;
    controls.smoothTime = 0.8; // 800ms smooth transition
    
    // Limits
    controls.minDistance = 5;
    controls.maxDistance = 120;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // Don't go below ground

    if (cameraTarget) {
      // Fly to specific slot target (close up angled)
      controls.setLookAt(
        cameraTarget[0], cameraTarget[1] + 8, cameraTarget[2] + 8, // Eye
        cameraTarget[0], cameraTarget[1], cameraTarget[2],         // Target
        true // Animate
      );
      // Reset target after firing to allow user control again
      setTimeout(() => setCameraTarget(null), 1000); 
    } else if (viewMode === '2D') {
      // Top-down map view
      controls.setLookAt(
        0, 80, 0, // Eye
        0, 0, 0,  // Target
        true
      );
    } else {
      // 3D Isometric default view (45 degree)
      controls.setLookAt(
        -40, 35, 40, // Eye
        0, 0, 0,     // Target
        true
      );
    }
  }, [viewMode, cameraTarget, setCameraTarget]);

  // Double click to reset
  useEffect(() => {
    const handleDoubleClick = () => {
      setCameraTarget(null);
      if (cameraControlsRef.current && viewMode === '3D') {
        cameraControlsRef.current.setLookAt(-40, 35, 40, 0, 0, 0, true);
      }
    };
    window.addEventListener('dblclick', handleDoubleClick);
    return () => window.removeEventListener('dblclick', handleDoubleClick);
  }, [viewMode, setCameraTarget]);

  return (
    <CameraControls 
      ref={cameraControlsRef}
      makeDefault
    />
  );
}

export function DigitalTwinEngine() {
  return (
    <Canvas
      camera={{ position: [-40, 35, 40], fov: 35 }}
      dpr={[1, 2]} // Support high DPI displays but cap at 2 for performance
      gl={{ antialias: true, powerPreference: 'high-performance' }} 
      shadows
    >
      <color attach="background" args={['#070B17']} />
      
      {/* Lighting - Soft and elegant */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight
        position={[20, 40, 20]}
        intensity={1.2}
        color="#e0e7ff" // Slight blue/cool tint
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0001}
      />
      {/* Edge Rim Light for aesthetics */}
      <directionalLight position={[-20, 10, -20]} intensity={0.8} color="#8B5CF6" />
      
      <Environment preset="night" />

      <CameraManager />

      {/* Render core components */}
      <Infrastructure />
      <InstancedParkingSlots />
      <InstancedEnvironment />

      {/* Soft Contact Shadows for realism without heavy draw calls */}
      <ContactShadows resolution={1024} scale={100} blur={2.5} opacity={0.6} far={15} color="#000000" />
    </Canvas>
  );
}
