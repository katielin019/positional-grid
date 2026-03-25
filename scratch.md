- ~~add a reset / return to home button?~~
    - needs to be sticky (?)
    - ~~positioned over the grid (z-index)~~
    - should i center it at the origin of the grid? or start it somewhere random? (instead of at the top left cell)
        - should i use local browser storage to track what cells have been visited / interacted with?
- think about / look into windowing and virtualization for performance optimization
    - DOM limitations won't be a problem until handling thousands of individual divs
    - not sure if there's a difference between windowing and virtualization or if they're functionally interchangeable
    - basically just only renders the cells currently visible in the viewport to offload some of the DOM tree
- i wonder if vectors could come into play at all with this concept
    - honestly i've only recently begun to intuitively understand vectors, and i'm still getting a feel for when to apply them conceptually vs. not

```js
viewport.addEventListener("wheel", (e) => {
    e.preventDefault();

    // pinch gesture -> ZOOM
    if (e.ctrlKey) {
        // The constant (0.005) controls the "sensitivity"
        // deltaY is negative when pinching "out" (enlarging)
        const factor = Math.pow(1.1, -e.deltaY * 0.005);
    } else {
    // two-finger swipe -> PAN
    }

    ...
});

function zoomAtPoint(mouseX, mouseY, factor) {
    ...
    // newOffset = mousePos - (mousePos - oldOffset) * (newScale / oldScale)
}
```

---

- ask about "smooth exponential zoom" in wheel logic (pinch gesture)
    - new zFactor is much more responsive (old one was slow) but is less smooth?
- in mobile pinch to zoom (`touchmove` event), do we not need to keep any of the code regarding `initialPinchScale` / `targetScale`?
    - do we not need to update `state.initialPinchScale`?
- do we not need to toggle `state.isPanning` in `touchstart` event?