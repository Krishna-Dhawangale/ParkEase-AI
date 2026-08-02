import React, { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDigitalTwinStore } from './store';
import { convertTwinProjectToLayout } from './TwinAdapter';
import { DIGITAL_TWIN_SYNC_EVENT } from '../../services/digital-twin.service';
import type { WSEventLayoutUpdated, WSEventSlotUpdated } from './types';
import type { TwinBuilderProject } from '../../portals/client-admin/digitalTwin/data';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000';
export let socket: Socket | null = null;

/**
 * Find the latest Client Portal save from localStorage for a specific facility
 */
function findClientSave(facilityId?: string): { key: string; raw: string } | null {
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key) continue;

    const isMatch = (
      key.startsWith('parkease-ai.digital-twin-builder.v1') ||
      key.startsWith('parkease_digital_twin_')
    );

    if (!isMatch) continue;

    // If a facilityId is specified, only match keys containing that facility
    if (facilityId && !key.includes(facilityId)) continue;

    const raw = window.localStorage.getItem(key);
    if (raw) return { key, raw };
  }
  return null;
}

/**
 * Parse a raw JSON string from the Client Portal into a 3D layout + live slot data
 */
function parseClientPayload(raw: string) {
  const parsed = JSON.parse(raw);
  const project: TwinBuilderProject | undefined = parsed.project;
  if (!project?.floors?.length) return null;

  const activeFloorId = parsed.activeFloorId || project.activeFloorId;
  const activeFloor =
    project.floors.find((f) => f.id === activeFloorId) || project.floors[0];
  const objects = activeFloor?.objects || [];

  // If the floor has 0 objects, return an explicit empty layout
  if (objects.length === 0) {
    return {
      layout: {
        roads: [], walkways: [], gates: [], cameras: [],
        trees: [], evChargers: [], parkingSlots: [], walls: [],
      },
      liveUpdates: [],
    };
  }

  const layout = convertTwinProjectToLayout(project, activeFloorId);

  const liveUpdates: { id: string; status: string; vehicleNumber?: string }[] = [];
  objects.forEach((obj: any) => {
    if (obj.type?.includes('slot')) {
      const isOccupied = obj.status === 'occupied';
      liveUpdates.push({
        id: obj.id,
        status: isOccupied ? 'Occupied' : 'Available',
        vehicleNumber: isOccupied ? `MH-${Math.floor(Math.random() * 99)}-AB-${Math.floor(Math.random() * 9999)}` : undefined,
      });
    }
  });

  return { layout, liveUpdates };
}

interface WebSocketProviderProps {
  facilityId?: string;
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ facilityId, children }) => {
  const setLayout = useDigitalTwinStore((state) => state.setLayout);
  const updateLiveData = useDigitalTwinStore((state) => state.updateLiveData);
  const lastSyncHash = useRef('');

  const applyPayload = useCallback(
    (raw: string) => {
      const hash = raw.length + '_' + raw.slice(0, 200);
      if (hash === lastSyncHash.current) return;
      lastSyncHash.current = hash;

      try {
        const result = parseClientPayload(raw);
        if (result) {
          setLayout(result.layout);
          updateLiveData(result.liveUpdates as any[]);
          console.log(
            `[DigitalTwin] Synced (facility: ${facilityId || 'default'}): ${result.layout.parkingSlots.length} slots, ${result.layout.roads.length} roads`
          );
        } else {
          setLayout({ roads: [], walkways: [], gates: [], cameras: [], trees: [], evChargers: [], parkingSlots: [], walls: [] });
          updateLiveData([]);
        }
      } catch (err) {
        console.error('[DigitalTwin] Failed to parse client payload:', err);
      }
    },
    [setLayout, updateLiveData, facilityId]
  );

  useEffect(() => {
    // Reset hash when facilityId changes so we always sync fresh
    lastSyncHash.current = '';

    // 1. WEBSOCKET CONNECTION
    socket = io(WS_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: true,
      transports: ['websocket'],
    });
    socket.on('connect', () => console.log('[DigitalTwin] WebSocket Connected:', socket?.id));
    socket.on('disconnect', () => console.log('[DigitalTwin] WebSocket Disconnected'));
    socket.on('layout_updated', (payload: WSEventLayoutUpdated) => {
      if (payload.layout) setLayout(payload.layout);
    });
    socket.on('slot_status_changed', (payload: WSEventSlotUpdated) => {
      updateLiveData([{ id: payload.slotId, status: payload.status, vehicleNumber: payload.vehicleNumber }]);
    });

    // 2. CUSTOM EVENT LISTENER (same-tab sync)
    const handleCustomSync = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      // Only apply if it's for our facility (or no facility filter)
      if (detail?.value) {
        if (!facilityId || detail.facilityId === facilityId || detail.key?.includes(facilityId)) {
          applyPayload(detail.value);
        }
      }
    };
    window.addEventListener(DIGITAL_TWIN_SYNC_EVENT, handleCustomSync);

    // 3. STORAGE EVENT LISTENER (cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || !e.newValue) return;
      const isMatch = e.key.startsWith('parkease-ai.digital-twin-builder.v1') || e.key.startsWith('parkease_digital_twin_');
      if (!isMatch) return;
      if (facilityId && !e.key.includes(facilityId)) return;
      applyPayload(e.newValue);
    };
    window.addEventListener('storage', handleStorageChange);

    // 4. POLLING FALLBACK (every 3s)
    const pollInterval = setInterval(() => {
      const found = findClientSave(facilityId);
      if (found) applyPayload(found.raw);
    }, 3000);

    // 5. INITIAL LOAD
    const initialSave = findClientSave(facilityId);
    if (initialSave) {
      applyPayload(initialSave.raw);
    } else {
      setLayout({ roads: [], walkways: [], gates: [], cameras: [], trees: [], evChargers: [], parkingSlots: [], walls: [] });
    }

    return () => {
      if (socket) socket.disconnect();
      window.removeEventListener(DIGITAL_TWIN_SYNC_EVENT, handleCustomSync);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [setLayout, updateLiveData, applyPayload, facilityId]);

  return <>{children}</>;
};
