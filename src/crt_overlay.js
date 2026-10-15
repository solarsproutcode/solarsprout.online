import { createCrtScreen } from "@glowbox/crt";

export function addCRTOverlay(k) {
    // glowbox crt effects
    const crt = createCrtScreen(k.canvas, {
        curvature: 0.35,
        scanlines: 0.3,
        vignette: 0.3,
        events: false,
    });
    crt.canvas.style.pointerEvents = "none"; // clicks pass through
    crt.canvas.style.position = "fixed"; // override default position
    document.body.append(crt.canvas); // add to page
    k.canvas.style.opacity = "0"; // hide non-crt version
    applyCRTOverlay(k, crt);
    window.addEventListener("resize", () => applyCRTOverlay(k, crt)); // any time the window is resized, need to re-apply
}

// Determine the position/size of overlay to match canvas
function applyCRTOverlay(k, crt) {
    const r = k.canvas.getBoundingClientRect();
    crt.canvas.style.left = `${r.left}px`;
    crt.canvas.style.top = `${r.top}px`;
    crt.canvas.style.width = `${r.width}px`;
    crt.canvas.style.height = `${r.height}px`;
}
