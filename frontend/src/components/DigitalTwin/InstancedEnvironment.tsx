import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useDigitalTwinStore } from './store';
import { Html } from '@react-three/drei';
import { Camera, Zap } from 'lucide-react';

const tempObject = new THREE.Object3D();

export function InstancedEnvironment() {
  const layout = useDigitalTwinStore((state) => state.layout);
  const layers = useDigitalTwinStore((state) => state.layers);

  const evMeshRef = useRef<THREE.InstancedMesh>(null);
  const cctvMeshRef = useRef<THREE.InstancedMesh>(null);

  const evChargers = layout?.evChargers || [];
  const cameras = layout?.cameras || [];

  // Check if the layout actually has content (client has built something)
  const hasContent = layout && (
    layout.parkingSlots.length > 0 ||
    layout.roads.length > 0 ||
    layout.gates.length > 0 ||
    (layout.walls && layout.walls.length > 0)
  );

  useEffect(() => {
    if (!evMeshRef.current || evChargers.length === 0) return;
    evChargers.forEach((ev, i) => {
      tempObject.position.set(ev.position[0], ev.position[1] + 1, ev.position[2]);
      tempObject.rotation.set(ev.rotation[0], ev.rotation[1], ev.rotation[2]);
      tempObject.scale.set(0.6, 2, 0.6);
      tempObject.updateMatrix();
      evMeshRef.current!.setMatrixAt(i, tempObject.matrix);
      evMeshRef.current!.setColorAt(i, new THREE.Color('#3B82F6'));
    });
    evMeshRef.current.instanceMatrix.needsUpdate = true;
    if (evMeshRef.current.instanceColor) evMeshRef.current.instanceColor.needsUpdate = true;
  }, [evChargers]);

  useEffect(() => {
    if (!cctvMeshRef.current || cameras.length === 0) return;
    cameras.forEach((cam, i) => {
      tempObject.position.set(cam.position[0], cam.position[1] / 2, cam.position[2]);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.set(0.15, cam.position[1], 0.15);
      tempObject.updateMatrix();
      cctvMeshRef.current!.setMatrixAt(i, tempObject.matrix);
      cctvMeshRef.current!.setColorAt(i, new THREE.Color('#334155'));
    });
    cctvMeshRef.current.instanceMatrix.needsUpdate = true;
    if (cctvMeshRef.current.instanceColor) cctvMeshRef.current.instanceColor.needsUpdate = true;
  }, [cameras]);

  // If no layout or empty layout, render nothing
  if (!hasContent) return null;

  return (
    <group>
      {/* EV Chargers */}
      {layers.EV && evChargers.length > 0 && (
        <group>
          <instancedMesh ref={evMeshRef} args={[null, null, evChargers.length]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial roughness={0.5} metalness={0.5} />
          </instancedMesh>
          {evChargers.map((ev, i) => (
            <group key={`ev-glow-${i}`} position={[ev.position[0], ev.position[1] + 2.2, ev.position[2]]}>
               <Html position={[0, 0.5, 0]} center sprite zIndexRange={[60, 0]}>
                 <div className="w-8 h-8 bg-[#3B82F6]/20 backdrop-blur-md rounded-full flex items-center justify-center border border-[#3B82F6]/50 shadow-[0_0_15px_rgba(59,130,246,0.6)]">
                    <Zap className="w-4 h-4 text-[#60A5FA]" />
                 </div>
               </Html>
            </group>
          ))}
        </group>
      )}

      {/* CCTVs */}
      {layers.CCTV && cameras.length > 0 && (
        <group>
          <instancedMesh ref={cctvMeshRef} args={[null, null, cameras.length]} castShadow>
            <cylinderGeometry args={[1, 1, 1]} />
            <meshStandardMaterial roughness={0.4} metalness={0.8} />
          </instancedMesh>
          {cameras.map((cam) => (
            <group key={`cam-${cam.id}`} position={cam.position} rotation={cam.rotation}>
              <mesh position={[0.5, 0, 0]} castShadow>
                <boxGeometry args={[0.8, 0.4, 0.4]} />
                <meshStandardMaterial color="#0F172A" />
              </mesh>
              <mesh position={[0.95, 0, 0]}>
                <circleGeometry args={[0.15, 16]} />
                <meshBasicMaterial color="#8B5CF6" />
              </mesh>
              
              {layers.Labels && (
                <Html position={[0, 1.5, 0]} center sprite zIndexRange={[70, 0]}>
                  <div className="group bg-[#0F172A]/90 backdrop-blur-xl border border-[#8B5CF6]/30 px-3 py-1.5 rounded-full flex items-center gap-2 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer hover:border-[#8B5CF6] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]">
                    <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
                    </div>
                    <Camera className="w-3.5 h-3.5 text-[#A855F7]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold leading-none tracking-wide">{cam.label || cam.id}</span>
                    </div>
                  </div>
                </Html>
              )}
            </group>
          ))}
        </group>
      )}
    </group>
  );
}
