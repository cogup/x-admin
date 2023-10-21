import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function useQuerystring(): Record<string, string> {
  const urlSearchParams = new URLSearchParams(useLocation().search);
  return Object.fromEntries(urlSearchParams.entries());
}

export function useIsMobile(): boolean {
  return useIsWindowsSize(768);
}

export function useIsTablet(): boolean {
  return useIsWindowsSize(1024);
}

export function useIsDesktop(): boolean {
  return useIsWindowsSize(1280);
}

export function useIsWindowsSize(size: number): boolean {
  const [grid, setGrid] = useState(window.innerWidth < size);

  useEffect(() => {
    const handleResize = () => {
      setGrid(window.innerWidth < size);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return grid;
}
