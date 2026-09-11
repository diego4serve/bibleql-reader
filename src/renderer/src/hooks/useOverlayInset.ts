import { useEffect, useState } from "react";

interface WindowControlsOverlayGeometry {
  x: number;
  width: number;
}

interface WindowControlsOverlay extends EventTarget {
  getTitlebarAreaRect(): WindowControlsOverlayGeometry;
}

// Reserves space so toolbar content doesn't render underneath the native
// minimize/maximize/close buttons Electron draws via `titleBarOverlay`
// (Windows/Linux only — macOS uses inset traffic lights instead and never
// exposes this API).
export function useOverlayInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const overlay = (navigator as Navigator & { windowControlsOverlay?: WindowControlsOverlay })
      .windowControlsOverlay;
    if (!overlay) return;

    function update(): void {
      const rect = overlay!.getTitlebarAreaRect();
      setInset(Math.max(0, window.innerWidth - rect.x - rect.width));
    }

    update();
    overlay.addEventListener("geometrychange", update);
    return () => overlay.removeEventListener("geometrychange", update);
  }, []);

  return inset;
}
