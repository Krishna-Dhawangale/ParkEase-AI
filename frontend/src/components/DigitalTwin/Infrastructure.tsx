import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useDigitalTwinStore } from './store';
import { Html } from '@react-three/drei';

export function Infrastructure() {
  const layout = useDigitalTwinStore((state) => state.layout);
  const layers = useDigitalTwinStore((state) => state.layers);
  const gateRefs = useRef<(THREE.Object3D | null)[]>([]);

  // Boom barrier animation
  const [gateTimers, setGateTimers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!layout) return;
    // Simulate gate openings occasionally based on vehicles entering/exiting (or random for now)
    const interval = setInterval(() => {
      if (layout.gates.length === 0) return;
      const randomGate = layout.gates[Math.floor(Math.random() * layout.gates.length)];
      setGateTimers(prev => ({ ...prev, [randomGate.id]: Date.now() }));
    }, 6000);
    return () => clearInterval(interval);
  }, [layout]);

  useFrame(() => {
    if (!layout || !layers.Roads) return;
    
    layout.gates.forEach((gate, i) => {
      const barrier = gateRefs.current[i];
      if (barrier) {
        const lastTrigger = gateTimers[gate.id] || 0;
        const timeSince = Date.now() - lastTrigger;
        
        let targetAngle = 0;
        if (timeSince < 3000) {
          // Open
          targetAngle = Math.PI / 2.5; // 70 degrees up
        }
        
        // Smoothly interpolate barrier rotation
        barrier.rotation.z += (targetAngle - barrier.rotation.z) * 0.1;
      }
    });
  });

  if (!layout) return null;

  return (
    <group>
      {/* Main Floor Base (Dark Asphalt) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[150, 150]} /> {/* Large enough to cover canvas */}
        <meshStandardMaterial color="#050811" roughness={0.95} metalness={0} />
      </mesh>

      {/* Dynamic Client Building */}
      {layout.building && (
        <group position={layout.building.position}>
          <mesh castShadow receiveShadow position={[0, layout.building.size[1] / 2, 0]}>
            <boxGeometry args={layout.building.size} />
            <meshStandardMaterial color="#0A0F1C" roughness={0.1} metalness={0.9} /> {/* Dark Glass */}
          </mesh>
          <mesh position={[0, layout.building.size[1] - 0.2, 0]}>
            <boxGeometry args={[layout.building.size[0] + 0.2, 0.4, layout.building.size[2] + 0.2]} />
            <meshBasicMaterial color="#8B5CF6" toneMapped={false} />
          </mesh>
        </group>
      )}

      {/* High-Fidelity Dynamic Roads */}
      {layers.Roads && layout.roads.map((road) => (
        <group key={`road-${road.id}`} position={road.position} rotation={road.rotation as any}>
          {/* Main Road Surface */}
          <mesh receiveShadow>
            <boxGeometry args={road.size} />
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </mesh>
          
          {/* Dashed Center Lines */}
          <mesh position={[0, 0.06, 0]}>
            <planeGeometry args={[road.size[0] * 0.9, 0.2]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
          </mesh>

          {/* Elevated Concrete Side Curbs */}
          <mesh position={[0, 0.15, road.size[2] / 2 + 0.2]} receiveShadow castShadow>
             <boxGeometry args={[road.size[0], 0.3, 0.4]} />
             <meshStandardMaterial color="#64748B" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.15, -road.size[2] / 2 - 0.2]} receiveShadow castShadow>
             <boxGeometry args={[road.size[0], 0.3, 0.4]} />
             <meshStandardMaterial color="#64748B" roughness={0.8} />
          </mesh>

          {/* Procedural Painted Directional Arrows (Triangles + Boxes) */}
          <group position={[road.size[0] * 0.3, 0.06, road.size[2] * 0.25]}>
             <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
               <planeGeometry args={[1.5, 0.4]} />
               <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
             </mesh>
             <mesh position={[0.7, 0, 0]} rotation={[-Math.PI/2, 0, -Math.PI/2]}>
               <coneGeometry args={[0.5, 1, 3]} />
               <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
             </mesh>
          </group>
        </group>
      ))}

      {/* Dynamic Walkways */}
      {layers.Walkways && layout.walkways.map((walkway) => (
        <group key={`walkway-${walkway.id}`} position={walkway.position} rotation={walkway.rotation as any}>
          <mesh receiveShadow>
            <boxGeometry args={walkway.size} />
            <meshStandardMaterial color="#64748B" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Dynamic Client Gates & Barriers */}
      {layers.Roads && layout.gates.map((gate, index) => {
        const { type } = gate;
        return (
          <group key={`gate-${gate.id}`} position={gate.position} rotation={gate.rotation as any}>
            <mesh position={[0, 0.6, 2.5]} castShadow>
              <boxGeometry args={[0.8, 1.2, 0.8]} />
              <meshStandardMaterial color={type === 'Entry' ? '#1E293B' : '#1E293B'} />
            </mesh>

            <mesh position={[0, 0.06, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <planeGeometry args={[1, 5]} />
              <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
            </mesh>

            <group position={[0, 1, 2.5]} ref={el => gateRefs.current[index] = el}>
              <mesh position={[0, 0, -2.5]} castShadow>
                <boxGeometry args={[0.2, 0.2, 5]} />
                <meshStandardMaterial color="#EF4444" roughness={0.5} />
              </mesh>
              <mesh position={[0.11, 0, -1.5]} rotation={[Math.PI/4, 0, 0]}>
                 <planeGeometry args={[0.01, 0.4]} />
                 <meshBasicMaterial color="#FFFFFF" />
              </mesh>
              <mesh position={[0.11, 0, -2.5]} rotation={[Math.PI/4, 0, 0]}>
                 <planeGeometry args={[0.01, 0.4]} />
                 <meshBasicMaterial color="#FFFFFF" />
              </mesh>
            </group>

            {layers.Labels && (
              <Html position={[0, 3, 2.5]} center zIndexRange={[100, 0]}>
                <div className="bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-lg shadow-xl pointer-events-none">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${type === 'Entry' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'} animate-pulse`} />
                    <span className="text-white text-xs font-bold uppercase tracking-wider">{type}</span>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Dynamic Client Walls */}
      {layout.walls && layout.walls.map((wall) => (
        <mesh key={`wall-${wall.id}`} position={wall.position} rotation={wall.rotation as any} receiveShadow castShadow>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial color="#1E293B" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}
