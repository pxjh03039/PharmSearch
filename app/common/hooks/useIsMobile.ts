"use client";

import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const listener = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    listener(media);
    media.addEventListener("change", listener as EventListener);
    return () => media.removeEventListener("change", listener as EventListener);
  }, [breakpoint]);

  return isMobile;
}
