import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useQuerystring(): Record<string, string> {
  const urlSearchParams = new URLSearchParams(useLocation().search);
  return Object.fromEntries(urlSearchParams.entries());
}

export function useIsMobile(): boolean {
  return useIsWindowsSize(768);
}

export function useIsLaptop(): boolean {
  return useIsWindowsSize(1024);
}

export function useIsWindowsSize(size: number): boolean {
  const [isMobile, setIsMobile] = useState(window.innerWidth < size);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < size);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
