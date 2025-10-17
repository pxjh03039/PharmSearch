import { useState, useCallback } from "react";

export default function useSidebar() {
  const [open, setOpen] = useState(true);

  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);
  const toggleSidebar = useCallback(() => setOpen((prev) => !prev), []);

  return { open, openSidebar, closeSidebar, toggleSidebar };
}
