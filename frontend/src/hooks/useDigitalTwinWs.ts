/**
 * ParkEase AI — useDigitalTwinWs Hook
 * WebSocket subscription for live Digital Twin telemetry updates.
 * 
 * Usage:
 *   const { telemetry, isConnected, subscribe, unsubscribe } = useDigitalTwinWs();
 *   subscribe(slotId, bookingId);  // Start receiving updates
 *   unsubscribe();                 // Stop receiving updates
 */
import { useState, useRef, useCallback, useEffect } from 'react';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export interface TwinTelemetry {
  type: string;
  slotId: string;
  sensorStatus: string;
  occupancyDetected: boolean;
  batteryLevel: number;
  temperature?: number;
  lastUpdated: string;
}

export function useDigitalTwinWs() {
  const [telemetry, setTelemetry] = useState<TwinTelemetry | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (reconnectRef.current) {
      clearTimeout(reconnectRef.current);
      reconnectRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const subscribe = useCallback((slotId: string, bookingId: string) => {
    cleanup();

    const connect = () => {
      try {
        const ws = new WebSocket(`${WS_BASE_URL}/ws?facility_id=global`);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          // Send subscription message
          ws.send(JSON.stringify({
            type: 'SUBSCRIBE_DIGITAL_TWIN',
            slot_id: slotId,
            booking_id: bookingId,
          }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'DIGITAL_TWIN_UPDATE') {
              setTelemetry({
                type: data.type,
                slotId: data.slot_id,
                sensorStatus: data.sensor_status,
                occupancyDetected: data.occupancy_detected,
                batteryLevel: data.battery_level,
                temperature: data.temperature,
                lastUpdated: data.last_updated,
              });
            }
          } catch (e) {
            console.error('[DigitalTwin WS] Parse error:', e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          // Auto-reconnect after 3 seconds
          reconnectRef.current = window.setTimeout(connect, 3000);
        };

        ws.onerror = (err) => {
          console.error('[DigitalTwin WS] Error:', err);
          ws.close();
        };
      } catch (e) {
        console.error('[DigitalTwin WS] Connect failed:', e);
      }
    };

    connect();
  }, [cleanup]);

  const unsubscribe = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'UNSUBSCRIBE_DIGITAL_TWIN' }));
    }
    cleanup();
    setTelemetry(null);
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return { telemetry, isConnected, subscribe, unsubscribe };
}
