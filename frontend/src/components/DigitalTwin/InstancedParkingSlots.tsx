import React, { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useDigitalTwinStore } from './store';
import { Html } from '@react-three/drei';

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

// Deterministic random colors for premium cars
const CAR_COLORS = ['#FFFFFF', '#0F172A', '#94A3B8', '#1E3A8A', '#7F1D1D'];
function getHashColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return CAR_COLORS[Math.abs(hash) % CAR_COLORS.length];
}

export function InstancedParkingSlots() {
  const layout = useDigitalTwinStore((state) => state.layout);
  const liveData = useDigitalTwinStore((state) => state.liveData);
  const layers = useDigitalTwinStore((state) => state.layers);
  const hoveredSlotId = useDigitalTwinStore((state) => state.hoveredSlotId);
  const selectedSlotId = useDigitalTwinStore((state) => state.selectedSlotId);
  const setHoveredSlot = useDigitalTwinStore((state) => state.setHoveredSlot);
  const setSelectedSlot = useDigitalTwinStore((state) => state.setSelectedSlot);

  const slots = useMemo(() => layout?.parkingSlots || [], [layout]);
  
  const baseMeshRef = useRef<THREE.InstancedMesh>(null);
  const borderMeshRef = useRef<THREE.InstancedMesh>(null);
  const glowMeshRef = useRef<THREE.InstancedMesh>(null);
  
  // Detailed Car Parts
  const carBodyMeshRef = useRef<THREE.InstancedMesh>(null);
  const carGlassMeshRef = useRef<THREE.InstancedMesh>(null);
  const carWheelMeshRef = useRef<THREE.InstancedMesh>(null);
  const carLightFrontMeshRef = useRef<THREE.InstancedMesh>(null);
  const carLightBackMeshRef = useRef<THREE.InstancedMesh>(null);

  // Initial Setup for Static Parts (Base, Borders)
  useEffect(() => {
    if (!baseMeshRef.current || !borderMeshRef.current || !glowMeshRef.current || slots.length === 0) return;

    slots.forEach((slot, i) => {
      tempObject.position.set(slot.position[0], slot.position[1] + 0.01, slot.position[2]);
      tempObject.rotation.set(slot.rotation[0], slot.rotation[1], slot.rotation[2]);
      
      const width = slot.size?.[0] || 2.4;
      const depth = slot.size?.[2] || 4.8;

      // Base
      tempObject.scale.set(width * 0.95, 0.05, depth * 0.95);
      tempObject.updateMatrix();
      baseMeshRef.current!.setMatrixAt(i, tempObject.matrix);
      baseMeshRef.current!.setColorAt(i, tempColor.set('#22C55E')); // Default Green
      
      // Border
      tempObject.scale.set(width, 0.06, depth);
      tempObject.updateMatrix();
      borderMeshRef.current!.setMatrixAt(i, tempObject.matrix);
      borderMeshRef.current!.setColorAt(i, tempColor.set('#16A34A')); // Darker Green

      // Glow (hidden initially via scale)
      tempObject.scale.set(0, 0, 0);
      tempObject.updateMatrix();
      glowMeshRef.current!.setMatrixAt(i, tempObject.matrix);
      glowMeshRef.current!.setColorAt(i, tempColor.set('#8B5CF6'));
    });

    baseMeshRef.current.instanceMatrix.needsUpdate = true;
    baseMeshRef.current.instanceColor!.needsUpdate = true;
    borderMeshRef.current.instanceMatrix.needsUpdate = true;
    borderMeshRef.current.instanceColor!.needsUpdate = true;
    glowMeshRef.current.instanceMatrix.needsUpdate = true;
    glowMeshRef.current.instanceColor!.needsUpdate = true;
  }, [slots]);

  // Render Loop for Cars and Hover Effects
  useFrame(({ clock }) => {
    if (!slots.length) return;
    const time = clock.getElapsedTime();

    slots.forEach((slot, i) => {
      const live = liveData[slot.id];
      const isOccupied = live?.status === 'Occupied' || live?.status === 'Reserved';
      const isHovered = hoveredSlotId === slot.id;
      const isSelected = selectedSlotId === slot.id;

      const width = slot.size?.[0] || 2.4;
      const depth = slot.size?.[2] || 4.8;

      // Dynamic Colors
      if (baseMeshRef.current && borderMeshRef.current) {
        baseMeshRef.current.setColorAt(i, tempColor.set(isOccupied ? '#EF4444' : '#22C55E'));
        borderMeshRef.current.setColorAt(i, tempColor.set(isOccupied ? '#DC2626' : '#16A34A'));
      }

      // Handle Glow/Hover
      if (glowMeshRef.current) {
        tempObject.position.set(slot.position[0], slot.position[1] + 0.02, slot.position[2]);
        tempObject.rotation.set(slot.rotation[0], slot.rotation[1], slot.rotation[2]);
        if (isHovered || isSelected) {
          tempObject.scale.set(width + 0.2, 0.02, depth + 0.2);
          glowMeshRef.current.setColorAt(i, tempColor.set(isSelected ? '#3B82F6' : '#8B5CF6'));
        } else {
          tempObject.scale.set(0, 0, 0);
        }
        tempObject.updateMatrix();
        glowMeshRef.current.setMatrixAt(i, tempObject.matrix);
      }

      // Handle Cars
      if (carBodyMeshRef.current && carGlassMeshRef.current && carWheelMeshRef.current && carLightFrontMeshRef.current && carLightBackMeshRef.current) {
        if (isOccupied) {
          const hoverY = Math.sin(time * 2 + i) * 0.05; // Idle bobbing
          const baseY = slot.position[1] + 0.6 + hoverY;
          
          // Body
          tempObject.position.set(slot.position[0], baseY, slot.position[2]);
          tempObject.rotation.set(slot.rotation[0], slot.rotation[1], slot.rotation[2]);
          tempObject.scale.set(1.6, 0.6, 3.8);
          tempObject.updateMatrix();
          carBodyMeshRef.current.setMatrixAt(i, tempObject.matrix);
          carBodyMeshRef.current.setColorAt(i, tempColor.set(getHashColor(slot.id)));

          // Glass Roof
          tempObject.position.set(slot.position[0], baseY + 0.5, slot.position[2] - 0.2);
          tempObject.scale.set(1.4, 0.4, 1.8);
          tempObject.updateMatrix();
          carGlassMeshRef.current.setMatrixAt(i, tempObject.matrix);

          // Wheels (Front Left, Front Right, Back Left, Back Right)
          const wOffsets = [
            [-0.9, -0.3, 1.2], [0.9, -0.3, 1.2],
            [-0.9, -0.3, -1.2], [0.9, -0.3, -1.2]
          ];
          wOffsets.forEach((off, wIndex) => {
             tempObject.position.set(slot.position[0] + off[0], baseY + off[1], slot.position[2] + off[2]);
             tempObject.rotation.set(0, 0, Math.PI / 2);
             tempObject.scale.set(0.3, 0.2, 0.3); // wheel size
             tempObject.updateMatrix();
             carWheelMeshRef.current!.setMatrixAt(i * 4 + wIndex, tempObject.matrix);
          });

          // Headlights (Front)
          const fLights = [[-0.6, 0.1, 1.9], [0.6, 0.1, 1.9]];
          fLights.forEach((off, fIndex) => {
             tempObject.position.set(slot.position[0] + off[0], baseY + off[1], slot.position[2] + off[2]);
             tempObject.rotation.set(0, 0, 0);
             tempObject.scale.set(0.3, 0.15, 0.05);
             tempObject.updateMatrix();
             carLightFrontMeshRef.current!.setMatrixAt(i * 2 + fIndex, tempObject.matrix);
          });

          // Tail lights (Back)
          const bLights = [[-0.6, 0.1, -1.9], [0.6, 0.1, -1.9]];
          bLights.forEach((off, bIndex) => {
             tempObject.position.set(slot.position[0] + off[0], baseY + off[1], slot.position[2] + off[2]);
             tempObject.rotation.set(0, 0, 0);
             tempObject.scale.set(0.3, 0.15, 0.05);
             tempObject.updateMatrix();
             carLightBackMeshRef.current!.setMatrixAt(i * 2 + bIndex, tempObject.matrix);
          });

        } else {
          // Hide Car completely
          tempObject.scale.set(0, 0, 0);
          tempObject.updateMatrix();
          carBodyMeshRef.current.setMatrixAt(i, tempObject.matrix);
          carGlassMeshRef.current.setMatrixAt(i, tempObject.matrix);
          for(let w=0; w<4; w++) carWheelMeshRef.current.setMatrixAt(i * 4 + w, tempObject.matrix);
          for(let l=0; l<2; l++) {
             carLightFrontMeshRef.current.setMatrixAt(i * 2 + l, tempObject.matrix);
             carLightBackMeshRef.current.setMatrixAt(i * 2 + l, tempObject.matrix);
          }
        }
      }
    });

    if (baseMeshRef.current) baseMeshRef.current.instanceColor!.needsUpdate = true;
    if (borderMeshRef.current) borderMeshRef.current.instanceColor!.needsUpdate = true;

    if (glowMeshRef.current) glowMeshRef.current.instanceMatrix.needsUpdate = true;
    if (glowMeshRef.current?.instanceColor) glowMeshRef.current.instanceColor.needsUpdate = true;
    
    if (carBodyMeshRef.current) {
      carBodyMeshRef.current.instanceMatrix.needsUpdate = true;
      if (carBodyMeshRef.current.instanceColor) carBodyMeshRef.current.instanceColor.needsUpdate = true;
      carGlassMeshRef.current!.instanceMatrix.needsUpdate = true;
      carWheelMeshRef.current!.instanceMatrix.needsUpdate = true;
      carLightFrontMeshRef.current!.instanceMatrix.needsUpdate = true;
      carLightBackMeshRef.current!.instanceMatrix.needsUpdate = true;
    }
  });

  if (!slots.length) return null;

  return (
    <group>
      {/* Base Parking Slot Layer */}
      {layers.Slots && (
        <group>
          <instancedMesh ref={baseMeshRef} args={[null, null, slots.length]} receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial roughness={0.9} />
          </instancedMesh>
          
          <instancedMesh ref={borderMeshRef} args={[null, null, slots.length]} receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial roughness={0.8} />
          </instancedMesh>

          <instancedMesh ref={glowMeshRef} args={[null, null, slots.length]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial transparent opacity={0.6} toneMapped={false} />
          </instancedMesh>

          {/* Invisible Hitboxes for Raycasting interactions */}
          {slots.map((slot) => (
            <mesh
              key={slot.id}
              position={[slot.position[0], 0.5, slot.position[2]]}
              rotation={slot.rotation}
              visible={false}
              onPointerOver={(e) => { e.stopPropagation(); setHoveredSlot(slot.id); }}
              onPointerOut={(e) => { e.stopPropagation(); setHoveredSlot(null); }}
              onClick={(e) => { e.stopPropagation(); setSelectedSlot(slot.id); }}
            >
              <boxGeometry args={[2.5, 2, 5]} />
              <meshBasicMaterial />
            </mesh>
          ))}
        </group>
      )}

      {/* Dynamic Detailed Cars Layer */}
      {layers.Slots && (
        <group>
          {/* Car Body */}
          <instancedMesh ref={carBodyMeshRef} args={[null, null, slots.length]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial roughness={0.2} metalness={0.7} />
          </instancedMesh>
          
          {/* Car Glass Roof */}
          <instancedMesh ref={carGlassMeshRef} args={[null, null, slots.length]} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#0A0F1C" roughness={0.1} metalness={0.9} />
          </instancedMesh>

          {/* Car Wheels */}
          <instancedMesh ref={carWheelMeshRef} args={[null, null, slots.length * 4]} castShadow>
            <cylinderGeometry args={[1, 1, 1, 16]} />
            <meshStandardMaterial color="#000000" roughness={0.9} />
          </instancedMesh>

          {/* Headlights */}
          <instancedMesh ref={carLightFrontMeshRef} args={[null, null, slots.length * 2]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#FFFFFF" toneMapped={false} /> {/* Glow white */}
          </instancedMesh>

          {/* Tail lights */}
          <instancedMesh ref={carLightBackMeshRef} args={[null, null, slots.length * 2]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color="#EF4444" toneMapped={false} /> {/* Glow red */}
          </instancedMesh>
        </group>
      )}
    </group>
  );
}
