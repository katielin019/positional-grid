const grid = document.getElementById("grid-container");
// const viewport = document.getElementById("viewport");

// dummy cells
for (let i = 0; i < 400; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = i;
    grid.appendChild(cell);
}

const pz = Panzoom(grid, {
    minZoom: 0.3,
    maxZoom: 1.35,
    beforeWheel: function(e) {
        const shouldIgnore = !(e.ctrlKey || e.metaKey || e.altKey);
        return shouldIgnore;
    },
});

pz.smoothZoom(500, 500, 0.3)
pz.on("zoom", () => {
    const scale = pz.getTransform().scale;
    // viewport.style.setProperty()
});
