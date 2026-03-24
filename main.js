const viewport = document.getElementById("viewport");
const grid = document.getElementById("grid-container");

let scale = 1;
let originX = 0;
let originY = 0;
let isPanning = false;
let startX, startY;

// dummy cells
for (let i = 0; i < 400; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = i;
    grid.appendChild(cell);
}

// zooming logic
viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomSpeed = 0.025;
    if (e.deltaY < 0) {
        scale += zoomSpeed;
    } else {
        scale = Math.max(0.1, scale - zoomSpeed);
    }
    updateTransform();
}, { passive: false });

// panning logic
viewport.addEventListener("mousedown", (e) => {
    isPanning = true;
    viewport.style.cursor = "grabbing";
    startX = e.clientX - originX;
    startY = e.clientY - originY;
});

window.addEventListener("mousemove", (e) => {
    if (!isPanning) return;
    originX = e.clientX - startX;
    originY = e.clientY - startY;
    updateTransform();
});

window.addEventListener("mouseup", () => {
    isPanning = false;
    viewport.style.cursor = "grab";
});

function updateTransform() {
    grid.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
}
