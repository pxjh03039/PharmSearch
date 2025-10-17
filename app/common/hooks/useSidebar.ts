import { useState, useCallback } from "react";

export default function useSidebar() {
  const [open, setOpen] = useState(true);

  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);

  return { open, openSidebar, closeSidebar };
}
