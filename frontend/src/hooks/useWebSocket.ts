'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { WS_BASE_URL } from '@/lib/constants';
import { WSEvent } from '@/types';

export function useWebSocket(channel: 'customer' | 'owner' | 'dev', onEvent?: (event: WSEvent) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<WSEvent | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onEventRef = useRef(onEvent);
  const maxReconnects = 5;

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(`${WS_BASE_URL}/ws/${channel}`);

      ws.onopen = () => {
        console.log(`✅ WebSocket connected to channel '${channel}'`);
        setIsConnected(true);
        reconnectCountRef.current = 0;
      };

      ws.onmessage = (messageEvent) => {
        try {
          const parsed: WSEvent = JSON.parse(messageEvent.data);
          setLastEvent(parsed);
          if (onEventRef.current) {
            onEventRef.current(parsed);
          }
        } catch (e) {
          console.error('WebSocket parse error:', e, 'data:', messageEvent.data);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (reconnectCountRef.current < maxReconnects) {
          const delay = Math.pow(2, reconnectCountRef.current) * 1000;
          reconnectCountRef.current += 1;
          console.log(`🔄 Reconnecting to '${channel}' in ${delay}ms (attempt ${reconnectCountRef.current}/${maxReconnects})`);
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          console.error(`❌ WebSocket connection to '${channel}' failed after ${maxReconnects} attempts`);
        }
      };

      ws.onerror = (event) => {
        const errorInfo = event instanceof Event ? `${event.type} (${ws.readyState})` : String(event);
        if (reconnectCountRef.current < maxReconnects) {
          console.warn(`WebSocket connection attempt ${reconnectCountRef.current + 1}/${maxReconnects} failed on channel '${channel}': ${errorInfo}`);
        } else {
          console.error(`WebSocket failed to connect to channel '${channel}' after ${maxReconnects} retries: ${errorInfo}`);
        }
        ws.close();
      };

      wsRef.current = ws;
    } catch (e) {
      console.error('Failed to create WebSocket', e);
    }
  }, [channel]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { isConnected, lastEvent };
}
