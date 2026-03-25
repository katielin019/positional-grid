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

// === WHEEL LOGIC ===
viewport.addEventListener("wheel", (e) => {
    e.preventDefault();

    if (e.ctrlKey) {
        // pinch gesture -> ZOOM
        const delta = -e.deltaY;
        const zFactor = Math.pow(1.1, delta / 100);  // smooth exponential zoom
        zoomAtPoint(e.clientX, e.clientY, zFactor);
        
    } else {
        // two-finger swipe -> PAN
        state.x -= e.deltaX;
        state.y -= e.deltaY;

        update();
    }
}, { passive: false });

// === ZOOM LOGIC ===
function zoomAtPoint(mouseX, mouseY, factor) {
    const newScale = Math.min(Math.max(state.scale * factor, 0.05), 5);

    // offset the x/y so the point under the mouse stays put
    state.x = mouseX - (mouseX - state.x) * (newScale / state.scale);
    state.y = mouseY - (mouseY - state.y) * (newScale / state.scale);
    // update scale after calculating new offsets
    state.scale = newScale;

    update();
}

// === PANNING LOGIC ===
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

// === MOBILE PINCH-TO-ZOOM ===
viewport.addEventListener("touchmove", (e) => {
    e.preventDefault();     // stop page bounce

    if (e.touches.length === 2) {
        // PINCH-TO-ZOOM
        const dist = getDistance(e.touches);
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        // calculate how much the distance has changed since the last frame
        if (state.initialPinchDist > 0) {
            const zFactor = dist / state.initialPinchDist;
            zoomAtPoint(midX, midY, zFactor);
        }

        // const factor = dist / state.initialPinchDist;
        // const targetScale = state.initialPinchScale * factor;
        // const deltaFactor = targetScale / state.scale;

        // zoomAtPoint(midX, midY, deltaFactor);
        state.initialPinchDist = dist;  // update for next move frame
        // state.initialPinchScale = state.scale
    } else if (e.touches.length === 1) {
        // SINGLE FINGER PAN
        const touch = e.touches[0];
        const dx = touch.clientX - state.lastMouseX;
        const dy = touch.clientY - state.lastMouseY;

        state.x += dx;
        state.y += dy;

        state.lastMouseX = touch.clientX;
        state.lastMouseY = touch.clientY;
        
        update();
    }
}, { passive: false });

viewport.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
        state.lastMouseX = e.touches[0].clientX;
        state.lastMouseY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
        // state.isPanning = false;    // stop panning when pinching
        state.initialPinchDist = getDistance(e.touches);
        // state.initialPinchScale = state.scale;
    }
});

viewport.addEventListener("touchend", () => {
    state.initialPinchDist = 0;     // reset pinch memory
});

function getDistance(touches) {
    return Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
}

// === RENDER ===
function update() {
    grid.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
}
