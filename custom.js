const viewport = document.getElementById("viewport");
const grid = document.getElementById("grid-container");

let state = {
    scale: 1,
    x: 0,
    y: 0,
    isPanning: false,
    lastMouseX: 0,
    lastMouseY: 0,
    initialPinchDist: 0,
    initialPinchScale: 1,
};

// dummy cells
for (let i = 0; i < 400; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = i;
    grid.appendChild(cell);
}

// ZOOM LOGIC
viewport.addEventListener("wheel", (e) => {
    e.preventDefault();

    // const zoomSpeed = 0.001;
    const delta = -e.deltaY;
    const factor = Math.pow(1.1, delta / 100);  // smooth exponential zoom

    zoomAtPoint(e.clientX, e.clientY, factor);

}, { passive: false });

function zoomAtPoint(mouseX, mouseY, factor) {
    const newScale = Math.min(Math.max(state.scale * factor, 0.05), 5);

    // offset the x/y so the point under the mouse stays put
    // newOffset = mousePos - (mousePos - oldOffset) * (newScale / oldScale)
    state.x = mouseX - (mouseX - state.x) * (newScale / state.scale);
    state.y = mouseY - (mouseY - state.y) * (newScale / state.scale);
    state.scale = newScale;

    update();
}

// PANNING LOGIC
viewport.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" && e.isPrimary === false) return;
    state.isPanning = true;
    state.lastMouseX = e.clientX;
    state.lastMouseY = e.clientY;
    viewport.style.cursor = "grabbing";
});

window.addEventListener("pointermove", (e) => {
    if (!state.isPanning) return;

    const dx = e.clientX - state.lastMouseX;
    const dy = e.clientY - state.lastMouseY;

    state.x += dx;
    state.y += dy;
    state.lastMouseX = e.clientX;
    state.lastMouseY = e.clientY;

    update();
});

window.addEventListener("pointerup", () => {
    state.isPanning = false;
    viewport.style.cursor = "grab";
});

// MOBILE PINCH-TO-ZOOM
viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
        state.isPanning = false;    // stop panning when pinching
        state.initialPinchDist = getDistance(e.touches);
        state.initialPinchScale = state.scale;
    }
});

viewport.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
        const dist = getDistance(e.touches);
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        const factor = dist / state.initialPinchDist;
        const targetScale = state.initialPinchScale * factor;
        const deltaFactor = targetScale / state.scale;

        zoomAtPoint(midX, midY, deltaFactor);
        state.initialPinchDist = dist;  // update for next move frame
        state.initialPinchScale = state.scale
    }
}, { passive: false });

function getDistance(touches) {
    return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
}

// RENDER
function update() {
    grid.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
}
