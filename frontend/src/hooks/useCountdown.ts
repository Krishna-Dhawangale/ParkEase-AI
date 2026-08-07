/**
 * ParkEase AI — useCountdown Hook
 * Pure frontend countdown from ISO 8601 endTime string.
 * Updates every second via setInterval — zero server calls.
 */
import { useState, useEffect, useCallback, useRef } from 'react';

interface CountdownResult {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  formatted: string; // e.g. "02:15:30"
}

function calculateRemaining(endTime: string): CountdownResult {
  const diff = new Date(endTime).getTime() - Date.now();
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const isExpired = totalSeconds <= 0;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatted = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');

  return { hours, minutes, seconds, totalSeconds, isExpired, formatted };
}

export function useCountdown(
  endTime: string | undefined | null,
  onExpire?: () => void
): CountdownResult {
  const [remaining, setRemaining] = useState<CountdownResult>(
    endTime ? calculateRemaining(endTime) : { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isExpired: true, formatted: '00:00:00' }
  );

  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!endTime) return;

    hasFiredRef.current = false;

    const tick = () => {
      const r = calculateRemaining(endTime);
      setRemaining(r);

      if (r.isExpired && !hasFiredRef.current) {
        hasFiredRef.current = true;
        onExpireRef.current?.();
      }
    };

    tick(); // immediate first tick
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return remaining;
}
