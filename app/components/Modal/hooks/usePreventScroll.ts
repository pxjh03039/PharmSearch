import { useEffect } from "react";

export const usePreventScroll = (isOn: boolean): void => {
  const preventTouchMove = (event: TouchEvent) => event.preventDefault();

  useEffect(() => {
    if (isOn) {
      document.documentElement.style.overflow = "hidden";
      document.addEventListener("touchmove", preventTouchMove, {
        passive: false,
      });
      3;
    }

    return () => {
      document.documentElement.style.overflow = "auto";
      document.removeEventListener("touchmove", preventTouchMove);
    };
  }, [isOn]);
};
