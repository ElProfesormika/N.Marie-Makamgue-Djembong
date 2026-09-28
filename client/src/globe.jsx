import { useEffect, useRef } from "react";
import createGlobe from "cobe";

function approach(current, target, amount) {
  let delta = target - current;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return current + delta * amount;
}

export function PresenceGlobe({ markers, focus }) {
  const canvasRef = useRef(null);
  const focusRef = useRef(focus);
  const markersRef = useRef(markers);
  focusRef.current = focus;
  markersRef.current = markers;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = canvas.offsetWidth || 360;
    let phi = Math.PI - (12 * Math.PI) / 180;
    let theta = 0.35;
    let dragging = false;
    let lastX = 0;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const globe = createGlobe(canvas, {
      devicePixelRatio: pixelRatio,
      width: width * pixelRatio,
      height: width * pixelRatio,
      phi,
      theta,
      dark: 0,
      diffuse: 1.5,
      mapSamples: 16000,
      mapBrightness: 12,
      mapBaseBrightness: 0,
      baseColor: [0.12, 0.32, 0.72],
      markerColor: [0.9, 0.68, 0.1],
      glowColor: [0.62, 0.82, 1],
      markerElevation: 0.06,
      scale: 1,
      opacity: 1,
      markers: markersRef.current,
    });

    function onDown(event) {
      dragging = true;
      lastX = event.clientX;
      canvas.setPointerCapture?.(event.pointerId);
    }
    function onMove(event) {
      if (!dragging) return;
      phi += (event.clientX - lastX) / 220;
      lastX = event.clientX;
    }
    function onUp() {
      dragging = false;
    }
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    let frame = 0;
    const loop = () => {
      const point = focusRef.current;
      if (!dragging && point) {
        phi = approach(phi, Math.PI - (point.lng * Math.PI) / 180, 0.08);
        theta = approach(theta, (point.lat * Math.PI) / 180, 0.08);
      } else if (!dragging && !reduce) {
        phi += 0.0035;
      }
      width = canvas.offsetWidth || width;
      globe.update({
        phi,
        theta,
        width: width * pixelRatio,
        height: width * pixelRatio,
        markers: markersRef.current,
      });
      frame = window.requestAnimationFrame(loop);
    };
    frame = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frame);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      const holder = canvas.parentElement;
      globe.destroy();
      if (holder && holder !== canvas && holder.parentElement) {
        holder.parentElement.appendChild(canvas);
        holder.remove();
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="globe-canvas" aria-hidden="true" />;
}
