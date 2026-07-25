import { useEffect, useRef } from 'react';
import { useWebSocketStore, type WebSocketMessage } from '../store';
import { useTenantStore } from '../store';

const WS_URL = import.meta.env.VITE_WS_URL as string | undefined;
const RECONNECT_INTERVAL = 3000;
const SIMULATION_INTERVAL = 10000;

export const useWebSocket = () => {
  const { currentTenant } = useTenantStore();
  const setConnectionStatus = useWebSocketStore((state) => state.setConnectionStatus);
  const setLastMessage = useWebSocketStore((state) => state.setLastMessage);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const simulationIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // If no tenant is active, don't connect
    if (!currentTenant) return;

    const connect = () => {
      // Simulation Mode if no URL is provided
      if (!WS_URL) {
        setConnectionStatus({ isConnected: true, isReconnecting: false });
        
        // Simulate incoming real-time events
        simulationIntervalRef.current = window.setInterval(() => {
          const events: WebSocketMessage[] = [
            {
              type: 'BOOKING_UPDATE',
              payload: {
                id: `BK-${Math.floor(Math.random() * 10000)}`,
                status: 'Active',
                message: 'New booking arrived'
              },
              timestamp: Date.now()
            },
            {
              type: 'DEVICE_STATUS',
              payload: {
                id: `DEV-${Math.floor(Math.random() * 100)}`,
                status: 'Warning',
                message: 'Device signal lost temporarily'
              },
              timestamp: Date.now()
            }
          ];
          
          const randomEvent = events[Math.floor(Math.random() * events.length)];
          setLastMessage(randomEvent);
        }, SIMULATION_INTERVAL);
        return;
      }

      // Real WebSocket Mode
      try {
        setConnectionStatus({ isReconnecting: true });
        const ws = new WebSocket(`${WS_URL}?tenantId=${currentTenant.id}`);
        wsRef.current = ws;

        ws.onopen = () => {
          setConnectionStatus({ isConnected: true, isReconnecting: false });
        };

        ws.onmessage = (event) => {
          try {
            const data: WebSocketMessage = JSON.parse(event.data);
            setLastMessage(data);
          } catch (e) {
            console.error('Failed to parse WebSocket message:', e);
          }
        };

        ws.onclose = () => {
          setConnectionStatus({ isConnected: false, isReconnecting: false });
          // Exponential backoff or simple reconnect could be implemented here
          reconnectTimeoutRef.current = window.setTimeout(connect, RECONNECT_INTERVAL);
        };

        ws.onerror = (error) => {
          console.error('WebSocket Error:', error);
          ws.close();
        };
      } catch (e) {
        console.error('Failed to connect WebSocket:', e);
      }
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      if (simulationIntervalRef.current) {
        window.clearInterval(simulationIntervalRef.current);
      }
      setConnectionStatus({ isConnected: false, isReconnecting: false });
    };
  }, [currentTenant, setConnectionStatus, setLastMessage]);
};
