- TODO: add a reset / return to home button?
    - needs to be sticky (?)
    - positioned over the grid (z-index)
    - should i center it at the origin of the grid? or start it somewhere random? (instead of at the top left cell)
        - should i use local browser storage to track what cells have been visited / interacted with?
- think about / look into windowing and virtualization for performance optimization
    - DOM limitations won't be a problem until handling thousands of individual divs
    - not sure if there's a difference between windowing and virtualization or if they're functionally interchangeable
    - basically just only renders the cells currently visible in the viewport to offload some of the DOM tree
- i wonder if vectors could come into play at all with this concept
    - honestly i've only recently begun to intuitively understand vectors, and i'm still getting a feel for when to apply them conceptually vs. not

```js
function zoomAtPoint(mouseX, mouseY, factor) {
    ...
    // newOffset = mousePos - (mousePos - oldOffset) * (newScale / oldScale)
}
```